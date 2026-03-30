import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/GlobalStyle';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  animation: ${fadeIn} 0.5s ease both;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  align-items: stretch;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 20px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  color: ${theme.colors.text};
  font-size: 1rem;
  font-family: ${theme.fonts};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: ${theme.colors.textDim}; }

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(250, 35, 59, 0.15);
  }
`;

const Button = styled.button<{ $loading?: boolean }>`
  padding: 14px 28px;
  background: ${({ $loading }) => ($loading ? theme.colors.border : theme.colors.accent)};
  color: #fff;
  border: none;
  border-radius: ${theme.radii.pill};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${theme.colors.accentHover};
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;

export { Wrapper, Form, Input, Button };