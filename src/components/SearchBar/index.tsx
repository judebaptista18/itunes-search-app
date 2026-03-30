import React, { useState, useCallback } from 'react';
import { Wrapper , Form , Input, Button} from './SearchBar.styles';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSearch(trimmed);
    },
    [value, onSearch]
  );

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit} role="search" aria-label="Search iTunes">
        <Input
          type="search"
          placeholder="Search artists, albums, songs…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search term"
          data-testid="search-input"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !value.trim()}
          $loading={isLoading}
          data-testid="search-button"
          aria-label="Search"
        >
          {isLoading ? 'Searching…' : 'Search'}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default SearchBar;
