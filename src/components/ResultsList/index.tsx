import React from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import ResultCard from "../ResultCard";
import { searchSuggestions } from "./ResultsList.utils";
import { ItunesResult } from "../../types";
import {
  CardList,
  Wrapper,
  Spinner,
  ErrorState,
  EmptyState,
  MetaText,
  LoadingMore,
  EndMessage,
  Suggestions,
} from "./ResultsList.styles";

interface ResultsListProps {
  results: ItunesResult[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  query: string;
  onSelect: (query: string) => void; // handling suggestion clicks
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  status,
  error,
  hasMore,
  onLoadMore,
  totalResults,
  query,
  onSelect,
}) => {
  /**
   * Idle state (before first search).
   * Display suggestions or instructions before the first search is made.
   */
  if (status === "idle") {
    return (
      <Wrapper>
        <Suggestions role="status" data-testid="initial-suggestions">
          <h2>Start exploring music</h2>
          <p>Search for songs, albums, or artists</p>

          <div className="chips">
            {searchSuggestions && searchSuggestions.map((item) => (
              <a
                href="#"
                key={item}
                onClick={() => onSelect(item)}
                data-testid="suggestion-chip"
                className="chip"
              >
                {item}
              </a>
            ))}
          </div>
        </Suggestions>
      </Wrapper>
    );
  }

  /**
   * Initial loading state (first API call).
   * Only show full-page spinner when no data is available yet.
   */
  if (status === "loading" && results.length === 0) {
    return (
      <Wrapper aria-live="polite" aria-busy="true">
        <Spinner aria-label="Loading results" />
      </Wrapper>
    );
  }

  /**
   * Error state handling.
   * Displays API or network errors in a user friendly way.
   */
  if (status === "failed") {
    return (
      <Wrapper>
        <ErrorState role="alert">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </ErrorState>
      </Wrapper>
    );
  }

  /**
   * Empty state when search succeeds but returns no results.
   * Lets user know they can try a different query.
   */
  if (status === "succeeded" && results.length === 0) {
    return (
      <Wrapper>
        <EmptyState role="status" data-testid="no-results">
          <h3>No results found</h3>
          <p>Try a different artist, album, or song name.</p>
        </EmptyState>
      </Wrapper>
    );
  }

  /**
   * Prevent rendering anything if no results.
   * Acts as a safety fallback.
   */
  if (results.length === 0) return null;

  return (
    <Wrapper aria-live="polite">
      <MetaText>
        Showing <strong>{results.length}</strong> of{" "}
        <strong>{totalResults}</strong> results for "<em>{query}</em>"
      </MetaText>
      <InfiniteScroll
        dataLength={results.length} // current item count — triggers re-check
        next={onLoadMore} // called when user scrolls to threshold
        hasMore={hasMore} // whether more items are available
        scrollThreshold={1} // trigger at 100% scroll depth
        /**
         * Loader displayed while fetching additional pages.
         */
        loader={
          <LoadingMore aria-live="polite" data-testid="loading-more">
            Loading more…
          </LoadingMore>
        }
        /**
         * Message displayed when no more results are available.
         */
        endMessage={
          <EndMessage data-testid="end-message">— End of results —</EndMessage>
        }
        style={{ overflow: "visible" }} // prevent InfiniteScroll from adding its own scroll container
      >
        <CardList>
          {results.map((item, idx) => (
            <ResultCard
              /**
               * Composite key ensures uniqueness across different item types.
               * Fallback to index as last resort (API inconsistency handling).
               */
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
