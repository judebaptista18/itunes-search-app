import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/GlobalStyle';

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

export { Wrapper, MetaText, EmptyState, ErrorState, Spinner, LoadingMore, EndMessage, CardList };