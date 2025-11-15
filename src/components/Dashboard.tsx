import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Share2, Music, Users, ChevronLeft, Copy, Check } from 'lucide-react';
import { User } from '../App';
import { MusicGraph } from './MusicGraph';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  user: User;
  onCreateShare: (shareId: string) => void;
  onBack?: () => void;
}

export function Dashboard({ user, onCreateShare, onBack }: DashboardProps) {
  const [shareLink, setShareLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    const shareId = Math.random().toString(36).substr(2, 9);
    const link = `${window.location.origin}?share=${shareId}`;
    setShareLink(link);
    toast.success('Share link generated!');
  };

  const handleCopyLink = async () => {
    if (!shareLink) {
      handleGenerateLink();
      return;
    }
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'spotify': return 'text-green-400';
      case 'apple': return 'text-gray-300';
      case 'youtube': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'spotify': return 'Spotify';
      case 'apple': return 'Apple Music';
      case 'youtube': return 'YouTube Music';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        {onBack && (
          <Button 
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        
        {/* Header */}
        <div className="flex items-center mb-10">
          <div className="flex items-center gap-4">
            <img 
              src={user.profileImage} 
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className={`text-sm ${getPlatformColor(user.platform)}`}>
                Connected to {getPlatformName(user.platform)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Music className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-3xl font-bold text-white">{user.topArtists.length}</p>
                <p className="text-gray-400">Top Artists</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-3xl font-bold text-white">
                  {user.topArtists.reduce((acc, artist) => acc + artist.connections.length, 0)}
                </p>
                <p className="text-gray-400">Connections</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">♪</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {Math.round(user.topArtists.reduce((acc, artist) => acc + artist.playCount, 0) / user.topArtists.length)}
                </p>
                <p className="text-gray-400">Avg. Plays</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Music Taste Graph */}
        <Card className="bg-gray-900 border-gray-800 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Music className="w-6 h-6 text-green-500" />
            나의 취향 Graph
          </h2>
          <MusicGraph artists={user.topArtists} />
          
          {/* Share Section */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Share my taste and invite friends</h3>
                  <p className="text-gray-400 text-sm">Let your friends discover your music preferences</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                {shareLink && (
                  <div className="flex-1 md:flex-initial bg-gray-800 px-4 py-2 rounded-lg">
                    <p className="text-gray-300 text-sm truncate max-w-[200px]">{shareLink}</p>
                  </div>
                )}
                <Button 
                  onClick={handleCopyLink}
                  className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full flex items-center gap-2 whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Artists List */}
        <Card className="bg-gray-900 border-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-8">Your Top Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {user.topArtists.map((artist, index) => (
              <div key={artist.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="relative">
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="absolute -top-1 -right-1 bg-green-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{artist.name}</p>
                  <p className="text-gray-400 text-sm">{artist.genre}</p>
                  <p className="text-gray-500 text-xs">{artist.playCount.toLocaleString()} plays</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}