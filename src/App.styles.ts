import styled from 'styled-components';
import { theme } from './styles/GlobalStyle';

// Overall page layout, using flexbox to create a columnar structure that fills the viewport height.
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Header section with centered text and padding for spacing.
const Header = styled.header`
  padding: 48px 24px 32px;
  text-align: center;
`;

// Title section with custom font and letter spacing for a distinctive look.
const Title = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

// Main content area, centered and with padding to separate it from the edges of the viewport.
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

// Main layout section
const Main = styled.main`
  flex: 1;
  padding: 0 16px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export { Page, Header, Title, TitleText, Tagline, Main };