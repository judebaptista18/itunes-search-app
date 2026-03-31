import { ItunesResult } from '../../types';
import { theme } from '../../styles/GlobalStyle';

// Helper function to determine badge color based on item type.
export const typeColor = (wrapperType: string) => {
  if (wrapperType === 'artist') return theme.colors.artist;
  if (wrapperType === 'collection') return theme.colors.album;
  return theme.colors.track;
};

// Helper functions to derive display values from raw API data.
export const typeLabel = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return 'Artist';
  if (item.wrapperType === 'collection') return item.collectionType ?? 'Album';
  return item.kind ?? 'Track';
};

// Formats the title based on item type, with fallbacks for missing data.
export const formatTitle = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return item.artistName;
  if (item.wrapperType === 'collection') return item.collectionName ?? item.artistName;
  return item.trackName ?? item.artistName;
};

// Formats the subtitle based on item type, with fallbacks for missing data.
export const formatSub = (item: ItunesResult): string => {
  if (item.wrapperType === 'artist') return item.primaryGenreName ?? '';

  if (item.wrapperType === 'collection') {
    return `${item.artistName}${
      item.releaseDate ? ' · ' + new Date(item.releaseDate).getFullYear() : ''
    }`;
  }

  return `${item.artistName}${
    item.collectionName ? ' — ' + item.collectionName : ''
  }`;
};