import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { TasteMatch } from './components/TasteMatch';
import { ShareLink } from './components/ShareLink';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  name: string;
  platform: 'spotify' | 'apple' | 'youtube';
  profileImage: string;
  topArtists: Artist[];
};

export type Artist = {
  id: string;
  name: string;
  genre: string;
  playCount: number;
  imageUrl: string;
  connections: string[];
};

export type AppState = 'login' | 'dashboard' | 'sharing' | 'matching';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{ user: User; matchPercentage: number } | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState('dashboard');
  };

  const handleCreateShare = (id: string) => {
    setShareId(id);
    setAppState('sharing');
  };

  const handleJoinShare = (user: User, matchPercentage: number) => {
    setMatchData({ user, matchPercentage });
    setAppState('matching');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setShareId(null);
    setMatchData(null);
  };

  const handleBackToLogin = () => {
    setAppState('login');
    setCurrentUser(null);
    setShareId(null);
    setMatchData(null);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {appState === 'login' && (
          <LoginPage onLogin={handleLogin} onJoinShare={handleJoinShare} />
        )}
        
        {appState === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser} 
            onCreateShare={handleCreateShare}
            onBack={handleBackToLogin}
          />
        )}
        
        {appState === 'sharing' && currentUser && shareId && (
          <ShareLink 
            user={currentUser}
            shareId={shareId}
            onBack={handleBackToDashboard}
          />
        )}
        
        {appState === 'matching' && matchData && (
          <TasteMatch 
            matchData={matchData}
            onBack={handleBackToDashboard}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}

export default App;