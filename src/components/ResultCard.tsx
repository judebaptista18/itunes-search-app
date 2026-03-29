import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ItunesResult } from '../types';
import { theme } from './GlobalStyle';

interface ResultCardProps {
  item: ItunesResult;
}

const Card = styled.article`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
  cursor: default;

  &:hover {
    background: ${theme.colors.surfaceHover};
    border-color: rgba(250, 35, 59, 0.3);
    transform: translateX(3px);
  }
`;

const Artwork = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.sm};
  object-fit: cover;
  flex-shrink: 0;
  background: ${theme.colors.border};
`;

const ArtworkPlaceholder = styled.div`
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

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span<{ $type: string }>`
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

const typeColor = (wrapperType: string) => {
  if (wrapperType === 'artist') return theme.colors.artist;
  if (wrapperType === 'collection') return theme.colors.album;
  return theme.colors.track;
};

const typeLabel = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return 'Artist';
  if (item.wrapperType === 'collection') return item.collectionType ?? 'Album';
  return item.kind ?? 'Track';
};

const formatTitle = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return item.artistName;
  if (item.wrapperType === 'collection') return item.collectionName ?? item.artistName;
  return item.trackName ?? item.artistName;
};

const formatSub = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return item.primaryGenreName ?? '';
  if (item.wrapperType === 'collection')
    return `${item.artistName}${item.releaseDate ? ' · ' + new Date(item.releaseDate).getFullYear() : ''}`;
  return `${item.artistName}${item.collectionName ? ' — ' + item.collectionName : ''}`;
};

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const title = formatTitle(item);
  const sub = formatSub(item);

  return (
    <Card data-testid="result-card" aria-label={`${typeLabel(item)}: ${title}`}>
      {item.artworkUrl100 ? (
        <Artwork src={item.artworkUrl100} alt={title} loading="lazy" />
      ) : (
        <ArtworkPlaceholder aria-hidden="true">
          {item.wrapperType ? item.wrapperType : "Music"}
        </ArtworkPlaceholder>
      )}
      <Info>
        <Title>{title}</Title>
        {sub && <Sub>{sub}</Sub>}
      </Info>
      <Badge $type={item.wrapperType} data-testid="type-badge">
        {typeLabel(item)}
      </Badge>
    </Card>
  );
};

export default ResultCard;
