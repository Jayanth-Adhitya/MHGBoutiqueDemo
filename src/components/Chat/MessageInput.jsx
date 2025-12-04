import React, { useState, useRef, useEffect } from 'react';

/**
 * MessageInput Component
 * Text input for chat messages - Dark nature theme
 */
export default function MessageInput({ onSend, disabled, placeholder }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Type your message or click the mic to speak..."}
          rows={1}
          className="
            w-full px-4 py-3 pr-12
            bg-black/30 border border-white/10
            rounded-xl resize-none
            text-white placeholder-gray-500
            focus:outline-none focus:border-[#11d452] focus:ring-1 focus:ring-[#11d452]/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          "
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="
          p-3 rounded-xl
          bg-[#11d452] hover:bg-[#0fb847]
          disabled:bg-gray-700 disabled:cursor-not-allowed
          text-[#102216]
          transition-all duration-300
          flex-shrink-0
        "
        aria-label="Send message"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  );
}
