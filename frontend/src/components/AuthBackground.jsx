import React from 'react';
import './AuthBackground.css';

export default function AuthBackground() {
  return (
    <div className="auth-background-container" aria-hidden="true">
      <div className="background-shape shape-1"></div>
      <div className="background-shape shape-2"></div>
      <div className="background-shape shape-3"></div>
      <div className="background-grid-overlay"></div>
    </div>
  );
}