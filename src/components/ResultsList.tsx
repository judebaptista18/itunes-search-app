import React from 'react';
import styled, { keyframes } from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import ResultCard from './ResultCard';
import { ItunesResult } from '../types';
import { theme } from './GlobalStyle';


interface ResultsListProps {
  results: ItunesResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  query: string;
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
`;

const Wrapper = styled.section`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
`;

const MetaText = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  padding: 0 4px;
  margin-bottom: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  h3    { font-size: 1.1rem; color: ${theme.colors.text}; margin-bottom: 6px; }
  p     { font-size: 0.88rem; }
`;

const ErrorState = styled(EmptyState)`
  h3 { color: ${theme.colors.accent}; }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 24px auto;
`;

const LoadingMore = styled.div`
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  padding: 16px;
  animation: ${pulse} 1.2s ease infinite;
`;

const EndMessage = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: ${theme.colors.textDim};
  padding: 20px 0 4px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

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
        scrollThreshold={0.85}
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
