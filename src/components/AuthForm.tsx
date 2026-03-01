'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { useRouter } from 'next/navigation';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card glow className="w-full max-w-md mx-auto animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isLogin ? 'Sign in to track your expenses' : 'Join Spently to start tracking smartly'}
        </p>
      </div>

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </Card>
  );
}
