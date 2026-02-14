import OscGroup from './OscGroup';

// Full fake context so real VCA and EnvelopeGenerator work without Web Audio API
function createMockContext() {
  const oscillators = [];
  const gainParam = {
    value: 0,
    cancelScheduledValues: jest.fn(),
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
  };
  const createGain = jest.fn(() => ({
    gain: gainParam,
    connect: jest.fn(),
    input: {},
    amplitude: gainParam,
  }));
  const createOscillator = jest.fn(() => {
    const osc = {
      type: 'sine',
      frequency: { value: 440 },
      detune: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      disconnect: jest.fn(),
    };
    oscillators.push(osc);
    return osc;
  });
  const createStereoPanner = jest.fn(() => ({
    pan: { value: 0 },
    connect: jest.fn(),
  }));
  return {
    createGain,
    createOscillator,
    createStereoPanner,
    currentTime: 0,
    oscillators,
  };
}

describe('OscGroup', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('constructor creates VCA and connects to destination', () => {
    const context = createMockContext();
    const destination = {};
    new OscGroup(context, destination);
    expect(context.createGain).toHaveBeenCalled();
    const gainNode = context.createGain.mock.results[0].value;
    expect(gainNode.connect).toHaveBeenCalledWith(destination);
  });

  test('play with invalid frequency does not add oscillators', () => {
    const context = createMockContext();
    const oscGroup = new OscGroup(context, {});
    oscGroup.play(NaN, 1, 0, 'sine');
    expect(context.oscillators.length).toBe(0);
    oscGroup.play(0, 1, 0, 'sine');
    expect(context.oscillators.length).toBe(0);
    oscGroup.play(-100, 1, 0, 'sine');
    expect(context.oscillators.length).toBe(0);
  });

  test('play with valid frequency creates oscillators and triggers envelope', () => {
    const context = createMockContext();
    const oscGroup = new OscGroup(context, {});
    oscGroup.play(440, 2, 10, 'sawtooth');
    expect(context.createOscillator).toHaveBeenCalledTimes(2);
    expect(context.oscillators.length).toBe(2);
    expect(context.oscillators[0].frequency.value).toBe(440);
    expect(context.oscillators[0].type).toBe('sawtooth');
    expect(context.oscillators[0].start).toHaveBeenCalled();
  });

  test('play clamps oscillator count between 1 and 32', () => {
    const context = createMockContext();
    const oscGroup = new OscGroup(context, {});
    oscGroup.play(440, 0, 0, 'sine');
    expect(context.createOscillator).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
    const context2 = createMockContext();
    const oscGroup2 = new OscGroup(context2, {});
    oscGroup2.play(440, 50, 0, 'sine');
    expect(context2.createOscillator).toHaveBeenCalledTimes(32);
  });

  test('stop eventually stops oscillators via envelope release', () => {
    jest.useFakeTimers();
    const context = createMockContext();
    const oscGroup = new OscGroup(context, {});
    oscGroup.play(440, 1, 0, 'sine');
    expect(context.oscillators.length).toBe(1);
    oscGroup.stop();
    jest.advanceTimersByTime(200);
    expect(context.oscillators[0].stop).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
