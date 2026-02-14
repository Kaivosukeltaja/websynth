import EnvelopeGenerator from './EnvelopeGenerator';

describe('EnvelopeGenerator', () => {
  test('constructor sets default times and sustain', () => {
    const context = { currentTime: 0 };
    const env = new EnvelopeGenerator(context);
    expect(env.attackTime).toBe(0.05);
    expect(env.decayTime).toBe(0.2);
    expect(env.releaseTime).toBe(0.1);
    expect(env.sustainLevel).toBe(0.1);
    expect(env.gainNode).toBeNull();
  });

  test('connect stores gain node reference', () => {
    const context = { currentTime: 0 };
    const env = new EnvelopeGenerator(context);
    const gainNode = {};
    env.connect(gainNode);
    expect(env.gainNode).toBe(gainNode);
  });

  test('trigger schedules attack and decay on gain node', () => {
    const context = { currentTime: 100 };
    const env = new EnvelopeGenerator(context);
    const cancelScheduledValues = jest.fn();
    const setValueAtTime = jest.fn();
    const linearRampToValueAtTime = jest.fn();
    env.connect({
      cancelScheduledValues,
      setValueAtTime,
      linearRampToValueAtTime,
    });
    env.trigger();
    expect(cancelScheduledValues).toHaveBeenCalledWith(100);
    expect(setValueAtTime).toHaveBeenCalledWith(0, 100);
    expect(linearRampToValueAtTime).toHaveBeenCalledWith(1, 100 + 0.05);
    expect(linearRampToValueAtTime).toHaveBeenCalledWith(0.1, 100 + 0.05 + 0.2);
  });

  test('untrigger schedules release and sets timeout for callback', () => {
    jest.useFakeTimers();
    const context = { currentTime: 200 };
    const env = new EnvelopeGenerator(context);
    env.releaseTime = 0.15;
    const cancelScheduledValues = jest.fn();
    const linearRampToValueAtTime = jest.fn();
    env.connect({
      cancelScheduledValues,
      setValueAtTime: jest.fn(),
      linearRampToValueAtTime,
    });
    const callback = jest.fn();
    env.untrigger(callback);
    expect(cancelScheduledValues).toHaveBeenCalledWith(200);
    expect(linearRampToValueAtTime).toHaveBeenCalledWith(0, 200 + 0.15);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
