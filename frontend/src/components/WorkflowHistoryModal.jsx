import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function WorkflowHistoryModal({ documentId, onClose }) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/documents/${documentId}/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHistories(res.data.data || res.data || []);
      } catch (err) {
        console.error("Gagal memuat riwayat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [documentId]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1f2937' }}>Riwayat Perjalanan Dokumen</h3>
        
        {loading ? (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Memuat riwayat...</p>
        ) : histories.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Belum ada riwayat untuk dokumen ini.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {histories.map((item, index) => (
              <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
                <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{item.previousStatus || 'DRAFT'} ➔ {item.newStatus}</div>
                <div style={{ color: '#4b5563', fontSize: '12px', marginTop: '2px' }}>Oleh: {item.user?.email || 'Sistem'}</div>
                <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>{new Date(item.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}