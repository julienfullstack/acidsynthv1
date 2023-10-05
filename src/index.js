let audioContext = null;
let sequence = [];
let oscillator = null;
let gainNode = null;
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

    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const grid = document.getElementById('grid');
    for (let i = 0; i < 16; i++) {
        const button = document.createElement('button');
        button.textContent = 'Step ' + (i + 1);
        button.addEventListener('click', function() {
            const step = i;
            const frequency = audioContext.frequencyToLogarithm ? audioContext.frequencyToLogarithm('C4') : 261.63; 
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

    ['cutoff', 'resonance', 'envelope', 'decay', 'accent','frequency'].forEach(control => {
        document.getElementById(control).addEventListener('input', function() {
            if (this.value !== undefined) {
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
            }, 60000/tempo); 
        }
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
            }, 60000/tempo); 
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(stepInterval);
            oscillator.stop(0);
            startStopButton.textContent = 'Start';
        }
    });
}
