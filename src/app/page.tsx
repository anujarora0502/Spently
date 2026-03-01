import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 12, 0.3)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} className="glass-panel border-0 border-b">
        <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }} className="heading-gradient">
          Spently.
        </div>
        <Link href="/auth">
          <Button variant="secondary" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Login</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1rem' }}>
        
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', margin: '0 auto 2rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }}></span>
            Powered by Gemini AI
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Track expenses with <br />
            <span className="heading-gradient">just your voice.</span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Spently is a smart, beautifully designed expense tracker. Simply tell it what you bought, and AI handles the categorization and data entry.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth">
              <Button style={{ padding: '14px 32px', fontSize: '1.1rem' }}>Get Started Free</Button>
            </Link>
          </div>
        </div>

        {/* Feature Preview snippet */}
        <div className="animate-fade-in animate-delay-2" style={{ marginTop: '5rem', width: '100%', maxWidth: '800px', position: 'relative' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(10, 10, 12, 0.8)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 500, marginBottom: '6px', fontSize: '1.1rem' }}>"I spent 500 rupees on groceries at Big Bazaar today"</div>
              <div style={{ color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Parsed: ₹500 • Groceries • Today
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
