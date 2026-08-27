import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Impor instance api dari file api.js Anda (sesuaikan path folder jika perlu, misal '../services/api')
import api from '../services/api'; 

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('USER1');
  const navigate = useNavigate();

  // 1. Ambil data semua user dari backend menggunakan instance api yang otomatis mendeteksi Railway/Local
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const userData = response.data.data || response.data;
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error('Gagal mengambil data user:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Fungsi untuk mengubah role/hak akses user oleh admin
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await api.put(
        `/users/${selectedUser.id}`,
        {
          name: selectedUser.name || selectedUser.Name || selectedUser.nama,
          email: selectedUser.email,
          role: newRole,
          isActive: selectedUser.isActive
        }
      );
      alert('Berhasil! Peran/Akses user berhasil diubah.');
      setSelectedUser(null);
      fetchUsers(); // Refresh data setelah diubah
    } catch (error) {
      console.error('Gagal mengubah user:', error);
      alert('Terjadi kesalahan saat memperbarui role user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data sistem...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* Header Dashboard & Tombol Navigasi / Logout */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>🛠️ Admin & Control Dashboard</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
            Kelola hak akses role akun dan navigasi frontend sistem workflow dokumen.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Keluar (Logout)
        </button>
      </div>

      {/* Menu Pintasan Akses Frontend */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#333', marginBottom: '10px' }}>Pintasan Halaman Frontend:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard/user1')} style={styles.navBtn}>KEPALA BALAI</button>
          <button onClick={() => navigate('/dashboard/user2')} style={styles.navBtn}>TATA USAHA</button>
          <button onClick={() => navigate('/dashboard/user3')} style={styles.navBtn}>INFOMASI & DISTRIBUSI</button>
          <button onClick={() => navigate('/dashboard/user4')} style={styles.navBtn}>MANAJEMEN PEMELIHARAAN TERNAK</button>
          <button onClick={() => navigate('/dashboard/user5')} style={styles.navBtn}>PRODUKSI & TRANSFER EMBRIO</button>
        </div>
      </div>

      {/* Tabel Daftar Pengguna & Pengaturan Hak Akses */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Daftar Akun Terdaftar & Kontrol Role</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nama</th>
              <th style={{ padding: '12px' }}>Email Akun</th>
              <th style={{ padding: '12px' }}>Role Saat Ini</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Aksi Kontrol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                {/* Menampilkan string nama secara aman atau fallback ke email jika kosong */}
                <td style={{ padding: '12px' }}>
                  {user.name || user.Name || user.nama || (user.email ? user.email.split('@')[0] : 'Tanpa Nama')}
                </td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#e2e8f0', 
                    fontWeight: 'bold',
                    color: user.role === 'ADMIN' ? '#166534' : '#2d3748'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role || 'USER1');
                    }}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#ffc107',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    Ubah Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal / Form Edit Role User */}
      {selectedUser && (
        <div style={{ 
          marginTop: '25px', 
          padding: '25px', 
          backgroundColor: '#fff', 
          border: '2px dashed #007bff', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>Ubah Hak Akses Akun: {selectedUser.email}</h3>
          
          <form onSubmit={handleUpdateUser}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Pilih Hak Akses / Role Baru:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ padding: '10px', width: '100%', maxWidth: '350px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER1">APPROVAL KEPALA BALAI</option>
                <option value="USER2">VALIDATOR TATA USAHA</option>
                <option value="USER3">VALIDATOR INFORMASI & DISTRIBUSI</option>
                <option value="USER4">VALIDATOR MANAJEMEN PEMELIHARAAN TERNAK</option>
                <option value="USER5">VALIDATOR PRODUKSI & TRANSFER EMBRIO</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

const styles = {
  navBtn: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  }
};