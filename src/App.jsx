import React, { useCallback, useState } from 'react';
import Header from './components/UI/Header';
import ChatContainer from './components/Chat/ChatContainer';
import HomePage from './components/Home/HomePage';
import CollectionPage from './components/Home/CollectionPage';
import { resetChat } from './services/gemini';

/**
 * Main App Component
 * NaturaScents - Perfume Assistant Chatbot
 */
function App() {
  const [chatKey, setChatKey] = useState(0);
  const [view, setView] = useState('home'); // 'home' | 'chat' | 'collection'

  // Handle chat reset
  const handleReset = useCallback(() => {
    resetChat();
    setChatKey(prev => prev + 1);
  }, []);

  // Navigation handlers
  const handleStartChat = useCallback(() => {
    setView('chat');
  }, []);

  const handleGoHome = useCallback(() => {
    setView('home');
  }, []);

  const handleGoCollection = useCallback(() => {
    setView('collection');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#102216] pattern-bg">
      {/* Header */}
      <Header
        onReset={handleReset}
        currentView={view}
        onNavigateHome={handleGoHome}
        onNavigateChat={handleStartChat}
        onNavigateCollection={handleGoCollection}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {view === 'home' && (
          <HomePage onStartChat={handleStartChat} />
        )}

        {view === 'collection' && (
          <CollectionPage onStartChat={handleStartChat} />
        )}

        {view === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 h-full max-w-5xl mx-auto w-full px-4">
              <ChatContainer key={chatKey} />
            </div>
            {/* Chat footer */}
            <footer className="border-t border-white/10 py-3 px-4 bg-[#102216]/80 backdrop-blur-sm">
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
