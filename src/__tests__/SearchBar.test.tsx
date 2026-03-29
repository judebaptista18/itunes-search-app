import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders the input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('updates input value as user types', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByTestId('search-input');
    await userEvent.type(input, 'coldplay');
    expect(input).toHaveValue('coldplay');
  });

  it('calls onSearch with trimmed value on form submit', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByTestId('search-input');
    await userEvent.type(input, '  coldplay  ');
    fireEvent.submit(input.closest('form')!);
    expect(mockOnSearch).toHaveBeenCalledWith('coldplay');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when search button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    await userEvent.type(screen.getByTestId('search-input'), 'adele');
    await userEvent.click(screen.getByTestId('search-button'));
    expect(mockOnSearch).toHaveBeenCalledWith('adele');
  });

  it('does NOT call onSearch when input is empty', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    await userEvent.click(screen.getByTestId('search-button'));
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('does NOT call onSearch when input is only whitespace', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByTestId('search-input');
    await userEvent.type(input, '   ');
    fireEvent.submit(input.closest('form')!);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('disables input and button while isLoading is true', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    expect(screen.getByTestId('search-input')).toBeDisabled();
    expect(screen.getByTestId('search-button')).toBeDisabled();
  });

  it('shows "Searching…" text on button while loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    expect(screen.getByTestId('search-button')).toHaveTextContent('Searching…');
  });

  it('shows "Search" text on button when not loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByTestId('search-button')).toHaveTextContent('Search');
  });

  it('has correct aria attributes for accessibility', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText('Search term')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
});
