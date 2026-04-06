import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsList from '../components/ResultsList';
import { makeTrack, makeAlbum, makeArtist } from './testUtils';
import { on } from 'events';

// react-infinite-scroll-component uses window.scroll events.
// in jsdom we just need the component to mount — mock the package
// so we can test our own logic without the scroll internals
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

const defaultProps = {
  results: [],
  status: 'idle' as const,
  error: null,
  hasMore: false,
  onLoadMore: vi.fn(),
  totalResults: 0,
  query: '',
  onSelect: vi.fn(),
};

describe('ResultsList', () => {
  describe('loading state', () => {
    it('shows spinner on initial load (no results yet)', () => {
      render(<ResultsList {...defaultProps} status="loading" />);
      expect(screen.getByLabelText('Loading results')).toBeInTheDocument();
    });

    it('shows "Loading more…" inside InfiniteScroll while paginating', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="loading"
          results={[makeTrack()]}
          totalResults={20}
          hasMore={true}
          query="test"
        />
      );
      // spinner is gone when results already exist
      expect(screen.queryByLabelText('Loading results')).not.toBeInTheDocument();
      // InfiniteScroll renders the loader when hasMore=true
      expect(screen.getByTestId('loading-more')).toBeInTheDocument();
    });
  });

  describe('empty / no results state', () => {
    it('shows no-results message when search succeeded with 0 results', () => {
      render(<ResultsList {...defaultProps} status="succeeded" />);
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it('suggests trying a different query', () => {
      render(<ResultsList {...defaultProps} status="succeeded" />);
      expect(screen.getByText(/try a different/i)).toBeInTheDocument();
    });

    // it('renders nothing in idle state with no results', () => {
    //   const { container } = render(<ResultsList {...defaultProps} status="idle" />);
    //   expect(container.firstChild).toBeNull();
    // });
  });

  describe('error state', () => {
    it('shows error message on failure', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="failed"
          error="Failed to reach iTunes API"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to reach iTunes API')).toBeInTheDocument();
    });

    it('shows generic heading on error', () => {
      render(<ResultsList {...defaultProps} status="failed" error="Network error" />);
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('results list', () => {
    const results = [makeTrack(), makeAlbum(), makeArtist()];

    it('renders one ResultCard per result item', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="succeeded"
          results={results}
          totalResults={3}
          query="test"
        />
      );
      expect(screen.getAllByTestId('result-card')).toHaveLength(3);
    });

    it('displays result count and query in meta text', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="succeeded"
          results={results}
          totalResults={30}
          query="coldplay"
        />
      );
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
      expect(screen.getByText(/coldplay/)).toBeInTheDocument();
    });

    it('renders the InfiniteScroll container', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="succeeded"
          results={results}
          totalResults={3}
          query="test"
        />
      );
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });

    it('shows end message when hasMore is false', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="succeeded"
          results={results}
          totalResults={3}
          query="test"
          hasMore={false}
        />
      );
      expect(screen.getByTestId('end-message')).toBeInTheDocument();
      expect(screen.getByText(/end of results/i)).toBeInTheDocument();
    });

    it('does NOT show end message when hasMore is true', () => {
      render(
        <ResultsList
          {...defaultProps}
          status="succeeded"
          results={results}
          totalResults={30}
          query="test"
          hasMore={true}
        />
      );
      expect(screen.queryByTestId('end-message')).not.toBeInTheDocument();
    });
  });
});