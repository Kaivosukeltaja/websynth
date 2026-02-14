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
      // Retriggering same key (e.g. after octave change): stop previous oscillators immediately
      // so we don't have two notes (old + new) playing through the same VCA.
      this.nodes.forEach((node) => {
        node.stop(0);
        node.disconnect();
      });
      this.nodes = [];
    }

    const safeFreq = Number(freq);
    if (!Number.isFinite(safeFreq) || safeFreq <= 0) return;

    const safeAmount = Math.max(1, Math.min(Number(amount) || 1, 32));
    const safeDetune = Number(detune) || 0;
    const safeShape = shape || 'sine';

    let panToggle = -1;

    for (let i = 0; i < safeAmount; i++) {
      let oscDetune = 0;
      if (safeAmount > 1 && safeDetune !== 0) {
        oscDetune = 0 - safeDetune + i * (safeDetune * 2 / (safeAmount - 1));
      }
      let oscillator = this.context.createOscillator();
      let panner = this.context.createStereoPanner();

      oscillator.type = safeShape;
      oscillator.frequency.value = safeFreq;
      oscillator.detune.value = oscDetune;
      oscillator.connect(panner);
      panner.connect(this.vca.input);
      if (safeAmount > 1) {
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
