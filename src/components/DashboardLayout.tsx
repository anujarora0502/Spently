'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from './Button';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
    window.location.href = '/';
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="glass-panel border-0 border-b" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 12, 0.3)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', width: '100%' }}>
          <Link href="/dashboard" style={{ fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Spently Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span className="heading-gradient">Spently.</span>
          </Link>
          
          <Button variant="secondary" onClick={handleLogout} style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
            Logout
          </Button>
        </div>
      </nav>
      
      <main className="mobile-p-4" style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', paddingBottom: '6rem' }}>
        {children}
      </main>
    </div>
  );
}
