import Synth from './Synth';
import { __mockOscGroupInstance__ as mockOscGroupInstance } from './OscGroup';

jest.mock('./OscGroup');

function createMockContext() {
  const mockConnect = jest.fn();
  return {
    createGain: jest.fn(() => ({ gain: { value: 0 }, connect: mockConnect })),
    createOscillator: jest.fn(() => ({
      type: 'sine',
      frequency: { value: 0 },
      connect: mockConnect,
      start: jest.fn(),
      stop: jest.fn(),
    })),
    createBiquadFilter: jest.fn(() => ({ frequency: { value: 0 }, connect: mockConnect })),
    createConvolver: jest.fn(() => ({ buffer: null, connect: mockConnect })),
    createDelay: jest.fn(() => ({ delayTime: { value: 0 }, connect: mockConnect })),
    destination: {},
    currentTime: 0,
  };
}

describe('Synth', () => {
  let context;

  beforeEach(() => {
    jest.clearAllMocks();
    context = createMockContext();
  });

  test('constructor initializes filter, LFO, delay, reverb and gain nodes', () => {
    new Synth(context);
    expect(context.createBiquadFilter).toHaveBeenCalled();
    expect(context.createOscillator).toHaveBeenCalled();
    expect(context.createGain).toHaveBeenCalled();
    expect(context.createConvolver).toHaveBeenCalled();
    expect(context.createDelay).toHaveBeenCalled();
  });

  test('loadPreset updates settings and effect parameters', () => {
    const synth = new Synth(context);
    const preset = {
      reverb: 0.5,
      delay: { delayTime: 0.3, gain: 0.2 },
      filter: { frequency: 2000, speed: 0.2, depth: 1000 },
    };
    synth.loadPreset(preset);
    expect(synth.settings).toBe(preset);
    expect(synth.masterWet.gain.value).toBe(0.5);
    expect(synth.delay.delayTime.value).toBe(0.3);
    expect(synth.delayGain.gain.value).toBe(0.2);
    expect(synth.filter.frequency.value).toBe(2000);
    expect(synth.lfo.frequency.value).toBe(0.2);
    expect(synth.lfoGain.gain.value).toBe(1000);
  });

  test('keyDown creates or reuses OscGroup and calls play with frequency and settings', () => {
    const synth = new Synth(context);
    synth.settings = {
      oscillators: 3,
      detune: 8,
      shape: 'sawtooth',
      envelope: {},
    };
    synth.keyDown('C4', 261.63);
    expect(mockOscGroupInstance.play).toHaveBeenCalledWith(261.63, 3, 8, 'sawtooth');
  });

  test('keyUp stops OscGroup for the note', () => {
    const synth = new Synth(context);
    synth.settings = {};
    synth.keyDown('C4', 261.63);
    expect(mockOscGroupInstance.stop).not.toHaveBeenCalled();
    synth.keyUp('C4');
    expect(mockOscGroupInstance.stop).toHaveBeenCalled();
  });

  test('keyUp does nothing when no OscGroup for note', () => {
    const synth = new Synth(context);
    expect(() => synth.keyUp('C4')).not.toThrow();
  });

  test('allNotesOff stops all osc groups and clears oscgroups', () => {
    const synth = new Synth(context);
    synth.settings = {};
    synth.keyDown('C4', 261.63);
    synth.keyDown('D4', 293.66);
    expect(Object.keys(synth.oscgroups).length).toBe(2);
    synth.allNotesOff();
    expect(mockOscGroupInstance.stop).toHaveBeenCalledTimes(2);
    expect(Object.keys(synth.oscgroups).length).toBe(0);
  });

  test('disconnect does not throw', () => {
    const synth = new Synth(context);
    expect(() => synth.disconnect()).not.toThrow();
  });
});
