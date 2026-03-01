import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false, style, ...props }: CardProps) {
  return (
    <div 
      className={`glass-panel p-6 ${glow ? 'shadow-[var(--shadow-glow)]' : ''} ${className}`}
      style={{ paddingTop: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', height: '100%', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
