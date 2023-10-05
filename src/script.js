let audioContext = null;
let sequence = [];
let oscillator = null;
let gainNode = null;
let filter = null;
let stepSequencer = [];

let stepIndex = 0;
let stepInterval = null;
let tempo = 120;

function startAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

window.onload = function() {
    startAudioContext();

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 8; // Increase resonance (Q) for a more intense squelchy sound

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

    const grid = document.getElementById('grid');
    for (let i = 0; i < 16; i++) {
        const button = document.createElement('button');
        button.textContent = 'Step ' + (i + 1);
        button.addEventListener('click', function() {
            const step = i;
            const frequency = 440 * Math.pow(2, (step - 9) / 12); // Convert step to frequency

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

    const startStopButton = document.getElementById('start-stop');
    startStopButton.addEventListener('click', function() {
        if (startStopButton.textContent === 'Start') {
            startAudioContext();
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 8; // Increase resonance (Q)
            oscillator.type = 'sawtooth';
            oscillator.detune.setValueAtTime(-24, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            stepInterval = setInterval(() => {
                const sequenceValue = sequence[stepIndex];
                oscillator.frequency.value = sequenceValue !== undefined ? sequenceValue : 0;
                stepIndex = (stepIndex + 1) % stepSequencer.length;
            }, 60000 / tempo);
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);
            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });
}
