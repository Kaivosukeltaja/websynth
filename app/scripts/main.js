
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var presets = [
  {
    id: 0,
    name: 'Pure sine',
    oscillators: 1,
    shape: 'sine',
    detune: 0,
    reverb: 0,
    delay: {
      gain: 0,
      delayTime: 0
    },
    filter: {
      speed: 0,
      depth: 0,
      frequency: 6000
    },
    envelope: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0
    }
  },
  {
    id: 1,
    name: 'Trance pad',
    oscillators: 5,
    shape: 'sawtooth',
    detune: 10,
    reverb: 0.3,
    delay: {
      gain: 0.3,
      delayTime: 0.4
    },
    filter: {
      speed: 0.1,
      depth: 1500,
      frequency: 1900
    },
    envelope: {
      attack: 0.3,
      decay: 0.5,
      sustain: 0.7,
      release: 0.5
    }
  },

];

var keyboard = new QwertyHancock({
    id: 'keyboard',
    width: 626,
    height: 150,
    octaves: 2,
    startNote: 'A3',
    whiteNotesColour: 'white',
    blackNotesColour: 'black',
    hoverColour: 'purple'
  }),
  context = new AudioContext(),
  masterGain = context.createGain(),
  masterWet = context.createGain(),
  reverb = context.createConvolver(),
  filter = context.createBiquadFilter(),
  lfo = context.createOscillator(),
  lfoGain = context.createGain(),
  delayGain = context.createGain(),
  delay = context.createDelay(),
  settings = presets[0],
  reverbBuffer = 0,
  nodes = [],
  oscgroups = {};

filter.frequency.value = 1900;
filter.connect(reverb);
filter.connect(delay);
filter.connect(masterGain);

lfo.type = 'sine';
lfo.frequency.value = 0.1;
lfo.connect(lfoGain);
lfoGain.gain.value = 1500;
lfoGain.connect(filter.frequency);
lfo.start(0);

delay.delayTime.value = 0.5;
delay.connect(delayGain);
delayGain.gain.value = 0.2;
// delayGain.connect(reverb);
delayGain.connect(masterGain);

reverb.connect(masterWet);

masterGain.gain.value = 0.3;
masterWet.gain.value = 0.3;
masterGain.connect(context.destination);
masterWet.connect(context.destination);


keyboard.keyDown = function (note, frequency) {
  let osc = oscgroups[note] = oscgroups[note] || new OscGroup(context, filter);
  osc.play(frequency, settings.oscillators, settings.detune, settings.shape);
};

keyboard.keyUp = function (note, frequency) {
  oscgroups[note].stop();
};

var irHallRequest = new XMLHttpRequest();
irHallRequest.open('GET', 'irHall.ogg', true);
irHallRequest.responseType = 'arraybuffer';
irHallRequest.onload = function() {
  context.decodeAudioData( irHallRequest.response, function(buffer) {
    reverb.buffer = reverbBuffer = buffer;
  });
}
irHallRequest.send();

var loadPreset = function(preset) {
  // Change display
  $('#preset-name').html(preset.name);
  $('.nav li').removeClass('active');
  $('#preset-' + preset.id).addClass('active');

  // Change setting for new oscillators
  settings = preset;

  // Adjust global effects
  masterWet.gain.value = settings.reverb;
  delay.delayTime.value = settings.delay.delayTime;
  delayGain.gain.value = settings.delay.gain;

  filter.frequency.value = settings.filter.frequency;
  lfo.frequency.value = settings.filter.speed;
  lfoGain.gain.value = settings.filter.depth;

/*
    envelope: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0
    }
    */
}

loadPreset(presets[0]);
