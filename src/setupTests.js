// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Web Audio API is not available in jsdom; provide a minimal mock so App can load.
if (typeof window !== 'undefined' && !window.AudioContext) {
  const noop = () => {};
  const gainNode = { gain: { value: 0 }, connect: noop };
  const resumeFn = () => Promise.resolve();
  window.AudioContext = function () {
    return {
      resume: resumeFn,
      createGain: () => ({ gain: { value: 0 }, connect: noop }),
      createOscillator: () => ({
        connect: noop, start: noop, stop: noop,
        frequency: { value: 0 }, detune: { value: 0 }, type: 'sine',
      }),
      createBiquadFilter: () => ({ frequency: { value: 0 }, connect: noop }),
      createConvolver: () => ({ buffer: null, connect: noop }),
      createDelay: () => ({ delayTime: { value: 0 }, connect: noop }),
      createStereoPanner: () => ({ pan: { value: 0 }, connect: noop }),
      destination: {},
      currentTime: 0,
      decodeAudioData: () => Promise.resolve(),
    };
  };
}
