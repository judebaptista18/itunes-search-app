import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import App from '../App';
import searchReducer from '../store/slices/searchSlice';
import { makeTrack, makeAlbum, makeArtist } from './testUtils';

// Mock axios for API 
vi.mock('axios');
const axiosGet = vi.mocked(axios.get);

// Test InfiniteScroll behaviour in ResultsList.test.tsx.
vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    children,
    loader,
    endMessage,
    hasMore,
  }: {
    children: React.ReactNode;
    loader: React.ReactNode;
    endMessage: React.ReactNode;
    hasMore: boolean;
    dataLength: number;
    next: () => void;
  }) => (
    <div data-testid="infinite-scroll">
      {children}
      {hasMore ? loader : endMessage}
    </div>
  ),
}));

const createTestStore = () =>
  configureStore({ reducer: { search: searchReducer } });

const renderApp = () => {
  const store = createTestStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
  };
};

// Tests
describe('App integration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the search input and button on load', () => {
    renderApp();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('shows results after a successful search', async () => {
    axiosGet.mockResolvedValueOnce({
      data: {
        resultCount: 3,
        results: [makeTrack(), makeAlbum(), makeArtist()],
        totalResults: 3,
      },
    });

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'coldplay');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(screen.getAllByTestId('result-card')).toHaveLength(3);
    });
  });

  it('shows no-results state when API returns empty array', async () => {
    axiosGet.mockResolvedValueOnce({
      data: { resultCount: 0, results: [], totalResults: 0 },
    });

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'xyzunknownband99');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });
  });

  it('shows an error message when the API call fails', async () => {
    axiosGet.mockRejectedValueOnce({
      response: { data: { error: 'Failed to reach iTunes API' } },
    });

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'beatles');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to reach iTunes API')).toBeInTheDocument();
    });
  });

  it('disables the search button while loading', async () => {
    axiosGet.mockReturnValueOnce(new Promise(() => {})); // never resolves

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'adele');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(screen.getByTestId('search-button')).toBeDisabled();
    });
  });

  it('displays correct badge types for track, album and artist', async () => {
    axiosGet.mockResolvedValueOnce({
      data: {
        resultCount: 3,
        results: [makeTrack({ kind: 'song' }), makeAlbum({ collectionType: 'Album' }), makeArtist()],
        totalResults: 3,
      },
    });

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'test');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      const badges = screen.getAllByTestId('type-badge');
      expect(badges.map((b) => b.textContent)).toEqual(
        expect.arrayContaining(['song', 'Album', 'Artist'])
      );
    });
  });

  it('replaces results (not appends) when a new search is performed', async () => {
    axiosGet
      .mockResolvedValueOnce({
        data: { resultCount: 1, results: [makeTrack({ trackName: 'Song A' })], totalResults: 1 },
      })
      .mockResolvedValueOnce({
        data: { resultCount: 1, results: [makeTrack({ trackName: 'Song B' })], totalResults: 1 },
      });

    renderApp();
    const input  = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    await userEvent.type(input, 'first');
    await userEvent.click(button);
    await waitFor(() => screen.getByText('Song A'));

    await userEvent.clear(input);
    await userEvent.type(input, 'second');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Song B')).toBeInTheDocument();
      expect(screen.queryByText('Song A')).not.toBeInTheDocument();
    });
  });

  it('renders InfiniteScroll container when results are present', async () => {
    axiosGet.mockResolvedValueOnce({
      data: {
        resultCount: 2,
        results: [makeTrack(), makeAlbum()],
        totalResults: 20,
      },
    });

    renderApp();
    await userEvent.type(screen.getByTestId('search-input'), 'radiohead');
    await userEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });
  });
});
