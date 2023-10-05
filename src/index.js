let synth = null;
let sequence = null;

window.onload = function() {

    synth = new Tone.MonoSynth({
        oscillator: {
            type: 'sawtooth'
        },
        envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 1,
            release: 0.8
        }
    }).toDestination();

    sequence = new Tone.Sequence((time, note) => {
        if (synth && note !== undefined) synth.triggerAttackRelease(note, '8n', time);
    }, []);

    Tone.Transport.bpm.value = 120;

    sequence.loop = true;
    sequence.start();

    const grid = document.getElementById('grid');
    for (let i = 0; i < 16; i++) {
        const button = document.createElement('button');
        button.textContent = 'Step ' + (i + 1);
        button.addEventListener('click', function() {
            const step = i;
            const note = 'C4';
            if (sequence && sequence.values && sequence.values[step] === note) {
                sequence.values[step] = null;
                button.style.backgroundColor = '';
            } else if (sequence && sequence.values) {
                sequence.values[step] = note;
                button.style.backgroundColor = 'blue';
            }
        });
        grid.appendChild(button);
    }

    ['cutoff', 'resonance', 'envelope', 'decay', 'accent'].forEach(control => {
        document.getElementById(control).addEventListener('input', function() {
            if (synth && synth.filter && this.value !== undefined) {
                synth.filter.frequency.value = this.value;
            }
        });
    });

    const startStopButton = document.getElementById('start-stop');
    startStopButton.addEventListener('click', function() {
        if (startStopButton.textContent === 'Start') {
            Tone.Transport.start();
            startStopButton.textContent = 'Stop';
        } else {
            Tone.Transport.stop();
            startStopButton.textContent = 'Start';
        }
    });
}