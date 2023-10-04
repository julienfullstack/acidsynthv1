const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
      type: 'sawtooth',
      partials: [0.2, 1, 0.02, 0.01]
  },
  filter: {
      type: 'lowpass',
      rolloff: -24,
      Q: 1,
      frequency: 1000
  },
  envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 1,
      release: 0.8,
  },
}).toDestination();
