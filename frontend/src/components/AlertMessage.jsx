import React from 'react';

export default function AlertMessage({ type = 'error', message }) {
  if (!message) return null;
  
  const isError = type === 'error';
  
  const style = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
    color: isError ? '#991b1b' : '#166534',
    border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
    animation: isError ? 'shake 0.4s ease-in-out' : 'fadeIn 0.4s ease-in-out'
  };

  return (
    <div style={style} role="alert">
      <span>{isError ? '❌' : '✓'}</span>
      <span>{message}</span>
    </div>
  );
}