import VCA from './VCA';

describe('VCA', () => {
  function createMockContext() {
    const gainRef = { value: 0 };
    return {
      createGain: jest.fn(() => ({
        gain: gainRef,
        connect: jest.fn(),
      })),
    };
  }

  test('constructor creates gain node with initial gain 0', () => {
    const context = createMockContext();
    const vca = new VCA(context);
    expect(context.createGain).toHaveBeenCalled();
    expect(vca.gain.gain.value).toBe(0);
    expect(vca.input).toBe(vca.gain);
    expect(vca.output).toBe(vca.gain);
    expect(vca.amplitude).toBe(vca.gain.gain);
  });

  test('connect with node that has input connects to node.input', () => {
    const context = createMockContext();
    const vca = new VCA(context);
    const target = { input: {} };
    vca.connect(target);
    expect(vca.output.connect).toHaveBeenCalledWith(target.input);
  });

  test('connect with node without input connects to node directly', () => {
    const context = createMockContext();
    const vca = new VCA(context);
    const target = {};
    vca.connect(target);
    expect(vca.output.connect).toHaveBeenCalledWith(target);
  });
});
