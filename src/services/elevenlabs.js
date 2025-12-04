/**
 * ElevenLabs Voice Service
 * Handles text-to-speech and speech-to-text for conversational AI
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Default voice ID (Rachel - a warm, friendly voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// Voice settings for natural conversation
const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
};

/**
 * Convert text to speech using ElevenLabs API
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Optional voice ID
 * @returns {Promise<Blob>} Audio blob
 */
export async function textToSpeech(text, voiceId = DEFAULT_VOICE_ID) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: VOICE_SETTINGS
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail?.message || `TTS Error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw error;
  }
}

/**
 * Play audio from a blob
 * @param {Blob} audioBlob - Audio blob to play
 * @returns {Promise<void>}
 */
export function playAudio(audioBlob) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioBlob);

    audio.onended = () => {
      URL.revokeObjectURL(audio.src);
      resolve();
    };

    audio.onerror = (error) => {
      URL.revokeObjectURL(audio.src);
      reject(error);
    };

    audio.play().catch(reject);
  });
}

/**
 * Speak text using ElevenLabs TTS
 * @param {string} text - Text to speak
 * @param {string} voiceId - Optional voice ID
 * @returns {Promise<void>}
 */
export async function speak(text, voiceId = DEFAULT_VOICE_ID) {
  const audioBlob = await textToSpeech(text, voiceId);
  await playAudio(audioBlob);
}

/**
 * Speech-to-text using ElevenLabs Scribe API
 * Records audio from microphone and sends to ElevenLabs for transcription
 * @param {Blob} audioBlob - Audio blob to transcribe
 * @returns {Promise<string>} Transcribed text
 */
export async function transcribeAudio(audioBlob) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model_id', 'scribe_v1');

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail?.message || `STT Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw error;
  }
}

/**
 * Audio Recorder class using MediaRecorder API
 */
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('🎙️ Recording started');
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        console.log('⏹️ Recording stopped, blob size:', audioBlob.size);
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording() {
    return this.mediaRecorder?.state === 'recording';
  }
}

/**
 * Voice conversation manager class
 * Handles the full conversation flow with voice input/output
 * Uses ElevenLabs Scribe for STT and ElevenLabs TTS for speech output
 */
export class VoiceConversation {
  constructor(onTranscript, onSpeaking, onError, onListeningChange, onTranscribing) {
    this.onTranscript = onTranscript;
    this.onSpeaking = onSpeaking;
    this.onError = onError;
    this.onListeningChange = onListeningChange;
    this.onTranscribing = onTranscribing;
    this.recorder = new AudioRecorder();
    this.isListening = false;
    this.isSpeaking = false;
    this.isTranscribing = false;
    this.currentAudio = null;
  }

  /**
   * Initialize - nothing needed for MediaRecorder approach
   */
  init() {
    return true;
  }

  /**
   * Start listening (recording) for voice input
   */
  async startListening() {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    try {
      await this.recorder.start();
      this.isListening = true;
      this.onListeningChange?.(true);
      console.log('🎙️ Started recording');
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        this.onError?.('Microphone access denied. Please allow microphone access.');
      } else {
        this.onError?.('Could not start recording: ' + error.message);
      }
      return false;
    }
  }

  /**
   * Stop listening and transcribe the audio
   */
  async stopListening() {
    console.log('⏹️ Stop recording called');

    if (!this.recorder.isRecording()) {
      this.isListening = false;
      this.onListeningChange?.(false);
      return;
    }

    this.isListening = false;
    this.onListeningChange?.(false);

    try {
      const audioBlob = await this.recorder.stop();

      if (!audioBlob || audioBlob.size < 1000) {
        console.log('Recording too short, ignoring');
        return;
      }

      // Transcribe the audio
      this.isTranscribing = true;
      this.onTranscribing?.(true);
      console.log('📤 Sending audio for transcription...');

      const transcript = await transcribeAudio(audioBlob);

      this.isTranscribing = false;
      this.onTranscribing?.(false);

      if (transcript && transcript.trim()) {
        console.log('✅ Transcript:', transcript);
        this.onTranscript(transcript.trim(), true);
      } else {
        console.log('No speech detected in recording');
      }
    } catch (error) {
      this.isTranscribing = false;
      this.onTranscribing?.(false);
      console.error('Transcription error:', error);
      this.onError?.('Could not transcribe audio: ' + error.message);
    }
  }

  /**
   * Speak text using ElevenLabs
   * @param {string} text - Text to speak
   */
  async speak(text) {
    this.isSpeaking = true;
    this.onSpeaking?.(true);

    try {
      // Stop listening while speaking
      this.stopListening();

      const audioBlob = await textToSpeech(text);
      await this.playAudioBlob(audioBlob);
    } catch (error) {
      console.error('Speaking error:', error);
      this.onError?.(error.message);
    } finally {
      this.isSpeaking = false;
      this.onSpeaking?.(false);
    }
  }

  /**
   * Play audio blob
   * @param {Blob} blob - Audio blob
   */
  playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio();
      this.currentAudio.src = URL.createObjectURL(blob);

      this.currentAudio.onended = () => {
        URL.revokeObjectURL(this.currentAudio.src);
        this.currentAudio = null;
        resolve();
      };

      this.currentAudio.onerror = (error) => {
        URL.revokeObjectURL(this.currentAudio.src);
        this.currentAudio = null;
        reject(error);
      };

      this.currentAudio.play().catch(reject);
    });
  }

  /**
   * Stop current audio playback
   */
  stopSpeaking() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      URL.revokeObjectURL(this.currentAudio.src);
      this.currentAudio = null;
    }
    this.isSpeaking = false;
    this.onSpeaking?.(false);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopListening();
    this.stopSpeaking();
    this.recognition = null;
  }
}

/**
 * Check if voice features are supported
 * @returns {Object} Support status for TTS and STT
 */
export function checkVoiceSupport() {
  const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  return {
    tts: !!ELEVENLABS_API_KEY,
    stt: !!ELEVENLABS_API_KEY && hasMediaRecorder && hasGetUserMedia,
    fullySupported: !!ELEVENLABS_API_KEY && hasMediaRecorder && hasGetUserMedia
  };
}

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} List of available voices
 */
export async function getAvailableVoices() {
  if (!ELEVENLABS_API_KEY) {
    return [];
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
}
