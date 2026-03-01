'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from './Button';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="glass-panel border-0 border-b" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 12, 0.3)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem' }} className="heading-gradient">
            <Link href="/dashboard">Spently</Link>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link 
              href="/dashboard" 
              style={{ fontWeight: 600, color: pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              Dashboard
            </Link>
            <Link 
              href="/settings" 
              style={{ fontWeight: 600, color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              Settings
            </Link>
            <Button variant="secondary" onClick={handleLogout} style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
      
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
