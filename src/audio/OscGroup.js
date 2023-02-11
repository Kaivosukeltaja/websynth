import EnvelopeGenerator from "./EnvelopeGenerator";
import VCA from "./VCA";

class OscGroup {
  constructor(audioContext, destination) {
    this.nodes = [];
    this.context = audioContext;
    this.destination = destination;
    this.vca = new VCA(audioContext);
    this.vca.connect(this.destination);
    this.envelope = new EnvelopeGenerator(audioContext);
    this.envelope.connect(this.vca.amplitude);
  }

  // play(440, 5, 4) should give 5 oscillators with detuning -4, -2, 0, 2, 4
  play(freq, amount, detune, shape) {
    if (this.nodes.length !== 0) {
      // Something's still playing, let's stop it first
      this.stop();
    }

    let panToggle = -1;

    for (let i = 0; i < amount; i++) {
      let oscDetune = 0;
      if (detune !== 0) {
        oscDetune = 0 - detune + i * (detune * 2 / (amount - 1));
      }
      let oscillator = this.context.createOscillator();
      let panner = this.context.createStereoPanner();

      oscillator.type = shape;
      oscillator.frequency.value = freq;
      oscillator.detune.value = oscDetune;
      oscillator.connect(panner);
      panner.connect(this.vca.input);
      if (amount > 1) {
        panner.pan.value = panToggle;
        panToggle *= -1;
      } else {
        panner.pan.value = 0;
      }
      this.envelope.trigger();
      oscillator.start(0);

      this.nodes.push(oscillator);
    }
  }

  stop() {
    // Enter the release phase of the envelope and request a callback.
    // On callback stop the oscillators and release them.
    this.envelope.untrigger(() => {
      this.nodes.forEach((node) => {
        node.stop(0);
        node.disconnect();
      });
      this.nodes = [];
    });
  }
}

export default OscGroup
