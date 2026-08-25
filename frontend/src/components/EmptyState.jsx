import React from 'react';

export default function EmptyState({ message = "Belum ada data." }) {
  return (
    <div className="empty-state">
      <span>📂</span>
      <p>{message}</p>
    </div>
  );
}