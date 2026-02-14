import presets from './presets';

const requiredPresetKeys = [
  'id',
  'name',
  'oscillators',
  'shape',
  'detune',
  'reverb',
  'delay',
  'filter',
  'envelope',
];

const requiredDelayKeys = ['gain', 'delayTime'];
const requiredFilterKeys = ['speed', 'depth', 'frequency'];
const requiredEnvelopeKeys = ['attack', 'decay', 'sustain', 'release'];

describe('presets', () => {
  test('is a non-empty array', () => {
    expect(Array.isArray(presets)).toBe(true);
    expect(presets.length).toBeGreaterThan(0);
  });

  test('each preset has required top-level keys', () => {
    presets.forEach((preset, index) => {
      requiredPresetKeys.forEach((key) => {
        expect(preset).toHaveProperty(key);
        expect(preset[key]).not.toBeUndefined();
      });
    });
  });

  test('each preset has valid delay object', () => {
    presets.forEach((preset) => {
      requiredDelayKeys.forEach((key) => {
        expect(preset.delay).toHaveProperty(key);
        expect(typeof preset.delay.gain).toBe('number');
        expect(typeof preset.delay.delayTime).toBe('number');
        expect(preset.delay.gain).toBeGreaterThanOrEqual(0);
      });
    });
  });

  test('each preset has valid filter object', () => {
    presets.forEach((preset) => {
      requiredFilterKeys.forEach((key) => {
        expect(preset.filter).toHaveProperty(key);
        expect(typeof preset.filter.frequency).toBe('number');
        expect(preset.filter.frequency).toBeGreaterThan(0);
      });
    });
  });

  test('each preset has valid envelope object', () => {
    presets.forEach((preset) => {
      requiredEnvelopeKeys.forEach((key) => {
        expect(preset.envelope).toHaveProperty(key);
        expect(typeof preset.envelope[key]).toBe('number');
      });
      expect(preset.envelope.sustain).toBeGreaterThanOrEqual(0);
      expect(preset.envelope.sustain).toBeLessThanOrEqual(1);
    });
  });

  test('preset ids are unique', () => {
    const ids = presets.map((p) => p.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('oscillators count is between 1 and 32', () => {
    presets.forEach((preset) => {
      expect(preset.oscillators).toBeGreaterThanOrEqual(1);
      expect(preset.oscillators).toBeLessThanOrEqual(32);
    });
  });

  test('shape is a valid oscillator type', () => {
    const validShapes = ['sine', 'square', 'sawtooth', 'triangle'];
    presets.forEach((preset) => {
      expect(validShapes).toContain(preset.shape);
    });
  });
});
