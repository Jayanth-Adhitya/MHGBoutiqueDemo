import React, { useEffect, useRef } from 'react';
import PerfumeCardList from '../Cards/PerfumeCardList';
import logo from '../../assets/logo.png';

/**
 * Message Component
 * Single message bubble - Elegant dark theme
 */
function Message({ message }) {
  const { role, content, perfumes, timestamp } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-animate overflow-hidden`}>
      <div className={`flex gap-3 max-w-[85%] min-w-0 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`
            w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden
            ${isUser
              ? 'bg-[#11d452]'
              : 'bg-white/10'
            }
          `}
        >
          {isUser ? (
            <svg className="w-4 h-4 text-[#102216]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <img src={logo} alt="AI" className="w-6 h-6 object-contain" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 overflow-hidden min-w-0">
          {/* Message bubble */}
          <div
            className={`
              px-4 py-3 rounded-2xl
              ${isUser
                ? 'bg-[#11d452] text-[#102216] rounded-tr-md'
                : 'bg-white/5 text-gray-200 rounded-tl-md'
              }
            `}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>

          {/* Timestamp */}
          {timestamp && (
            <span className={`text-[10px] text-gray-600 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Perfume cards */}
          {!isUser && perfumes && perfumes.length > 0 && (
            <div className="mt-3">
              <PerfumeCardList perfumes={perfumes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suggestion prompts mapped to more detailed queries
const suggestionPrompts = {
  "Fresh ocean scent": "I'm looking for a fresh ocean-inspired perfume, something that reminds me of the sea breeze and beach vibes",
  "Romantic date night": "Can you recommend a romantic, seductive perfume perfect for a date night?",
  "Warm & cozy": "I want a warm and cozy fragrance, something comforting like vanilla or amber for winter evenings",
  "Summer fragrance": "What's a great light and fresh summer fragrance that won't be too heavy in the heat?"
};

/**
 * MessageList Component
 * Scrollable list of chat messages with elegant welcome screen
 */
export default function MessageList({ messages, isLoading, onSuggestionClick, isSpeaking, onStopSpeaking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestionPrompts[suggestion] || suggestion);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 relative">
      {/* Floating audio indicator & stop button */}
      {isSpeaking && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
          {/* Sound wave animation */}
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-[#11d452] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-4 bg-[#11d452] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-2 bg-[#11d452] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 h-5 bg-[#11d452] rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></span>
            <span className="w-1 h-3 bg-[#11d452] rounded-full animate-pulse" style={{ animationDelay: '250ms' }}></span>
          </div>
          <span className="text-white text-sm">Speaking...</span>
          <button
            onClick={onStopSpeaking}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Stop audio"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {/* Welcome screen */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-48 h-48 object-contain mb-6" />

          <h2 className="text-xl font-bold text-white mb-2">
            AI Scent Concierge
          </h2>
          <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
            Tell me about your mood, a memory, or an occasion and I'll help you find the perfect fragrance.
          </p>

          {/* Quick suggestions */}
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {Object.keys(suggestionPrompts).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10 hover:bg-[#11d452]/10 hover:text-[#11d452] hover:border-[#11d452]/30 transition-all duration-300 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4 overflow-hidden">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="AI" className="w-6 h-6 object-contain" />
            </div>
            <div className="bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
