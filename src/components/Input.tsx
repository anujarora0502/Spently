import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerStyle?: React.CSSProperties;
}

export function Input({ label, className = '', id, containerStyle, ...props }: InputProps) {
  const inputId = id || Math.random().toString(36).substring(7);
  
  return (
    <div className="flex flex-col w-full" style={{ marginBottom: '1rem', width: '100%', ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${className}`}
        {...props}
      />
    </div>
  );
}
