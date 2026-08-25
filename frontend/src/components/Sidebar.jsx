import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getMenuByRole = () => {
    switch (role) {
      case 'USER1':
        return [
          { name: 'Dashboard', path: '/dashboard/user1', icon: '📊' },
          { name: 'Dokumen Menunggu', path: '/documents?status=SUBMITTED_TO_USER1', icon: '📄' },
          { name: 'Disetujui', path: '/documents?status=APPROVED', icon: '✅' },
          { name: 'Riwayat Workflow', path: '/history', icon: '⏳' },
          { name: 'Manajemen Akun', path: '/users', icon: '👥' },
          { name: 'Profil', path: '/profile', icon: '👤' },
        ];
      case 'USER2':
        return [
          { name: 'Dashboard', path: '/dashboard/user2', icon: '📊' },
          { name: 'Data Masuk', path: '/documents?status=SUBMITTED_TO_USER2', icon: '📥' },
          { name: 'Validasi', path: '/documents?status=VALIDATION', icon: '🔍' },
          { name: 'Perlu Revisi', path: '/documents?status=REVISION_USER2', icon: '⚠️' },
          { name: 'Riwayat Workflow', path: '/history', icon: '⏳' },
          { name: 'Profil', path: '/profile', icon: '👤' },
        ];
      case 'USER3':
        return [
          { name: 'Dashboard', path: '/dashboard/user3', icon: '📊' },
          { name: 'Data Masuk', path: '/documents?status=SUBMITTED_TO_USER3', icon: '📥' },
          { name: 'Dokumen', path: '/documents', icon: '📁' },
          { name: 'Template', path: '/templates', icon: '📋' },
          { name: 'Perlu Revisi', path: '/documents?status=REVISION_USER3', icon: '⚠️' },
          { name: 'Riwayat Workflow', path: '/history', icon: '⏳' },
          { name: 'Profil', path: '/profile', icon: '👤' },
        ];
      case 'USER4':
        return [
          { name: 'Dashboard', path: '/dashboard/user4', icon: '📊' },
          { name: 'Input Data', path: '/input-data', icon: '➕' },
          { name: 'Data Saya', path: '/documents?mine=true', icon: '📂' },
          { name: 'Perlu Revisi', path: '/documents?status=REVISION_USER4', icon: '⚠️' },
          { name: 'Upload Dokumen', path: '/documents', icon: '📤' },
          { name: 'Riwayat Workflow', path: '/history', icon: '⏳' },
          { name: 'Profil', path: '/profile', icon: '👤' },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>WorkflowApp</h2>
        </div>
        <ul className="sidebar-menu">
          {getMenuByRole().map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <span className="icon">🚪</span>
              <span className="label">Logout</span>
            </button>
          </li>
        </ul>
      </aside>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
}