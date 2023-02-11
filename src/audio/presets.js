const presets = [
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

  export default presets