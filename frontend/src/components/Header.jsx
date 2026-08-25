import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { userService } from '../services/userService';

export default function Header({ onToggleSidebar, darkMode, onToggleDarkMode }) {
  const [profile, setProfile] = useState({ name: '', role: '' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userService.getProfile().then(res => setProfile(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>☰</button>
        <form onSubmit={handleSearch} className="header-search-form">
          <input 
            type="text" 
            placeholder="Cari dokumen, nomor dokumen, atau nama..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={onToggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="notification-wrapper">
          <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
            🔔
          </button>
          {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
        </div>

        <div className="profile-dropdown-wrapper">
          <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="avatar">{profile.name ? profile.name.charAt(0) : 'U'}</div>
            <span className="profile-name">{profile.name}</span>
            <span className="arrow">▼</span>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <strong>{profile.name}</strong>
                <small>{profile.role}</small>
              </div>
              <ul>
                <li onClick={() => navigate('/profile')}>Profil</li>
                <li onClick={handleLogout} className="text-danger">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}