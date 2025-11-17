// Spotify API Response Types

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  country: string;
  product: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  popularity: number;
  followers: {
    total: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
}

export interface PreferenceShareResponse {
  shareId: string;
  userId: string;
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  createdAt: string;
  expiresAt: string;
}

export interface ComparisonResult {
  matchPercentage: number;
  commonArtists: SpotifyArtist[];
  commonGenres: string[];
  otherUser: {
    id: string;
    display_name: string;
    images: Array<{ url: string }>;
  };
}

export interface BlendPlaylistResponse {
  playlistId: string;
  playlistUrl: string;
  tracks: SpotifyTrack[];
}
