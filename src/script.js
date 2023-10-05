let audioContext = null;
let oscillator = null;
let filter = null;
let stepSequencer = Array(12).fill(Array(16).fill(false)); // Initialize a 12x16 grid with all steps set to false

let stepIndex = 0;
let stepInterval = null;
let tempo = 120;
let cutoff = 500; // Initial cutoff frequency
let resonance = 0; // Initial resonance
let decay = 50; // Initial decay
let accent = 50; // Initial accent (filter envelope depth)

function startAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function createTB303Sound() {
    startAudioContext();

    oscillator = audioContext.createOscillator();
    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = resonance;
    filter.frequency.value = cutoff;

    oscillator.type = 'sawtooth';
    oscillator.connect(filter);
    filter.connect(audioContext.destination);

    // Initialize the oscillator frequency to zero
    oscillator.frequency.value = 0;

    oscillator.start(0);
}

window.onload = function () {
    createTB303Sound();

    const sequencerGrid = document.getElementById('sequencer-grid');

    // Generate the 12x16 grid
    for (let i = 0; i < 12; i++) {
        const scaleRow = document.createElement('div');
        scaleRow.className = 'scale-row';

        // Add a label for the scale
        const scaleLabel = document.createElement('div');
        scaleLabel.className = 'scale-label';
        scaleLabel.textContent = 'Scale ' + (i + 1);
        scaleRow.appendChild(scaleLabel);

        for (let j = 0; j < 16; j++) {
            const button = document.createElement('button');
            button.dataset.scale = i;
            button.dataset.step = j;
            button.className = 'step-button';
            button.textContent = 'Step ' + (j + 1);

            button.addEventListener('click', function () {
                const scale = parseInt(this.dataset.scale);
                const step = parseInt(this.dataset.step);
                if (stepSequencer[scale][step]) {
                    stepSequencer[scale][step] = false;
                    button.style.backgroundColor = '';
                } else {
                    stepSequencer[scale][step] = true;
                    button.style.backgroundColor = 'blue';
                }
            });

            scaleRow.appendChild(button);
        }

        sequencerGrid.appendChild(scaleRow);
    }

    document.getElementById('cutoff').addEventListener('input', function () {
        cutoff = parseFloat(this.value);
        filter.frequency.value = cutoff;
    });

    document.getElementById('resonance').addEventListener('input', function () {
        resonance = parseFloat(this.value);
        filter.Q.value = resonance;
    });

    document.getElementById('decay').addEventListener('input', function () {
        decay = parseFloat(this.value);
    });

    document.getElementById('accent').addEventListener('input', function () {
        accent = parseFloat(this.value);
    });

    document.getElementById('tempo').addEventListener('input', function () {
        if (this.value !== undefined) {
            tempo = this.value;
            clearInterval(stepInterval);
            stepInterval = setInterval(() => {
                let isStepActive = false;
                for (let i = 0; i < 12; i++) {
                    if (stepSequencer[i][stepIndex]) {
                        oscillator.frequency.value = calculateNoteFrequency(i);
                        filterEnvelope();
                        isStepActive = true;
                        break; //
                    }
                }
                if (!isStepActive) {
                    oscillator.frequency.value = 0;
                }
                stepIndex = (stepIndex + 1) % 16; 
            }, 60000 / tempo);
        }
    });

    function filterEnvelope() {

        const baseFrequency = cutoff;
        const maxFrequency = cutoff + accent * 10; // 
        filter.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(maxFrequency, audioContext.currentTime + decay / 1000);
        filter.frequency.linearRampToValueAtTime(baseFrequency, audioContext.currentTime + decay / 500);
    }

    function calculateNoteFrequency(scale) {
     
        const scaleFrequencies = [
            261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
            587.33, 659.26, 698.46, 783.99
        ];
        return scaleFrequencies[scale];
    }

    const startStopButton = document.getElementById('start-button');
    startStopButton.addEventListener('click', function () {
        if (startStopButton.textContent === 'Start') {
            createTB303Sound();
            stepInterval = setInterval(() => {
                let isStepActive = false;
                for (let i = 0; i < 12; i++) {
                    if (stepSequencer[i][stepIndex]) {
                        oscillator.frequency.value = calculateNoteFrequency(i);
                        filterEnvelope();
                        isStepActive = true;
                        break; 
                    }
                }
                if (!isStepActive) {
                    oscillator.frequency.value = 0;
                }
                stepIndex = (stepIndex + 1) % 16; 
            }, 60000 / tempo);
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);
            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });
}
