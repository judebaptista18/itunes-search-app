import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/GlobalStyle';

// Spinner animation for loading state.
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Pulsing animation for "Loading more..." indicator.
const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
`;

// wrapper the ResultsList content.
const Wrapper = styled.section`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
`;

// Meta information text above results, showing total count and query.
const MetaText = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  padding: 0 4px;
  margin-bottom: 12px;
`;

// Empty state when no results are found, or before search is made. Centered text with muted color.
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textMuted};
  h3    { font-size: 1.1rem; color: ${theme.colors.text}; margin-bottom: 6px; }
  p     { font-size: 0.88rem; }
`;

// Error state when API call fails, showing error message in accent color.
const ErrorState = styled(EmptyState)`
  h3 { color: ${theme.colors.accent}; }
`;

// To show loading state with a spinner animation.
const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 24px auto;
`;

// "Loading more..." indicator during pagination, with pulsing animation to indicate activity.
const LoadingMore = styled.div`
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  padding: 16px;
  animation: ${pulse} 1.2s ease infinite;
`;

// Message shown at the end of results when no more pages are available.
const EndMessage = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: ${theme.colors.textDim};
  padding: 20px 0 4px;
`;

// Container for the list of result cards, with vertical spacing between them.
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export { Wrapper, MetaText, EmptyState, ErrorState, Spinner, LoadingMore, EndMessage, CardList };