import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Batal</button>
          <button onClick={onConfirm} className="btn-primary">Konfirmasi</button>
        </div>
      </div>
    </div>
  );
}