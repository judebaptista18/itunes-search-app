import React from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import ResultCard from '../ResultCard';
import { ItunesResult } from '../../types';
import { CardList, Wrapper, Spinner, ErrorState, EmptyState, MetaText, LoadingMore, EndMessage } from './ResultsList.styles';


interface ResultsListProps {
  results: ItunesResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  query: string;
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  status,
  error,
  hasMore,
  onLoadMore,
  totalResults,
  query,
}) => {

  if (status === 'loading' && results.length === 0) {
    return (
      <Wrapper aria-live="polite" aria-busy="true">
        <Spinner aria-label="Loading results" />
      </Wrapper>
    );
  }

  if (status === 'failed') {
    return (
      <Wrapper>
        <ErrorState role="alert">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </ErrorState>
      </Wrapper>
    );
  }

  if (status === 'succeeded' && results.length === 0) {
    return (
      <Wrapper>
        <EmptyState role="status" data-testid="no-results">
          <h3>No results found</h3>
          <p>Try a different artist, album, or song name.</p>
        </EmptyState>
      </Wrapper>
    );
  }

  if (results.length === 0) return null;

  return (
    <Wrapper aria-live="polite">
      <MetaText>
        Showing <strong>{results.length}</strong> of <strong>{totalResults}</strong>{' '}
        results for "<em>{query}</em>"
      </MetaText>
      <InfiniteScroll
        dataLength={results.length} 
        next={onLoadMore}
        hasMore={hasMore}
        scrollThreshold={1}
        loader={
          <LoadingMore aria-live="polite" data-testid="loading-more">
            Loading more…
          </LoadingMore>
        }
        endMessage={
          <EndMessage data-testid="end-message">— End of results —</EndMessage>
        }
        style={{ overflow: 'visible' }}
      >
        <CardList>
          {results.map((item, idx) => (
            <ResultCard
              key={`${item.wrapperType}-${
                item.trackId ?? item.collectionId ?? item.artistId
              }-${idx}`}
              item={item}
            />
          ))}
        </CardList>
      </InfiniteScroll>
    </Wrapper>
  );
};

export default ResultsList;
