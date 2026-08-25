import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses permintaan.');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Lupa Password</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Pemulihan akun sistem</p>

        {error && <div style={{ color: '#dc2626', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: '#16a34a', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{message}</div>}

        <form onSubmit={handleReset}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email Terdaftar</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Kirim Instruksi Pemulihan
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Kembali ke halaman <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}