import { render, screen, fireEvent } from '@testing-library/react';
import PresetSelector from './PresetSelector';

test('renders preset name as button text', () => {
  const preset = { id: 1, name: 'Test Preset' };
  render(<PresetSelector preset={preset} onSelect={jest.fn()} />);
  expect(screen.getByRole('button', { name: 'Test Preset' })).toBeInTheDocument();
});

test('calls onSelect with preset when button is clicked', () => {
  const preset = { id: 2, name: 'Trance Pad' };
  const onSelect = jest.fn();
  render(<PresetSelector preset={preset} onSelect={onSelect} />);
  fireEvent.click(screen.getByRole('button', { name: 'Trance Pad' }));
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith(preset);
});
