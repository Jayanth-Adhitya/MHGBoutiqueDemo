import React from 'react';

/**
 * LoadingSpinner Component
 * Animated loading indicator - Dark nature theme
 */
export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-[#11d452]/30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#11d452] animate-spin"></div>
      </div>
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
}

/**
 * TypingIndicator Component
 * Shows animated dots while assistant is typing
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 rounded-full bg-[#11d452] animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
