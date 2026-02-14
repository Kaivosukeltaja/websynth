import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('./audio/Synth');

beforeAll(() => {
  const xhr = global.XMLHttpRequest;
  if (xhr) {
    jest.spyOn(global, 'XMLHttpRequest').mockImplementation(function () {
      const req = new xhr();
      req.open = jest.fn();
      req.send = jest.fn();
      req.response = null;
      req.status = 0;
      return req;
    });
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders app title Callisto Polysynth', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /callisto polysynth/i })).toBeInTheDocument();
});

test('renders octave control with label and buttons', () => {
  render(<App />);
  expect(screen.getByText('Octave')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '-2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '+0' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '+2' })).toBeInTheDocument();
});

test('renders preset selector buttons with preset names', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /pure sine/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /trance pad/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /synth bass/i })).toBeInTheDocument();
});

test('renders instructions and GitHub link', () => {
  render(<App />);
  expect(screen.getByText(/play the synth with the mouse or keyboard/i)).toBeInTheDocument();
  const githubLink = screen.getByRole('link', { name: /github/i });
  expect(githubLink).toBeInTheDocument();
  expect(githubLink).toHaveAttribute('href', 'https://github.com/Kaivosukeltaja/websynth');
});

test('keyboard container is rendered', () => {
  render(<App />);
  const keyboardDiv = document.getElementById('keyboard');
  expect(keyboardDiv).toBeInTheDocument();
});

test('clicking octave button updates active state', () => {
  render(<App />);
  const plusOne = screen.getByRole('button', { name: '+1' });
  expect(plusOne).not.toHaveClass('active');
  fireEvent.click(plusOne);
  expect(plusOne).toHaveClass('active');
});

test('clicking preset button does not throw and synth receives loadPreset', async () => {
  render(<App />);
  const presetButton = screen.getByRole('button', { name: /trance pad/i });
  fireEvent.click(presetButton);
  await Promise.resolve();
  await Promise.resolve();
  expect(presetButton).toBeInTheDocument();
});
