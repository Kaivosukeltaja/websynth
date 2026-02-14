import { render } from '@testing-library/react';
import Keyboard from './Keyboard';

const mockKeyDown = jest.fn();
const mockKeyUp = jest.fn();

jest.mock('qwerty-hancock', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(function (config) {
    this.keyDown = null;
    this.keyUp = null;
    this.config = config;
  }),
}));

test('renders keyboard container div with id keyboard', () => {
  render(<Keyboard keyDown={mockKeyDown} keyUp={mockKeyUp} />);
  const el = document.getElementById('keyboard');
  expect(el).toBeInTheDocument();
});

test('instantiates QwertyHancock with expected config', () => {
  const QwertyHancock = require('qwerty-hancock').default;
  render(<Keyboard keyDown={mockKeyDown} keyUp={mockKeyUp} />);
  expect(QwertyHancock).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'keyboard',
      width: '640',
      height: '180',
      octaves: '2',
      startNote: 'C3',
    })
  );
});
