'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Modal } from './Modal';
import { Expense } from '@/types/expense';
import { Loader2 } from 'lucide-react';

interface AIQueryModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  loading?: boolean;
}

export function AIQueryModal({ expenses, isOpen, onClose, initialPrompt }: AIQueryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpPrompt, setFollowUpPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialPrompt) {
      setMessages([]);
      handleNewQuery(initialPrompt, []);
    } else if (!isOpen) {
      setMessages([]);
      setError(null);
      setFollowUpPrompt('');
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpPrompt.trim() || loading) return;
    
    const query = followUpPrompt;
    setFollowUpPrompt('');
    await handleNewQuery(query, messages);
  };

  const handleNewQuery = async (searchQuery: string, currentHistory: ChatMessage[]) => {
    if (!searchQuery.trim() || expenses.length === 0) return;
    
    setLoading(true);
    setError(null);

    const userMsgId = Date.now().toString();
    const aiMsgId = (Date.now() + 1).toString();

    setMessages(prev => [
      ...prev, 
      { id: userMsgId, type: 'user', content: searchQuery },
      { id: aiMsgId, type: 'ai', content: '', loading: true }
    ]);

    try {
      // Format history for the AI exactly how it expects it
      const formattedHistory = currentHistory
        .filter(m => !m.loading && m.content)
        .reduce((acc: any[], msg, idx, arr) => {
           // Group user/AI pairs
           if (msg.type === 'user' && arr[idx+1]?.type === 'ai') {
             acc.push({ query: msg.content, answer: arr[idx+1].content });
           }
           return acc;
        }, []);

      const response = await fetch('/api/answer-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery, expenses, history: formattedHistory })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate answer');
      }

      const rawConfig = await response.json();
      
      if (!rawConfig.answer) {
         throw new Error('AI returned an invalid format. Try rephrasing.');
      }

      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, loading: false, content: rawConfig.answer } : msg
      ));
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => prev.filter(msg => msg.id !== aiMsgId)); // Remove loading bubble on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="500px">
      
      {error && (
        <div style={{ padding: '0.75rem', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          maxHeight: '400px', 
          overflowY: 'auto',
          paddingRight: '8px',
          marginBottom: '1rem'
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            {msg.type === 'user' ? (
               <div style={{ 
                background: 'var(--accent-primary)', 
                color: 'white', 
                padding: '12px 16px', 
                borderRadius: '16px 16px 0px 16px',
                fontSize: '0.95rem'
              }}>
                {msg.content}
              </div>
            ) : (
              <div className="animate-fade-in" style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', 
                padding: '16px', 
                borderRadius: '16px 16px 16px 0px',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                {msg.loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAskFollowUp} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <Input 
            placeholder="Ask a follow up question..." 
            value={followUpPrompt}
            onChange={(e) => setFollowUpPrompt(e.target.value)}
            style={{ padding: '10px 14px', margin: 0 }}
            containerStyle={{ marginBottom: 0 }}
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading || !followUpPrompt.trim()} style={{ padding: '10px 16px', borderRadius: 'var(--rounded-md)', whiteSpace: 'nowrap', margin: 0, height: '42px' }}>
          {loading ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : 'Ask'}
        </Button>
      </form>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </Modal>
  );
}
