'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing key from local storage on mount
    const existingKey = localStorage.getItem('spently_gemini_api_key');
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('spently_gemini_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h1>
        
        <Card glow>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>AI Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Spently uses the Gemini API to parse your voice into structured expenses, and to generate dynamic charts. 
            Your API key is stored securely in your browser's Local Storage and never sent to our servers.
          </p>
          
          <form onSubmit={handleSave}>
            <Input
              label="Google Gemini API Key"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            
            <div className="mobile-col" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <Button type="submit" style={{ width: '100%' }}>Save Settings</Button>
              {saved && <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Saved successfully!</span>}
            </div>
          </form>
          
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Need an API key? Get one for free from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Google AI Studio</a>.
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
