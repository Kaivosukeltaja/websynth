function MockSynth() {
  return {
    loadPreset: jest.fn(),
    keyDown: jest.fn(),
    keyUp: jest.fn(),
    allNotesOff: jest.fn(),
    disconnect: jest.fn(),
  };
}

export default MockSynth;
