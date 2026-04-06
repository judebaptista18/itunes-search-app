import React, { useCallback, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles/GlobalStyle";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import {
  fetchResults,
  setQuery,
  resetSearch,
} from "./store/slices/searchSlice";
import { ITEMS_PER_PAGE } from "./types";
import { Page, Header, Title, TitleText, Tagline, Main } from "./App.styles";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, status, error, hasMore, page, query, totalResults } =
    useAppSelector((state) => state.search);

  /**
   * Derived loading state.
   * Avoids passing raw status checks throughout the component tree.
   */
  const isLoading = status === "loading";

 /**
   * Handles new search submissions.
   *
   * - Resets previous results
   * - Updates query in global state
   * - Fetches fresh results from API
   *
   * useCallback ensures stable reference,
   * preventing unnecessary re-renders of SearchBar.
   */
  const handleSearch = useCallback(
    (term: string) => {
      dispatch(resetSearch());
      dispatch(setQuery(term));
      dispatch(fetchResults({ term, offset: 0, append: false }));
    },
    [dispatch],
  );

  /**
   * Handles infinite scrolling / pagination.
   *
   * - Prevents duplicate calls while loading
   * - Uses current page + ITEMS_PER_PAGE for offset
   */
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(
        fetchResults({
          term: query,
          offset: page * ITEMS_PER_PAGE,
          append: true,
        }),
      );
    }
  }, [dispatch, isLoading, hasMore, query, page]);

  return (
    <ThemeProvider theme={theme}>
       {/* Global styles (reset + base styles) */}
      <GlobalStyle />
      <Page>
        <Header>
          <Title>
            <TitleText>iTunes Search</TitleText>
          </Title>
          <Tagline>Discover artists, albums and songs</Tagline>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </Header>

        <Main>
          <ResultsList
            results={results}
            status={status}
            error={error}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            totalResults={totalResults}
            query={query}
            onSelect={handleSearch} 
          />
        </Main>
      </Page>
    </ThemeProvider>
  );
};

export default App;
