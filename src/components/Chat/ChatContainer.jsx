import React, { useState, useCallback, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import { processMessage, getTextForSpeech } from '../../services/gemini';
import { VoiceConversation, checkVoiceSupport } from '../../services/elevenlabs';

/**
 * ChatContainer Component
 * Main chat interface - Elegant dark nature theme
 */
export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState({ tts: false, stt: false });
  const [voiceError, setVoiceError] = useState('');
  const textareaRef = useRef(null);
  const voiceConversationRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Send message handler
  const handleSendMessage = useCallback(async (text, speakResponse = true) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await processMessage(text);
      const assistantMessage = {
        role: 'assistant',
        content: response.text,
        perfumes: response.perfumes || [],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (speakResponse && voiceConversationRef.current) {
        const speechText = getTextForSpeech(response.text);
        voiceConversationRef.current.speak(speechText);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize voice
  useEffect(() => {
    const support = checkVoiceSupport();
    setVoiceSupport(support);

    if (support.stt) {
      const vc = new VoiceConversation(
        (text, isFinal) => {
          if (isFinal && text) {
            setVoiceError('');
            handleSendMessage(text, true);
          }
        },
        (speaking) => setIsSpeaking(speaking),
        (error) => {
          setIsListening(false);
          setIsTranscribing(false);
          setIsSpeaking(false);
          if (error) {
            setVoiceError(error);
            setTimeout(() => setVoiceError(''), 5000);
          }
        },
        (listening) => setIsListening(listening),
        (transcribing) => setIsTranscribing(transcribing)
      );
      vc.init();
      voiceConversationRef.current = vc;
      return () => {
        vc.destroy();
        voiceConversationRef.current = null;
      };
    }
  }, [handleSendMessage]);

  const handleVoiceClick = useCallback(async () => {
    const vc = voiceConversationRef.current;
    if (!vc) return;

    if (isSpeaking) {
      vc.stopSpeaking();
    } else if (isListening) {
      await vc.stopListening();
    } else if (!isTranscribing && !isLoading) {
      await vc.startListening();
    }
  }, [isListening, isSpeaking, isTranscribing, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      handleSendMessage(message.trim(), voiceSupport.tts);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Get mic button state
  const getMicState = () => {
    if (isTranscribing) return { color: 'bg-amber-500', icon: 'loading', title: 'Transcribing...' };
    if (isSpeaking) return { color: 'bg-[#11d452]', icon: 'speaker', title: 'Speaking... Click to stop' };
    if (isListening) return { color: 'bg-red-500', icon: 'stop', title: 'Recording... Click to stop' };
    return { color: 'bg-white/10 hover:bg-white/20', icon: 'mic', title: 'Click to speak' };
  };

  const micState = getMicState();
  const isInputDisabled = isLoading || isListening || isTranscribing;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto overflow-x-hidden">
      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input Area */}
      <div className="p-4 pb-6">
        {/* Voice error */}
        {voiceError && (
          <div className="mb-3 text-center">
            <span className="inline-block text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full">
              {voiceError}
            </span>
          </div>
        )}

        {/* Input container */}
        <div className="relative">
          <div className="flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#11d452]/50 focus-within:bg-white/[0.07] transition-all duration-300">
            {/* Mic button */}
            <button
              onClick={handleVoiceClick}
              disabled={isLoading || !voiceSupport.stt || isTranscribing}
              title={micState.title}
              className={`
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                ${micState.color}
                text-white transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed
                ${isListening ? 'animate-pulse ring-2 ring-red-500/50' : ''}
                ${isSpeaking ? 'animate-pulse ring-2 ring-[#11d452]/50' : ''}
              `}
            >
              {micState.icon === 'loading' && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {micState.icon === 'mic' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
              {micState.icon === 'stop' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              )}
              {micState.icon === 'speaker' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728" />
                </svg>
              )}
            </button>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isInputDisabled}
              placeholder={
                isListening ? "Listening..." :
                isTranscribing ? "Transcribing..." :
                isSpeaking ? "Speaking..." :
                "Ask about perfumes, scents, or occasions..."
              }
              rows={1}
              className="
                flex-1 bg-transparent border-none resize-none
                text-white text-sm placeholder-gray-500
                focus:outline-none focus:ring-0
                disabled:opacity-50 py-2.5 px-1
                min-h-[40px] max-h-[120px]
              "
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={isInputDisabled || !message.trim()}
              className="
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                bg-[#11d452] hover:bg-[#0fb847]
                disabled:bg-white/10 disabled:text-gray-500
                text-[#102216] transition-all duration-300
                disabled:cursor-not-allowed
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Helper text */}
          <p className="text-[10px] text-gray-600 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
