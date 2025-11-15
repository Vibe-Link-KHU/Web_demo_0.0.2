import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Music, Headphones, PlayCircle } from 'lucide-react';
import { User, Artist } from '../App';
import svgPaths from '../imports/svg-ir3vwxpl10';

// Mock data for demonstration
const mockArtists: Artist[] = [
  { id: '1', name: 'KENSHI YONEZU', genre: 'J-Pop', playCount: 1500, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', connections: ['2', '3'] },
  { id: '2', name: 'CHANGMO', genre: 'K-Hip Hop', playCount: 1200, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', connections: ['1', '4'] },
  { id: '3', name: 'IU', genre: 'K-Pop', playCount: 1800, imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400', connections: ['1', '5'] },
  { id: '4', name: 'Zico', genre: 'K-Hip Hop', playCount: 900, imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', connections: ['2', '6'] },
  { id: '5', name: 'TWICE', genre: 'K-Pop', playCount: 1100, imageUrl: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=400', connections: ['3', '7'] },
  { id: '6', name: 'Dean', genre: 'K-R&B', playCount: 800, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', connections: ['4', '8'] },
  { id: '7', name: 'BLACKPINK', genre: 'K-Pop', playCount: 1300, imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', connections: ['5', '9'] },
  { id: '8', name: 'Crush', genre: 'K-R&B', playCount: 700, imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', connections: ['6'] },
  { id: '9', name: 'BTS', genre: 'K-Pop', playCount: 2100, imageUrl: 'https://images.unsplash.com/photo-1665615839740-f9cfcc9568f9?w=400', connections: ['7', '3'] },
  { id: '10', name: 'NewJeans', genre: 'K-Pop', playCount: 950, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', connections: ['3', '5'] }
];

interface LoginPageProps {
  onLogin: (user: User) => void;
  onJoinShare: (user: User, matchPercentage: number) => void;
}

export function LoginPage({ onLogin, onJoinShare }: LoginPageProps) {
  const [shareLink, setShareLink] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handlePlatformLogin = (platform: 'spotify' | 'apple' | 'youtube') => {
    // Mock login - in real app this would use OAuth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Music Lover',
      platform,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      topArtists: mockArtists
    };
    
    onLogin(mockUser);
  };

  const handleJoinShareLink = () => {
    if (!shareLink.trim()) return;
    
    setIsJoining(true);
    
    // Mock share link joining
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Friend',
        platform: 'spotify',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        topArtists: mockArtists.slice(0, 5) // Different subset for variety
      };
      
      const matchPercentage = 86; // Mock match percentage
      onJoinShare(mockUser, matchPercentage);
      setIsJoining(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6">
      {/* Title and Description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Music Taste Visualizer
        </h1>
        <p className="text-gray-400">
          Discover your music taste graph and blend playlists with friends
        </p>
      </div>

      {/* Connect Section */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-8">
          Connect your music platform
        </h2>
        
        {/* Platform Buttons */}
        <div className="flex items-center justify-center gap-8 group/buttons">
          {/* Apple Music Button */}
          <button 
            onClick={() => handlePlatformLogin('apple')}
            className="flex flex-col items-center gap-3 transition-all duration-300 group/apple hover:scale-110 group-hover/buttons:opacity-40 hover:!opacity-100"
          >
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-[#FA233B] transition-all duration-300 shadow-lg">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 45 55">
                <g className="transition-all duration-300">
                  <path d={svgPaths.p2a15fe00} fill="white" className="group-hover/apple:fill-white" />
                  <path d={svgPaths.p3a1d0700} fill="white" className="group-hover/apple:fill-white" />
                </g>
              </svg>
            </div>
            <span className="text-white text-sm opacity-60 group-hover/apple:opacity-100 transition-opacity">
              Apple Music
            </span>
          </button>

          {/* Spotify Button */}
          <button 
            onClick={() => handlePlatformLogin('spotify')}
            className="flex flex-col items-center gap-3 transition-all duration-300 group/spotify hover:scale-110 group-hover/buttons:opacity-40 hover:!opacity-100"
          >
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 55 55">
                <circle cx="27.5" cy="27.5" r="27.5" fill="black" className="transition-all duration-300" />
                <path d={svgPaths.p2b0efc40} fill="#1DB954" className="transition-all duration-300" />
              </svg>
            </div>
            <span className="text-white text-sm opacity-60 group-hover/spotify:opacity-100 transition-opacity">
              Spotify
            </span>
          </button>

          {/* YouTube Music Button */}
          <button 
            onClick={() => handlePlatformLogin('youtube')}
            className="flex flex-col items-center gap-3 transition-all duration-300 group/youtube hover:scale-110 group-hover/buttons:opacity-40 hover:!opacity-100"
          >
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-[#FF0033] transition-all duration-300 shadow-lg">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 55 55">
                <g className="transition-all duration-300">
                  <path d={svgPaths.p302a9100} fill="white" className="group-hover/youtube:fill-white" />
                  <path d={svgPaths.p379ae810} fill="#FF0033" className="group-hover/youtube:fill-[#CC0028]" />
                  <path d={svgPaths.p1b148900} fill="white" className="group-hover/youtube:fill-white" />
                  <path d={svgPaths.p29e57a00} fill="#FF0033" className="group-hover/youtube:fill-[#CC0028]" />
                </g>
              </svg>
            </div>
            <span className="text-white text-sm opacity-60 group-hover/youtube:opacity-100 transition-opacity">
              YouTube Music
            </span>
          </button>
        </div>
      </div>

      {/* Join Friend Link */}
      <div className="mt-12">
        <button
          onClick={() => {
            const link = prompt("Enter your friend's share link:");
            if (link) {
              setShareLink(link);
              handleJoinShareLink();
            }
          }}
          className="text-white text-sm underline hover:text-gray-300 transition-colors"
        >
          Join a friend's taste sharing
        </button>
      </div>
    </div>
  );
}