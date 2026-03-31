import React, { useState, useCallback } from "react";
import { Wrapper, Form, Input, Button } from "./SearchBar.styles";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
   /**
   * Local state for input value.
   * Keeps input responsive and prevents unnecessary global state updates.
   */
  const [value, setValue] = useState("");

  /**
   * Handles form submission.
   *
   * - Prevents default browser form reload
   * - Trims input to avoid empty/whitespace searches
   * - Triggers parent search handler
   *
   * useCallback ensures stable reference,
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSearch(trimmed);
    },
    [value, onSearch],
  );

  return (
    /**
     * Wrapper for layout purposes
     */
    <Wrapper>
      {/**
       * Form element provides semantic meaning for search
       * role="search" improves accessibility
       */}
      <Form onSubmit={handleSubmit} role="search" aria-label="Search iTunes">
        <Input
          type="search"
          placeholder="Search artists, albums, songs…"
          value={value}
          onChange={(e) => setValue(e.target.value)} // Contolled input, updates local state on each keystroke.
          aria-label="Search term"
          data-testid="search-input"
          disabled={isLoading} //Disable input during loading to prevent duplicate requests
        />
        <Button
          type="submit"
          disabled={isLoading || !value.trim()} // Disable button during loading (avoid duplicate API calls) or when input is empty/whitespace
          $loading={isLoading}
          data-testid="search-button"
          aria-label="Search"
        >
          {isLoading ? "Searching…" : "Search"}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default SearchBar;
