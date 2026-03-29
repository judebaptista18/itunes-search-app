import { ItunesResult } from '../types';

export const makeTrack = (overrides: Partial<ItunesResult> = {}): ItunesResult => ({
  wrapperType: 'track',
  kind: 'song',
  artistId: 100,
  collectionId: 200,
  trackId: 300,
  artistName: 'Test Artist',
  collectionName: 'Test Album',
  trackName: 'Test Song',
  artworkUrl100: 'https://example.com/art.jpg',
  primaryGenreName: 'Pop',
  releaseDate: '2023-01-01T00:00:00Z',
  ...overrides,
});

export const makeAlbum = (overrides: Partial<ItunesResult> = {}): ItunesResult => ({
  wrapperType: 'collection',
  collectionType: 'Album',
  artistId: 100,
  collectionId: 201,
  artistName: 'Test Artist',
  collectionName: 'Test Album',
  artworkUrl100: 'https://example.com/album.jpg',
  primaryGenreName: 'Rock',
  releaseDate: '2022-06-15T00:00:00Z',
  ...overrides,
});

export const makeArtist = (overrides: Partial<ItunesResult> = {}): ItunesResult => ({
  wrapperType: 'artist',
  artistId: 101,
  artistName: 'Test Artist',
  primaryGenreName: 'Indie',
  ...overrides,
});
