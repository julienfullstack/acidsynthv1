let audioContext = null;
let sequence = [];
let oscillator = null;
let gainNode = null;
let stepSequencer = [];

let stepIndex = 0;
let stepInterval = null;

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

    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const grid = document.getElementById('grid');
    for (let i = 0; i < 16; i++) {
        const button = document.createElement('button');
        button.textContent = 'Step ' + (i + 1);
        button.addEventListener('click', function() {
            const step = i;
            const frequency = audioContext.frequencyToLogarithm ? audioContext.frequencyToLogarithm('C4') : 261.63; //default to C4 if no frequencyToLogarithm function
            if (sequence[step] === frequency) {
                sequence[step] = null;
                button.style.backgroundColor = '';
            } else {
                sequence[step] = frequency;
                stepSequencer[step] = frequency;
                button.style.backgroundColor = 'blue';
            }
        });
        grid.appendChild(button);
    }

    ['cutoff', 'resonance', 'envelope', 'decay', 'accent'].forEach(control => {
        document.getElementById(control).addEventListener('input', function() {
            if (this.value !== undefined) {
                gainNode.gain.value = this.value;
            }
        });
    });

    const startStopButton = document.getElementById('start-stop');
    startStopButton.addEventListener('click', function() {
        if (startStopButton.textContent === 'Start') {
            startAudioContext();
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            oscillator.type = 'sawtooth';
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            stepInterval = setInterval(() => {
                const sequenceValue = sequence[stepIndex];
                oscillator.frequency.value = sequenceValue !== undefined ? sequenceValue : 0;
                stepIndex = (stepIndex + 1) % stepSequencer.length;
            }, 500); //Change the interval as per requirement
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);
            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });
}