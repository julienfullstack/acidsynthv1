let audioContext = null;
let oscillator = null;
let filter = null;
let stepSequencer = Array(12).fill(Array(16).fill(false));

let stepIndex = 0;
let stepInterval = null;
let tempo = 120;
let cutoff = 500;
let resonance = 4;
let decay = 30;
let accent = 70;
let slide = 0;

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

    oscillator.frequency.value = 0;

    oscillator.start(0);
}

window.onload = function () {
    createTB303Sound();

    const sequencerGrid = document.getElementById('sequencer-grid');

    for (let i = 0; i < 12; i++) {
        const scaleRow = document.createElement('div');
        scaleRow.className = 'scale-row';

        for (let j = 0; j < 16; j++) {
            const button = document.createElement('button');
            button.dataset.scale = i;
            button.dataset.step = j;
            button.className = 'step-button';

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

    document.getElementById('slide').addEventListener('input', function () {
        slide = parseFloat(this.value);
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
                        break;
                    }
                }
                if (!isStepActive) {
                    oscillator.frequency.value = 0;
                }
                stepIndex = (stepIndex + 1) % 16;

                // Highlight the currently playing column
                highlightCurrentColumn();
            }, 60000 / tempo);
        }
    });

    function filterEnvelope() {
        const baseFrequency = cutoff;
        const maxFrequency = cutoff + accent * 10;

        filter.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(maxFrequency, audioContext.currentTime + decay / 1000);
        filter.frequency.linearRampToValueAtTime(baseFrequency, audioContext.currentTime + decay / 500);

        filter.Q.setValueAtTime(resonance, audioContext.currentTime);
        filter.Q.linearRampToValueAtTime(resonance * 3, audioContext.currentTime + decay / 1000);
        filter.Q.linearRampToValueAtTime(resonance, audioContext.currentTime + decay / 500);
    }

    function calculateNoteFrequency(scale) {
        const scaleFrequencies = [
            261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
            587.33, 659.26, 698.46, 783.99
        ];
        return scaleFrequencies[scale] * Math.pow(2, slide / 12);
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

                // Highlight the currently playing column
                highlightCurrentColumn();
            }, 60000 / tempo);
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);
            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });

    // Function to highlight the currently playing column
    function highlightCurrentColumn() {
        const allButtons = document.querySelectorAll('.step-button');
        allButtons.forEach(button => button.classList.remove('current-column'));

        const scaleRows = document.querySelectorAll('.scale-row');
        const currentStep = stepIndex % 16;

        scaleRows.forEach((scaleRow) => {
            const buttons = scaleRow.querySelectorAll('.step-button');
            buttons[currentStep].classList.add('current-column');
        });
    }
}
