export const __mockOscGroupInstance__ = {
  play: jest.fn(),
  stop: jest.fn(),
};

export default function MockOscGroup() {
  return __mockOscGroupInstance__;
}
