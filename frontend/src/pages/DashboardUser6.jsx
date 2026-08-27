import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import gambar1 from '../assets/gambar1.jpeg';
import gambar2 from '../assets/gambar2.jpeg';

export default function DashboardUser6() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);
  const [comments, setComments] = useState({});
  
  const [documentNumber, setDocumentNumber] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  
  const navigate = useNavigate();

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    let cleanPath = filePath.replace(/\\/g, '/');
    if (cleanPath.includes('uploads/')) {
      const parts = cleanPath.split('uploads/');
      cleanPath = parts[parts.length - 1];
    }
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    const baseDomain = 'https://aplikasi-workflow-dokumen-production.up.railway.app';
    const fileUrl = `${baseDomain}/uploads/${cleanPath}`;

    const lower = cleanPath.toLowerCase();
    if (lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.ppt') || lower.endsWith('.pptx')) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }
    return fileUrl;
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get('/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allDocs = res.data.data || res.data || [];
      
      const filtered = allDocs.filter(doc => {
        const status = (doc.status || '').trim().toUpperCase();
        return status === '' || status === 'DRAFT' || status.includes('USER6');
      });
      
      setData(filtered);

      const loadedComments = {};
      filtered.forEach(doc => {
        if (doc.comment) {
          loadedComments[doc.id] = doc.comment;
        }
      });
      setComments(loadedComments);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleCommentChange = (id, value) => {
    setComments(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!documentNumber || !title) {
      alert('Nomor dokumen dan judul harus diisi!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('documentNumber', documentNumber);
      formData.append('title', title);
      
      if (file) {
        formData.append('file', file);
      }

      // Jangan set 'Content-Type' secara manual agar Axios otomatis mengatur boundary FormData
      await api.post('/documents', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Dokumen berhasil disimpan!');
      setDocumentNumber('');
      setTitle('');
      setFile(null);
      
      // Reset elemen input file pada DOM
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      fetchDocuments();
    } catch (err) {
      console.error("Gagal menyimpan dokumen:", err);
      const errorMessage = err.response?.data?.message || 'Gagal menyimpan dokumen. Periksa kembali ukuran file atau format yang diizinkan.';
      alert(errorMessage);
    }
  };

  const handleAction = async (id, targetStatus) => {
    try {
      setAnimatingId(id);
      const token = localStorage.getItem('token');
      await api.post(`/documents/${id}/submit`, { 
        targetStatus,
        comment: comments[id] || ''
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTimeout(() => {
        alert('Dokumen berhasil diproses!');
        setAnimatingId(null);
        fetchDocuments();
      }, 400);
    } catch (err) {
      setAnimatingId(null);
      alert('Gagal memproses dokumen.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/documents/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Dokumen berhasil dihapus.');
      fetchDocuments();
    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
      alert('Gagal menghapus dokumen.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getProgressHistory = (status) => {
    if (!status) return 'Belum dikirim (Draft)';
    const s = status.toUpperCase();
    if (s.includes('APPROVED')) return '✨ Selesai (Final Approved)';
    if (s.includes('USER1')) return 'Sudah dikirim ke User 1';
    if (s.includes('USER2')) return 'Sudah dikirim ke User 2';
    if (s.includes('USER3')) return 'Sudah dikirim ke User 3';
    if (s.includes('USER4')) return 'Sudah dikirim ke User 4';
    if (s.includes('USER5')) return 'Sudah dikirim ke User 5';
    if (s.includes('USER6')) return 'Sudah di User 6';
    return status;
  };

  const draftCount = data.filter(d => (d.status || '').trim().toLowerCase() === 'draft' || !(d.status)).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', margin: 0 }}>
      <style>{`
        @keyframes pulseGlow {
          0% { background-color: #e0f2fe; transform: scale(1); }
          50% { background-color: #bae6fd; transform: scale(1.01); }
          100% { background-color: #ffffff; transform: scale(1); }
        }
        .animate-approval { animation: pulseGlow 0.6s ease-in-out; }
        button { transition: all 0.2s ease-in-out; }
        button:hover { filter: brightness(1.1); transform: translateY(-1px); }
      `}</style>

      {/* SIDEBAR (KIRI) */}
      <div style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <img src={gambar1} alt="Logo Kiri" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>SIVERBET</h2>
          </div>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 25px 0', lineHeight: '1.3' }}>Sistem Informasi & Verifikasi Dokumen Balai Embrio Ternak</p>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Pengguna</p>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', display: 'block' }}>OPERATOR</span>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Status Input</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '4px' }}>
              <span>Draft Tersimpan:</span>
              <span style={{ fontWeight: 'bold', color: '#4b5563' }}>{draftCount} Dok</span>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📊</span> OPERATOR
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>🚪</span> Keluar Sistem
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA (KANAN) */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>Halo, Pengguna (OPERATOR)</h1>
          <img src={gambar2} alt="Logo Kanan" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1f2937' }}>Buat / Input Dokumen Baru</h3>
          <form onSubmit={handleSaveDocument} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '5px' }}>No. Dokumen</label>
              <input type="text" placeholder="Contoh: DOC/001" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '5px' }}>Judul Dokumen</label>
              <input type="text" placeholder="Masukkan judul dokumen" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '5px' }}>Upload File</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ width: '100%', fontSize: '12px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '9px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Simpan Dokumen</button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1f2937' }}>Daftar Dokumen</h3>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>No. Dokumen</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>Judul</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>Asal File (Pembuat)</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>Status / Progress</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>File</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>Komentar</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>Aksi / Hapus</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Tidak ada dokumen.</td></tr>
                ) : (
                  data.map((doc) => {
                    const docTitle = doc.title || doc.documentData?.fullName || doc.documentData?.title || '-';
                    const creatorName = doc.user?.username || doc.creator || 'User 6 (Anda)';
                    const isAnimating = animatingId === doc.id;
                    const progressInfo = getProgressHistory(doc.status);
                    const rawFilePath = doc.fileUpload?.filePath || doc.filePath || doc.file;

                    return (
                      <tr key={doc.id} className={isAnimating ? 'animate-approval' : ''}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>{doc.documentNumber}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>{docTitle}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: '500', color: '#4f46e5' }}>{creatorName}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#0369a1', fontWeight: '500' }}>{progressInfo}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>
                          {rawFilePath ? <a href={getFileUrl(rawFilePath)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Lihat File</a> : '-'}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>
                          <input 
                            type="text" 
                            placeholder="Alasan / catatan..." 
                            value={comments[doc.id] !== undefined ? comments[doc.id] : (doc.comment || '')} 
                            onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                            style={{ padding: '6px', fontSize: '12px', width: '140px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                          />
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', textAlign: 'center' }}>
                          <button onClick={() => handleAction(doc.id, 'SUBMITTED_TO_USER1')} style={{ marginRight: '4px', marginBottom: '4px', padding: '6px 8px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Kirim U1</button>
                          <button onClick={() => handleDelete(doc.id)} style={{ padding: '6px 8px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>Hapus</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}