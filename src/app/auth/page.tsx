import { AuthForm } from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }} className="heading-gradient">
          Spently
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Smart expense tracking with AI
        </p>
      </div>

      <AuthForm />
      
    </div>
  );
}
