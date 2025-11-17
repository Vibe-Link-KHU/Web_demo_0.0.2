import { useState, useEffect } from 'react';
import { Music, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '../services/api';
import type { User } from '../App';

// Platform icons as SVG components
const SpotifyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface LoginPageProps {
  onLogin: (user: User) => void;
  onJoinShare: (user: User, matchPercentage: number) => void;
}

export function LoginPage({ onLogin, onJoinShare }: LoginPageProps) {
  const [shareLink, setShareLink] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is coming back from OAuth callback
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a session
        const response = await api.user.getProfile();
        if (response.data) {
          // User is authenticated, fetch their data
          const [profileRes, artistsRes] = await Promise.all([
            api.user.getProfile(),
            api.user.getTopArtists('medium_term'),
          ]);

          const profile = profileRes.data;
          const artists = artistsRes.data.items;

          // Convert Spotify data to our User format
          const user: User = {
            id: profile.id,
            name: profile.display_name || 'Music Lover',
            platform: 'spotify',
            profileImage: profile.images?.[0]?.url || '',
            topArtists: artists.slice(0, 10).map((artist: any, index: number) => ({
              id: artist.id,
              name: artist.name,
              genre: artist.genres[0] || 'Unknown',
              playCount: artist.popularity * 10, // Mock play count from popularity
              imageUrl: artist.images[0]?.url || '',
              connections: index < artists.length - 1 ? [artists[index + 1].id] : [],
            })),
          };

          onLogin(user);
        }
      } catch (err) {
        // Not authenticated yet, that's fine
        console.log('Not authenticated');
      }
    };

    checkAuthStatus();
  }, [onLogin]);

  const handleSpotifyLogin = () => {
    setError(null);
    // Redirect to Spotify OAuth
    api.auth.login();
  };

  const handleJoinShareLink = async () => {
    if (!shareLink.trim()) {
      setError('Please enter a share link');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Extract link ID from URL or use as-is
      const linkId = shareLink.includes('/')
        ? shareLink.split('/').pop() || shareLink
        : shareLink;

      // Get the shared preference data
      const preferenceRes = await api.preference.getLink(linkId);

      // Accept and compare with our data (requires authentication)
      const comparisonRes = await api.preference.acceptLink(linkId);

      const comparison = comparisonRes.data;
      const otherUserData = preferenceRes.data;

      // Convert to our User format
      const otherUser: User = {
        id: comparison.otherUser.id,
        name: comparison.otherUser.display_name,
        platform: 'spotify',
        profileImage: comparison.otherUser.images?.[0]?.url || '',
        topArtists: otherUserData.topArtists.slice(0, 10).map((artist: any, index: number) => ({
          id: artist.id,
          name: artist.name,
          genre: artist.genres[0] || 'Unknown',
          playCount: artist.popularity * 10,
          imageUrl: artist.images[0]?.url || '',
          connections: index < otherUserData.topArtists.length - 1
            ? [otherUserData.topArtists[index + 1].id]
            : [],
        })),
      };

      onJoinShare(otherUser, comparison.matchPercentage);
    } catch (err: any) {
      console.error('Error joining share link:', err);
      setError(
        err.response?.data?.message ||
        'Failed to join share link. Please check the link and try again.'
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6">
      {/* Title and Description */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Music className="w-10 h-10 text-green-500" />
          <h1 className="text-4xl font-bold text-white">
            Music Taste Visualizer
          </h1>
        </div>
        <p className="text-gray-400">
          Discover your music taste graph and blend playlists with friends
        </p>
      </div>

      {/* Connect Section */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-8">
          Connect your music platform
        </h2>

        {/* Spotify Login Button */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            onClick={handleSpotifyLogin}
            className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold rounded-full transition-all"
          >
            <SpotifyIcon />
            <span className="ml-3">Connect with Spotify</span>
          </Button>

          {/* Coming Soon Buttons */}
          <Button
            disabled
            className="bg-gray-700 text-gray-400 py-6 text-lg font-semibold rounded-full opacity-50 cursor-not-allowed"
          >
            <AppleIcon />
            <span className="ml-3">Apple Music (Coming Soon)</span>
          </Button>

          <Button
            disabled
            className="bg-gray-700 text-gray-400 py-6 text-lg font-semibold rounded-full opacity-50 cursor-not-allowed"
          >
            <YouTubeIcon />
            <span className="ml-3">YouTube Music (Coming Soon)</span>
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 w-full max-w-md my-8">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      {/* Join Share Link Section */}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Join a friend's share link
        </h2>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Paste share link or code here"
            value={shareLink}
            onChange={(e) => setShareLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinShareLink()}
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 flex-1"
          />
          <Button
            onClick={handleJoinShareLink}
            disabled={isJoining || !shareLink.trim()}
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            {isJoining ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Joining...
              </span>
            ) : (
              <ExternalLink className="w-5 h-5" />
            )}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <p className="text-gray-500 text-xs mt-3 text-center">
          Need to connect with Spotify first to join a friend's link
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-600 text-sm">
        <p>By connecting, you agree to share your music preferences</p>
      </div>
    </div>
  );
}
