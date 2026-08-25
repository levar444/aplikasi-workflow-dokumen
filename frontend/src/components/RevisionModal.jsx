import React, { useState } from 'react';

export default function RevisionModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Alasan Revisi</h3>
        <textarea 
          placeholder="Masukkan alasan pengembalian..." 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Batal</button>
          <button onClick={() => onSubmit(reason)} className="btn-danger" disabled={!reason.trim()}>Kirim Revisi</button>
        </div>
      </div>
    </div>
  );
}