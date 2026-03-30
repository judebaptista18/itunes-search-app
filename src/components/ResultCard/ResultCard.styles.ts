import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyle';
import { typeColor } from './ResultCard.utils';

export const Card = styled.article`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  transition: background 0.15s, border-color 0.15s, transform 0.15s;

  &:hover {
    background: ${theme.colors.surfaceHover};
    border-color: rgba(250, 35, 59, 0.3);
    transform: translateX(3px);
  }
`;

export const Artwork = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.sm};
  object-fit: cover;
  flex-shrink: 0;
  background: ${theme.colors.border};
`;

export const ArtworkPlaceholder = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

export const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Sub = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Badge = styled.span<{ $type: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $type }) => typeColor($type)};
  background: ${({ $type }) => `${typeColor($type)}18`};
  padding: 3px 9px;
  border-radius: ${theme.radii.pill};
  flex-shrink: 0;
`;