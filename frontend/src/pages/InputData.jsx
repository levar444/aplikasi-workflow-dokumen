import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const InputData = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    documentNumber: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString().split('T')[0],
    address: '',
    phone: '',
    email: '',
    documentType: 'Surat Permohonan',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/documents', formData);
      alert('Dokumen berhasil dibuat dan disimpan sebagai draft.');
      navigate('/dashboard/user4');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan dokumen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <h1 style={styles.title}>Input Data Dokumen Baru</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nomor Dokumen</label>
            <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Lengkap Pemohon</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Masukkan nama lengkap" required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>NIK</label>
            <input type="text" name="nik" value={formData.nik} onChange={handleChange} placeholder="Nomor Induk Kependudukan" required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tanggal Dokumen</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nomor Telepon</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="08123456789" required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Pemohon</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipe Dokumen</label>
            <select name="documentType" value={formData.documentType} onChange={handleChange} style={styles.input}>
              <option value="Surat Permohonan">Surat Permohonan</option>
              <option value="Surat Tugas">Surat Tugas</option>
              <option value="Laporan Kerja">Laporan Kerja</option>
              <option value="Proposal Anggaran">Proposal Anggaran</option>
            </select>
          </div>
        </div>

        <div style={{ ...styles.inputGroup, marginTop: '1rem' }}>
          <label style={styles.label}>Alamat Lengkap</label>
          <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Alamat pemohon..." required style={styles.textarea}></textarea>
        </div>

        <div style={{ ...styles.inputGroup, marginTop: '1rem' }}>
          <label style={styles.label}>Keterangan / Deskripsi Dokumen</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Deskripsi dokumen..." required style={styles.textarea}></textarea>
        </div>

        <div style={styles.footerAction}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan & Buat Dokumen'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '0.375rem',
    fontWeight: '500',
    fontSize: '0.875rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
    resize: 'vertical',
  },
  footerAction: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
};

export default InputData;