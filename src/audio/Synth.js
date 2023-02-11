import OscGroup from "./OscGroup";

class Synth {
    constructor(audioContext) {
        this.context = audioContext;
        this.masterGain = this.context.createGain();
        this.masterWet = this.context.createGain();
        this.reverb = this.context.createConvolver();
        this.filter = this.context.createBiquadFilter();
        this.lfo = this.context.createOscillator();
        this.lfoGain = this.context.createGain();
        this.delayGain = this.context.createGain();
        this.delay = this.context.createDelay();
        this.settings = {};
        this.reverbBuffer = 0;
        this.nodes = [];
        this.oscgroups = {};

        this.initializeFilter(1900, [this.reverb, this.delay, this.masterGain])
        this.initializeLFO()
        this.initializeDelay()
        this.initializeReverb()
        this.initializeGain()
    }

    disconnect() {
        // TODO stop all audio and free resources
    }

    initializeFilter(frequency, connections) {
        this.filter.frequency.value = frequency;
        connections.forEach((connection) => {
            this.filter.connect(connection);
        })
    }

    initializeLFO() {
        this.lfo.type = 'sine';
        this.lfo.frequency.value = 0.1;
        this.lfo.connect(this.lfoGain);
        this.lfoGain.gain.value = 1500;
        this.lfoGain.connect(this.filter.frequency);
        this.lfo.start(0);
    }

    initializeDelay() {        
        this.delay.delayTime.value = 0.5;
        this.delay.connect(this.delayGain);
        this.delayGain.gain.value = 0.2;
        this.delayGain.connect(this.masterGain);
    }

    initializeReverb() {
        this.reverb.connect(this.masterWet);
        this.loadReverbImpulse();
    }

    initializeGain() {
        this.masterGain.gain.value = 0.3;
        this.masterWet.gain.value = 0.3;
        this.masterGain.connect(this.context.destination);
        this.masterWet.connect(this.context.destination);        
    }

    loadPreset(preset) {
        this.settings = preset

        // Adjust global effects
        this.masterWet.gain.value = preset.reverb;
        this.delay.delayTime.value = preset.delay.delayTime;
        this.delayGain.gain.value = preset.delay.gain;

        this.filter.frequency.value = preset.filter.frequency;
        this.lfo.frequency.value = preset.filter.speed;
        this.lfoGain.gain.value = preset.filter.depth;
    }

    keyDown(note, frequency) {
        let osc = this.oscgroups[note] = this.oscgroups[note] || new OscGroup(this.context, this.filter);
        osc.play(frequency, this.settings.oscillators, this.settings.detune, this.settings.shape);
    }

    keyUp(note) {
        this.oscgroups[note].stop();
    }

    loadReverbImpulse() {
        const irHallRequest = new XMLHttpRequest();
        irHallRequest.open('GET', 'irHall.ogg', true);
        irHallRequest.responseType = 'arraybuffer';
        irHallRequest.onload = () => {
            this.context.decodeAudioData(irHallRequest.response, (buffer) => {
                this.reverb.buffer = this.reverbBuffer = buffer;
            });
        }
        irHallRequest.send();
    }
      
          
}

export default Synth
