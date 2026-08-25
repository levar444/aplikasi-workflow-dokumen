import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'sm' }) {
  return <div className={`loading-spinner ${size}`} aria-label="Loading"></div>;
}