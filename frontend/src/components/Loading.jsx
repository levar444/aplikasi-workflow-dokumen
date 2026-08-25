import React from 'react';

export default function Loading() {
  return (
    <div className="loading-state">
      <div className="skeleton-loader"></div>
      <p>Memuat data...</p>
    </div>
  );
}