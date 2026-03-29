import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './components/GlobalStyle';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { fetchResults, setQuery, resetSearch } from './store/slices/searchSlice';
import { ITEMS_PER_PAGE } from './types';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 48px 24px 32px;
  text-align: center;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const TitleText = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: ${theme.fonts};
  letter-spacing: -0.02em;
`;

const Tagline = styled.p`
  font-size: 0.88rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 32px;
`;

const Main = styled.main`
  flex: 1;
  padding: 0 16px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { results, status, error, hasMore, page, query, totalResults } =
    useAppSelector((state) => state.search);

  const isLoading = status === 'loading';

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
