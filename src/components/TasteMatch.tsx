import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Heart, Music, PlayCircle, Shuffle } from 'lucide-react';
import { User } from '../App';
import { motion } from 'motion/react';

interface TasteMatchProps {
  matchData: { user: User; matchPercentage: number };
  onBack: () => void;
}

const mockPlaylist = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
  { id: '2', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', duration: '2:21' },
  { id: '3', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58' },
  { id: '4', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
  { id: '5', title: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar', duration: '3:18' },
  { id: '6', title: 'Montero', artist: 'Lil Nas X', duration: '2:17' },
  { id: '7', title: 'Kiss Me More', artist: 'Doja Cat ft. SZA', duration: '3:28' },
  { id: '8', title: 'Industry Baby', artist: 'Lil Nas X & Jack Harlow', duration: '3:32' }
];

export function TasteMatch({ matchData, onBack }: TasteMatchProps) {
  const { user, matchPercentage } = matchData;
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(matchPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [matchPercentage]);

  const getMatchMessage = (percentage: number) => {
    if (percentage >= 90) return "You two are musical soulmates! 🎵";
    if (percentage >= 80) return "You two are relationship goals! 💕";
    if (percentage >= 70) return "Great taste compatibility! ✨";
    if (percentage >= 60) return "You share some awesome vibes! 🎶";
    if (percentage >= 50) return "Interesting taste overlap! 🤔";
    return "Opposites attract in music! 🎭";
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  const handleCreatePlaylist = () => {
    setIsCreatingPlaylist(true);
    setTimeout(() => {
      setIsCreatingPlaylist(false);
      setShowPlaylist(true);
    }, 2000);
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
            <h1 className="text-3xl font-bold text-white">Taste Match Results</h1>
            <p className="text-gray-400 text-lg">Your musical compatibility revealed</p>
          </div>
        </div>

        {/* Match Result */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border-gray-800 p-10 mb-8 text-center rounded-lg">
            <div className="mb-8">
              <div className="flex justify-center items-center gap-6 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" 
                  alt="You"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <Heart className="w-10 h-10 text-green-500" />
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-7xl font-bold mb-4 text-green-500"
              >
                {animatedPercentage}%
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-3">
                Your taste match is {animatedPercentage}%
              </h2>
              
              <p className="text-xl text-gray-300">
                {getMatchMessage(matchPercentage)}
              </p>
            </div>

            <Progress 
              value={animatedPercentage} 
              className="w-full h-4 mb-8"
            />

            {!showPlaylist && (
              <Button 
                onClick={handleCreatePlaylist}
                disabled={isCreatingPlaylist}
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 text-lg rounded-full"
              >
                {isCreatingPlaylist ? (
                  <>
                    <Shuffle className="w-5 h-5 mr-3 animate-spin" />
                    Creating Blend Playlist...
                  </>
                ) : (
                  <>
                    <Music className="w-5 h-5 mr-3" />
                    Make Blend Playlist
                  </>
                )}
              </Button>
            )}
          </Card>
        </motion.div>

        {/* Shared Artists */}
        <Card className="bg-gray-900 border-gray-800 p-8 mb-8 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-green-500" />
            Artists You Both Love
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {user.topArtists.slice(0, 4).map((artist) => (
              <div key={artist.id} className="text-center">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <p className="text-white font-semibold truncate">{artist.name}</p>
                <p className="text-gray-400">{artist.genre}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Blend Playlist */}
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Music className="w-6 h-6 text-green-500" />
                    Your Blend Playlist
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {mockPlaylist.length} songs • Perfect mix of your tastes
                  </p>
                </div>
                
                <Button className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Play on Spotify
                </Button>
              </div>

              <div className="space-y-2">
                {mockPlaylist.map((song, index) => (
                  <div key={song.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{song.title}</p>
                      <p className="text-gray-400">{song.artist}</p>
                    </div>
                    <div className="text-gray-400">
                      {song.duration}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md">
                  Save to Library
                </Button>
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md">
                  Share Playlist
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Playlist updated based on both your recent listening habits
          </p>
        </div>
      </div>
    </div>
  );
}