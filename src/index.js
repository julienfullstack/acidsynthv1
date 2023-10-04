import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

//this is where UI logic lives
const button = document.getElementById('start-stop');
button.addEventListener('click', function() {
    if (button.textContent === 'Start') {
        Tone.Transport.start();
        button.textContent = 'Stop';
    } else {
        Tone.Transport.stop();
        button.textContent = 'Start';
    }
});

document.getElementById('cutoff').addEventListener('input', function() {
  synth.filter.frequency.value = this.value;
});

document.getElementById('resonance').addEventListener('input', function() {
  synth.filter.Q.value = this.value;
});

document.getElementById('envelope').addEventListener('input', function() {
  synth.envelope.attack = this.value;
});

document.getElementById('decay').addEventListener('input', function() {
  synth.envelope.decay = this.value;
});

document.getElementById('accent').addEventListener('input', function() {
  synth.envelope.sustain = this.value;
});
