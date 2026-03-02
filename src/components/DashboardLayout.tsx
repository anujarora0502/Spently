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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Link href="/dashboard" style={{ fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Spently Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span className="heading-gradient">Spently.</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="desktop-nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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

          {/* Mobile Hamburger Button */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none', /* shown via CSS on mobile */
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              position: 'relative',
              width: '28px',
              height: '24px',
              zIndex: 60,
            }}
          >
            <span className={`hamburger-line hamburger-line-1 ${menuOpen ? 'active' : ''}`} />
            <span className={`hamburger-line hamburger-line-2 ${menuOpen ? 'active' : ''}`} />
            <span className={`hamburger-line hamburger-line-3 ${menuOpen ? 'active' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu Overlay */}
      {menuOpen && (
        <div 
          className="mobile-menu-overlay animate-overlay"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
        />
      )}

      {/* Mobile Slide-in Menu Panel */}
      <div 
        className={`mobile-menu-panel ${menuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '80vw',
          background: 'rgba(15, 15, 18, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 50,
          padding: '5rem 2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Link 
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          style={{ 
            fontWeight: 600, 
            fontSize: '1.1rem',
            color: pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--rounded-sm)',
            background: pathname === '/dashboard' ? 'rgba(255,255,255,0.05)' : 'transparent',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </Link>
        <Link 
          href="/settings"
          onClick={() => setMenuOpen(false)}
          style={{ 
            fontWeight: 600, 
            fontSize: '1.1rem',
            color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--rounded-sm)',
            background: pathname === '/settings' ? 'rgba(255,255,255,0.05)' : 'transparent',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </Link>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button 
            variant="secondary" 
            onClick={() => { setMenuOpen(false); handleLogout(); }} 
            style={{ width: '100%', padding: '10px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </Button>
        </div>
      </div>
      
      <main className="mobile-p-4" style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', paddingBottom: '6rem' }}>
        {children}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Hamburger line styles */
        .hamburger-line {
          display: block;
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hamburger-line-1 { top: 2px; }
        .hamburger-line-2 { top: 11px; }
        .hamburger-line-3 { top: 20px; }
        
        /* Animate to X */
        .hamburger-line-1.active { 
          top: 11px; 
          transform: rotate(45deg); 
        }
        .hamburger-line-2.active { 
          opacity: 0; 
          transform: scaleX(0); 
        }
        .hamburger-line-3.active { 
          top: 11px; 
          transform: rotate(-45deg); 
        }

        /* Show hamburger, hide desktop links on mobile */
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}} />
    </div>
  );
}
