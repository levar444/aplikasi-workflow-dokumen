import React from 'react';

export default function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <p>Data gagal dimuat.</p>
      <button onClick={onRetry} className="btn-primary">Coba Lagi</button>
    </div>
  );
}