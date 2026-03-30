import React, { useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { fetchResults, setQuery, resetSearch } from './store/slices/searchSlice';
import { ITEMS_PER_PAGE } from './types';
import { Page, Header, Title, TitleText, Tagline, Main } from './App.styles';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, status, error, hasMore, page, query, totalResults } =
    useAppSelector((state) => state.search);

  const isLoading = status === 'loading';

  // On mount, perform a default search to populate the UI
  useEffect(() => {
    dispatch(setQuery('music'));
    dispatch(
      fetchResults({
        term: 'music',
        offset: 0,
        append: false,
      })
    );
  }, [dispatch]);

  const handleSearch = useCallback(
    (term: string) => {
      dispatch(resetSearch());
      dispatch(setQuery(term));
      dispatch(fetchResults({ term, offset: 0, append: false }));
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(
        fetchResults({ term: query, offset: page * ITEMS_PER_PAGE, append: true })
      );
    }
  }, [dispatch, isLoading, hasMore, query, page]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Page>
        <Header>
          <Title>
            <TitleText>
              iTunes Search
            </TitleText>
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
          />
        </Main>
      </Page>
    </ThemeProvider>
  );
};

export default App;
