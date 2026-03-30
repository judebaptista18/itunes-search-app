import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bg: '#0a0a0f',
    surface: '#13131a',
    surfaceHover: '#1c1c28',
    border: '#2a2a3d',
    accent: '#fa233b',
    accentHover: '#ff4757',
    text: '#f0f0f5',
    textMuted: '#8888aa',
    textDim: '#555570',
    artist: '#4fc3f7',
    album: '#81c784',
    track: '#ffb74d',
  },
  fonts: "'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  radii: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  shadows: {
    card: '0 4px 24px rgba(0,0,0,0.4)',
    glow: '0 0 20px rgba(250, 35, 59, 0.25)',
  },
};

export type Theme = typeof theme;

export const GlobalStyle = createGlobalStyle`
  html { scroll-behavior: smooth; }

  body {
    font-family: ${theme.fonts};
    background: ${theme.colors.bg};
    color: ${theme.colors.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  img { display: block; }
  a { color: inherit; text-decoration: none; }
`;
