import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, Menu, ShieldAlert } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div style={{ padding: '20px' }}>Memuat sesi...</div>;
  }

  const handleLogout = () => {
    if (logout) logout();
    localStorage.clear();
    window.location.href = '/login';
  };

  // Logika Menu Berdasarkan Role
  const getMenuByRole = () => {
    if (!user || !user.role) return [];
    
    // Normalisasi role agar tidak masalah dengan huruf besar/kecil
    const role = user.role.toUpperCase().trim();

    if (role === 'USER1') {
      return [
        { label: 'Dashboard Approver', path: '/dashboard/user1', icon: LayoutDashboard },
        { label: 'Kelola Dokumen', path: '/documents', icon: FileText },
        { label: 'Manajemen User', path: '/users', icon: Users },
      ];
    } else if (role === 'USER2') {
      return [
        { label: 'Dashboard Validator', path: '/dashboard/user2', icon: LayoutDashboard },
        { label: 'Verifikasi Dokumen', path: '/documents', icon: FileText },
      ];
    } else if (role === 'USER3') {
      return [
        { label: 'Dashboard User 3', path: '/dashboard/user3', icon: LayoutDashboard },
        { label: 'Kelola Dokumen', path: '/documents', icon: FileText },
      ];
    } else if (role === 'USER4') {
      return [
        { label: 'Dashboard User 4', path: '/dashboard/user4', icon: LayoutDashboard },
        { label: 'Kelola Dokumen', path: '/documents', icon: FileText },
      ];
    }
    return [];
  };

  const menus = getMenuByRole();

  return (
    <div style={styles.layout}>
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      
      <aside style={{ ...styles.sidebar, transform: sidebarOpen ? 'translateX(0)' : undefined }}>
        <div style={styles.sidebarHeader}>
          <ShieldAlert color="#2563eb" size={28} />
          <h1 style={styles.sidebarTitle}>Workflow System</h1>
        </div>
        
        <div style={styles.userInfoBox}>
          <p style={styles.userName}>{user?.name || 'Pengguna'}</p>
          <span style={styles.userRoleBadge}>{user?.role || 'USER'}</span>
        </div>

        <nav style={styles.nav}>
          {menus.map((menu, idx) => {
            const Icon = menu.icon;
            const isActive = location.pathname === menu.path;
            return (
              <button
                key={idx}
                onClick={() => { navigate(menu.path); setSidebarOpen(false); }}
                style={{
                  ...styles.navItem,
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#475569',
                }}
              >
                <Icon size={20} />
                <span>{menu.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      <div style={styles.mainWrapper}>
        <header style={styles.header}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuToggle}>
            <Menu size={24} />
          </button>
          <div style={styles.headerRight}>
            <span style={styles.welcomeText}>Halo, <b>{user?.name || 'Pengguna'}</b></span>
          </div>
        </header>

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  sidebar: { width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50, transition: 'transform 0.3s ease' },
  sidebarHeader: { padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #f1f5f9' },
  sidebarTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a' },
  userInfoBox: { padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' },
  userName: { fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' },
  userRoleBadge: { display: 'inline-block', marginTop: '0.25rem', padding: '0.125rem 0.5rem', backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '700' },
  nav: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '500', fontSize: '0.875rem', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' },
  sidebarFooter: { padding: '1rem', borderTop: '1px solid #f1f5f9' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem', width: '100%', border: 'none', cursor: 'pointer' },
  mainWrapper: { flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' },
  header: { height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 30 },
  menuToggle: { display: 'none', background: 'none', border: 'none', cursor: 'pointer' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcomeText: { fontSize: '0.875rem', color: '#334155' },
  content: { padding: '2rem', flex: 1 }
};

export default DashboardLayout;