import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Copy, Share2, ExternalLink, QrCode } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';

interface ShareLinkProps {
  user: User;
  shareId: string;
  onBack: () => void;
}

export function ShareLink({ user, shareId, onBack }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://music-taste-viz.app/share/${shareId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my music taste!',
          text: `See how our music tastes match and create a blend playlist together!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-white bg-gray-900 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Share Your Music Taste</h1>
            <p className="text-gray-400 text-lg">Send this link to friends to compare tastes</p>
          </div>
        </div>

        {/* User Preview */}
        <Card className="bg-gray-900 border-gray-800 p-8 mb-8 rounded-lg">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={user.profileImage} 
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-lg">wants to share their music taste</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {user.topArtists.slice(0, 4).map((artist, index) => (
              <div key={artist.id} className="text-center">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                />
                <p className="text-white font-medium truncate">{artist.name}</p>
                <p className="text-gray-400 text-sm">{artist.genre}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Share Link */}
        <Card className="bg-gray-900 border-gray-800 p-8 mb-8 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Share2 className="w-6 h-6 text-green-500" />
            Share Link
          </h3>
          
          <div className="flex gap-3 mb-6">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 bg-gray-800 border-gray-700 text-gray-300 rounded-md px-4 py-3"
            />
            <Button 
              onClick={handleCopy}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 rounded-md"
            >
              {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleShare}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Share via System
            </Button>
            
            <Button 
              onClick={() => toast('QR code feature coming soon!')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Generate QR Code
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="bg-gray-900 border-gray-800 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-6">How it works</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold mt-1">
                1
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Send the link to your friend</p>
                <p className="text-gray-400">They can copy and paste it or click if you're sharing digitally</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold mt-1">
                2
              </div>
              <div>
                <p className="text-white font-semibold mb-1">They connect their music platform</p>
                <p className="text-gray-400">Spotify, Apple Music, or YouTube Music</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold mt-1">
                3
              </div>
              <div>
                <p className="text-white font-semibold mb-1">See your taste match percentage</p>
                <p className="text-gray-400">Discover how similar your music preferences are</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold mt-1">
                4
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Create a blend playlist</p>
                <p className="text-gray-400">Get a curated playlist based on both your tastes</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Link expires in 24 hours • Share with up to 10 friends
          </p>
        </div>
      </div>
    </div>
  );
}