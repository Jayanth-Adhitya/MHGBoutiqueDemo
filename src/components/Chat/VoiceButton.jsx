import React from 'react';

/**
 * VoiceButton Component
 * Microphone button with visual feedback - Dark nature theme
 */
export default function VoiceButton({
  isListening,
  isSpeaking,
  isTranscribing,
  isDisabled,
  onClick,
  statusText
}) {
  // Determine button state and styling
  const getButtonState = () => {
    if (isTranscribing) {
      return {
        bg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        ring: 'ring-yellow-500/50',
        icon: 'loading',
        pulse: true
      };
    }
    if (isSpeaking) {
      return {
        bg: 'bg-gradient-to-br from-[#11d452] to-[#0fb847]',
        ring: 'ring-[#11d452]/50',
        icon: 'speaker',
        pulse: true
      };
    }
    if (isListening) {
      return {
        bg: 'bg-gradient-to-br from-red-500 to-rose-600',
        ring: 'ring-red-500/50',
        icon: 'stop',
        pulse: true
      };
    }
    return {
      bg: 'bg-white/10 hover:bg-[#11d452]',
      ring: '',
      icon: 'microphone',
      pulse: false,
      textHover: 'hover:text-[#102216]'
    };
  };

  const state = getButtonState();

  return (
    <div className="flex-shrink-0">
      {/* Main button */}
      <button
        onClick={onClick}
        disabled={isDisabled || isTranscribing}
        className={`
          relative w-12 h-12 rounded-xl
          ${state.bg}
          ${state.ring ? `ring-4 ${state.ring}` : ''}
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center
          text-white ${state.textHover || ''}
          ${state.pulse ? 'voice-pulse' : ''}
        `}
        aria-label={statusText}
        title={statusText}
      >
        {/* Icon based on state */}
        {state.icon === 'loading' && (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {state.icon === 'microphone' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}

        {state.icon === 'stop' && (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        )}

        {state.icon === 'speaker' && (
          <svg
            className="w-5 h-5 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728"
            />
          </svg>
        )}

        {/* Recording indicator rings */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-75"></span>
            <span className="absolute inset-[-4px] rounded-xl border border-red-500/50 animate-pulse"></span>
          </>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <span className="absolute inset-[-4px] rounded-xl border-2 border-[#11d452] animate-pulse"></span>
        )}

        {/* Transcribing indicator */}
        {isTranscribing && (
          <span className="absolute inset-[-4px] rounded-xl border-2 border-yellow-400 animate-pulse"></span>
        )}
      </button>
    </div>
  );
}
