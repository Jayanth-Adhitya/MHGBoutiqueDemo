import React from 'react';
import logo from '../../assets/logo.png';

/**
 * Header Component
 * Branded header with navigation
 */
export default function Header({ onReset, currentView, onNavigateHome, onNavigateChat, onNavigateCollection }) {
  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-2 flex items-center justify-between">
        {/* Logo - Left */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={onNavigateHome}
        >
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        {/* Desktop Navigation - Right */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <button
              onClick={onNavigateHome}
              className={`text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={onNavigateCollection}
              className={`text-sm font-medium transition-colors ${
                currentView === 'collection'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Shop
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* New Chat Button - Only in chat view */}
            {currentView === 'chat' && (
              <button
                onClick={onReset}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="New Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* CTA Button - Not in chat view */}
            {currentView !== 'chat' && (
              <button
                onClick={onNavigateChat}
                className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#11d452] text-[#102216] font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="hidden sm:inline">Talk to AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
