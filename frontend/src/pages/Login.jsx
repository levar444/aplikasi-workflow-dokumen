import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import api from '../services/api';

// TAMBAHKAN IMPORT INI DI ATAS (Agar terbaca oleh bundler Vercel)
import gambarBg from '../assets/gambar.jpeg';
import gambar1 from '../assets/gambar1.jpeg';
import gambar2 from '../assets/gambar2.jpeg';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isRegistering) {
      try {
        await api.post('/auth/register', { name, email, password });
        setSuccessMsg('Akun berhasil dibuat! Silakan masuk.');
        setIsRegistering(false);
        setPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Registrasi gagal.');
      } finally {
        setLoading(false);
      }
    } else {
      const result = await login(email, password);
      setLoading(false);

      console.log('Hasil Login:', JSON.stringify(result, null, 2));

      if (result.success) {
        const userRole = (result.role || '').trim().toUpperCase();

        if (userRole === 'ADMIN') {
          navigate('/admin-dashboard', { replace: true });
        } else if (userRole === 'USER1') {
          navigate('/dashboard/user1', { replace: true });
        } else if (userRole === 'USER2') {
          navigate('/dashboard/user2', { replace: true });
        } else if (userRole === 'USER3') {
          navigate('/dashboard/user3', { replace: true });
        } else if (userRole === 'USER4') {
          navigate('/dashboard/user4', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(result.message || 'Email atau password salah.');
      }
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${gambarBg})` }}>
      {/* Gambar Pojok Kiri Atas */}
      <img src={gambar1} alt="Logo Kiri" style={styles.topLeftImage} />

      {/* Gambar Pojok Kanan Atas */}
      <img src={gambar2} alt="Logo Kanan" style={styles.topRightImage} />

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Sistem Workflow Dokumen</h2>
          <p style={styles.subtitle}>
            {isRegistering ? 'Daftar akun baru untuk mulai input data' : 'Silakan masuk dengan akun Anda untuk melanjutkan'}
          </p>
        </div>

        {error && <div style={styles.alertError}>{error}</div>}
        {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegistering && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.inputNoIcon}
                />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Memproses...' : isRegistering ? 'Daftar Akun Baru' : 'Masuk Sekarang'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.switchMode}>
          <p style={styles.switchText}>
            {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccessMsg('');
            }}
            style={styles.switchBtn}
          >
            {isRegistering ? 'Masuk di sini' : 'Buat akun login akun'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Background image dipindahkan ke inline style utama agar bisa membaca variabel import
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '1rem',
    position: 'relative',
  },
  topLeftImage: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    height: '60px',
    objectFit: 'contain',
  },
  topRightImage: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    height: '60px',
    objectFit: 'contain',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  header: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#94a3b8',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
  },
  inputNoIcon: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    cursor: 'pointer',
    border: 'none',
  },
  switchMode: {
    marginTop: '1.5rem',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  switchText: {
    fontSize: '0.8125rem',
    color: '#64748b',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }
};

export default Login;