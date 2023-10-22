// Initialize the audio and UI when the window loads
window.onload = initAudio;

// Global variables
let audioContext = null;
let sequence = [];
let oscillator = null;
let gainNode = null;
let filter = null;
let stepSequencer = [];
let stepIndex = 0;
let stepInterval = null;
let tempo = 120;
let swing = 0.01;
let constantFrequency = true;

// Function to start the audio context
function startAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Function to initialize the audio and UI
function initAudio() {
    startAudioContext();

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 20; // Increase resonance (Q) for a more intense squelchy sound

    oscillator.type = 'sawtooth'; // Use a sawtooth waveform
    oscillator.detune.setValueAtTime(-24, audioContext.currentTime); // Detune oscillator for character
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Start with a low frequency

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Apply filter envelope for a typical acid bassline
    const filterEnvelope = audioContext.createGain();
    filterEnvelope.gain.value = 0; // Initialize envelope gain to 0
    filterEnvelope.connect(filter.frequency);

    // Create step buttons
    const grid = document.getElementById('grid');
    for (let i = 0; i < 16; i++) {
        const button = document.createElement('button');
        button.textContent = 'Step ' + (i + 1);
        button.addEventListener('click', function() {
            const step = i;
            const frequency = 220; // Adjust the base frequency as needed

            if (sequence[step] === frequency) {
                sequence[step] = null;
                button.style.backgroundColor = '';

                // Release the envelope when the button is turned off
                const currentTime = audioContext.currentTime;
                filterEnvelope.gain.cancelScheduledValues(currentTime);
                filterEnvelope.gain.setValueAtTime(filterEnvelope.gain.value, currentTime);
                filterEnvelope.gain.linearRampToValueAtTime(0, currentTime + 0.3); // Release time (adjust as needed)
            } else {
                sequence[step] = frequency;
                stepSequencer[step] = frequency;
                button.style.backgroundColor = 'blue';

                // Trigger the envelope when the button is turned on
                const currentTime = audioContext.currentTime;
                filterEnvelope.gain.cancelScheduledValues(currentTime);
                filterEnvelope.gain.setValueAtTime(filterEnvelope.gain.value, currentTime);
                filterEnvelope.gain.linearRampToValueAtTime(1, currentTime + 0.05); // Attack time (adjust as needed)
            }
        });
        grid.appendChild(button);
    }

    // Create event listeners for audio parameter controls
    ['cutoff', 'resonance', 'envelope', 'decay', 'accent'].forEach(control => {
        document.getElementById(control).addEventListener('input', function() {
            if (this.id === 'cutoff') {
                filter.frequency.value = parseFloat(this.value) * 4000; // Adjust cutoff frequency
            } else if (this.id === 'resonance') {
                filter.Q.value = parseFloat(this.value); // Adjust resonance (Q)
            } else {
                gainNode.gain.value = this.value;
            }
        });
    });

    // Create event listener for tempo control
    document.getElementById('tempo').addEventListener('input', function() {
        if (this.value !== undefined) {
            tempo = this.value;
            clearInterval(stepInterval);
            stepInterval = setInterval(() => {
                const sequenceValue = sequence[stepIndex];
                oscillator.frequency.value = sequenceValue !== undefined ? sequenceValue : 0;
                stepIndex = (stepIndex + 1) % stepSequencer.length;
            }, 60000 / tempo);
        }
    });

    // Create event listener for tuning control
    document.getElementById('tuning').addEventListener('input', function() {
        const tuning = parseInt(this.value);

        // Apply tuning to each step in the sequence
        for (let i = 0; i < 16; i++) {
            const baseFrequency = 440; // Adjust the base frequency as needed
            const scaleFactors = [1, 1.0595, 1.1225, 1.1892, 1.2599]; // Adjust scale factors for your scale
            let frequency = baseFrequency * scaleFactors[i % scaleFactors.length];

            // Apply tuning offset
            frequency *= Math.pow(2, tuning / 12);

            // Update the sequence and stepSequencer arrays
            sequence[i] = frequency;
            stepSequencer[i] = frequency;
        }
    });

    // Create event listener for swing control
    document.getElementById('swing').addEventListener('input', function() {
        swing = parseFloat(this.value);
    });

    // Create event listener for start/stop button
    const startStopButton = document.getElementById('start-stop');
    let currentOscillators = Array(16).fill(null);

    startStopButton.addEventListener('click', function () {
        if (startStopButton.textContent === 'Start') {
            startAudioContext();

            // Ensure all oscillators are stopped and disconnected
            currentOscillators.forEach((oscillator, index) => {
                if (oscillator) {
                    oscillator.stop(0);
                    oscillator.disconnect();
                    currentOscillators[index] = null;
                }
            });

            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 20; // Increase resonance (Q)
            oscillator.type = 'sawtooth';
            oscillator.detune.setValueAtTime(-24, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(0, audioContext.currentTime); // Set initial frequency to 0
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            stepIndex = 0; // Reset the stepIndex to zero

            stepInterval = setInterval(() => {
                const sequenceValue = stepSequencer[stepIndex];

                if (sequenceValue !== undefined) {
                    if (currentOscillators[stepIndex] === null) {
                        currentOscillators[stepIndex] = audioContext.createOscillator();
                        currentOscillators[stepIndex].type = 'sawtooth';
                        currentOscillators[stepIndex].connect(filter);
                        currentOscillators[stepIndex].start(0);
                    }
                    currentOscillators[stepIndex].frequency.setValueAtTime(sequenceValue, audioContext.currentTime);
                } else {
                    // Stop and disconnect the oscillator for deactivated steps
                    if (currentOscillators[stepIndex]) {
                        currentOscillators[stepIndex].stop(0);
                        currentOscillators[stepIndex].disconnect();
                        currentOscillators[stepIndex] = null;
                    }
                }

                stepIndex = (stepIndex + 1) % stepSequencer.length;
            }, 60000 / tempo);

            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);

            // Ensure all oscillators are stopped and disconnected
            currentOscillators.forEach((oscillator, index) => {
                if (oscillator) {
                    oscillator.stop(0);
                    oscillator.disconnect();
                    currentOscillators[index] = null;
                }
            });

            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });
}
