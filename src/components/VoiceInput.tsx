'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { authFetch } from '@/lib/authFetch';

interface VoiceInputProps {
  onParsedExpense: (expense: { amount: number, date: string, category: string, item: string }) => Promise<void>;
  onGraphRequest: (prompt: string) => void;
  onAnswerRequest: (prompt: string) => void;
}

export function VoiceInput({ onParsedExpense, onGraphRequest, onAnswerRequest }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current][0].transcript;
          setTranscript(result);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setError("Microphone error. Please try again.");
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          // If we have a transcript when listening stops, process it!
        };
      } else {
        setError("Your browser does not support Speech Recognition.");
      }
    }
  }, []);

  // Use a separate effect to trigger processing when listening stops AND we have a transcript
  useEffect(() => {
    if (!isListening && transcript && !isProcessing) {
      processTranscript(transcript);
    }
  }, [isListening, transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleListening = () => {
    if (isProcessing) return;
    setError(null);
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    try {
      // 1. First, classify the intent
      const intentResponse = await authFetch('/api/classify-intent', {
        method: 'POST',
        body: JSON.stringify({ text })
      });

      if (!intentResponse.ok) {
         throw new Error('Failed to classify voice intent');
      }

      const { intent } = await intentResponse.json();

      if (intent === 'SHOW_GRAPH') {
        // Just pass the text to the parent to handle showing the graph
        onGraphRequest(text);
        setTranscript('');
        return;
      }

      if (intent === 'ANSWER_QUERY') {
        onAnswerRequest(text);
        setTranscript('');
        return;
      }

      // 2. If it's an expense, parse it normally
      const response = await authFetch('/api/parse-expense', {
        method: 'POST',
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to parse expense with AI');
      }

      const parsedData = await response.json();
      await onParsedExpense(parsedData);
      setTranscript(''); // Clear on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', zIndex: 50 }}>
      {/* Transcript Popover Display */}
      {(transcript || error || isProcessing) && (
        <div className="glass-panel animate-fade-in voice-popover" style={{ padding: '0.75rem', width: '300px', fontSize: '0.85rem', background: 'rgba(20, 20, 25, 0.9)' }}>
          {error ? (
            <div style={{ color: 'var(--danger)' }}>{error}</div>
          ) : isProcessing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> 
              Parsing request with AI...
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Listening...</div>
              <div style={{ fontStyle: 'italic' }}>"{transcript}"</div>
            </div>
          )}
        </div>
      )}

      {/* Mic Button */}
      <button
        className="voice-fab"
        onClick={toggleListening}
        disabled={isProcessing}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isListening ? 'var(--danger)' : 'var(--accent-gradient)',
          color: 'white',
          border: 'none',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          boxShadow: isListening ? '0 0 20px var(--danger)' : '0 4px 20px rgba(139, 92, 246, 0.4)',
          transition: 'all 0.3s ease',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
