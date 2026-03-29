//iTunes API result item
export interface ItunesResult {
  wrapperType: 'track' | 'collection' | 'artist';
  kind?: string;
  artistId?: number;
  collectionId?: number;
  trackId?: number;
  artistName: string;
  collectionName?: string;
  trackName?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  trackPrice?: number;
  currency?: string;
  previewUrl?: string;
  collectionType?: string;
}

//API response shape from express
export interface SearchApiResponse {
  resultCount: number;
  results: ItunesResult[];
  totalResults: number;
  fromCache?: boolean;
}

//Redux state 
export interface SearchState {
  query: string;
  results: ItunesResult[];
  totalResults: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;           // current page (0 based)
  hasMore: boolean;
}

export const ITEMS_PER_PAGE = 10;
