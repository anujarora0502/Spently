import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 12, 0.3)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} className="glass-panel border-0 border-b">
        <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Spently Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span className="heading-gradient">Spently.</span>
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

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Manage expenses & analytics <br />
            <span className="heading-gradient">with just your voice.</span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Spently is a smart, beautifully designed finance dashboard. Log expenses, generate instant charts, and ask complex questions about your money—all by speaking.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth">
              <Button style={{ padding: '14px 32px', fontSize: '1.1rem' }}>Get Started Free</Button>
            </Link>
          </div>
        </div>

        {/* Feature Preview snippet */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '5rem', width: '100%', maxWidth: '1000px' }}>
          
          <div className="glass-panel animate-fade-in animate-delay-1" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(10, 10, 12, 0.8)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '1rem' }}>"I spent 500 on groceries today"</div>
              <div style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Logged: ₹500 • Groceries
              </div>
            </div>
          </div>

          <div className="glass-panel animate-fade-in animate-delay-2" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(10, 10, 12, 0.8)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '1rem' }}>"Show me a pie chart of my month"</div>
              <div style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                Generated Pie Chart
              </div>
            </div>
          </div>

          <div className="glass-panel animate-fade-in animate-delay-3" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(10, 10, 12, 0.8)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(14, 165, 233, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '1rem' }}>"What did I spend most on in Feb?"</div>
              <div style={{ color: '#3b82f6', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                "Your biggest expense was Mutual Funds."
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
