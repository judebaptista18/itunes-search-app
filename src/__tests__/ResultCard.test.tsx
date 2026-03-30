import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultCard from '../components/ResultCard';
import { makeTrack, makeAlbum, makeArtist } from './testUtils';

describe('ResultCard', () => {
  describe('Track item', () => {
    it('renders track name as title', () => {
      render(<ResultCard item={makeTrack({ trackName: 'Yellow' })} />);
      expect(screen.getByText('Yellow')).toBeInTheDocument();
    });

    it('renders artist and album in subtitle', () => {
      render(<ResultCard item={makeTrack({ artistName: 'Coldplay', collectionName: 'Parachutes' })} />);
      expect(screen.getByText(/Coldplay/)).toBeInTheDocument();
      expect(screen.getByText(/Parachutes/)).toBeInTheDocument();
    });

    it('shows "song" badge for tracks', () => {
      render(<ResultCard item={makeTrack({ kind: 'song' })} />);
      expect(screen.getByTestId('type-badge')).toHaveTextContent('song');
    });

    it('renders artwork image when artworkUrl100 is provided', () => {
      render(<ResultCard item={makeTrack({ artworkUrl100: 'https://example.com/art.jpg' })} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/art.jpg');
    });

    it('renders emoji placeholder when no artwork', () => {
      render(<ResultCard item={makeTrack({ artworkUrl100: undefined })} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('track')).toBeInTheDocument();
    });

    it('has a descriptive aria-label', () => {
      render(<ResultCard item={makeTrack({ trackName: 'Yellow', kind: 'song' })} />);
      expect(screen.getByTestId('result-card')).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Yellow')
      );
    });
  });

  describe('Album (collection) item', () => {
    it('renders collection name as title', () => {
      render(<ResultCard item={makeAlbum({ collectionName: 'Parachutes' })} />);
      expect(screen.getByText('Parachutes')).toBeInTheDocument();
    });

    it('renders artist name in subtitle', () => {
      render(<ResultCard item={makeAlbum({ artistName: 'Coldplay' })} />);
      expect(screen.getByText(/Coldplay/)).toBeInTheDocument();
    });

    it('renders release year in subtitle', () => {
      render(<ResultCard item={makeAlbum({ releaseDate: '2000-11-13T00:00:00Z' })} />);
      expect(screen.getByText(/2000/)).toBeInTheDocument();
    });

    it('shows "Album" badge', () => {
      render(<ResultCard item={makeAlbum({ collectionType: 'Album' })} />);
      expect(screen.getByTestId('type-badge')).toHaveTextContent('Album');
    });

    it('renders album emoji placeholder when no artwork', () => {
      render(<ResultCard item={makeAlbum({ artworkUrl100: undefined })} />);
      expect(screen.getByText('collection')).toBeInTheDocument();
    });
  });

  describe('Artist item', () => {
    it('renders artist name as title', () => {
      render(<ResultCard item={makeArtist({ artistName: 'Radiohead' })} />);
      expect(screen.getByText('Radiohead')).toBeInTheDocument();
    });

    it('renders genre as subtitle', () => {
      render(<ResultCard item={makeArtist({ primaryGenreName: 'Alternative' })} />);
      expect(screen.getByText('Alternative')).toBeInTheDocument();
    });

    it('shows "Artist" badge', () => {
      render(<ResultCard item={makeArtist()} />);
      expect(screen.getByTestId('type-badge')).toHaveTextContent('Artist');
    });

    it('renders microphone emoji placeholder for artists', () => {
      render(<ResultCard item={makeArtist({ artworkUrl100: undefined })} />);
      expect(screen.getByText('artist')).toBeInTheDocument();
    });
  });
});
