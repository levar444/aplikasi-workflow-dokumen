import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DashboardUser1 from './pages/DashboardUser1';
import DashboardUser2 from './pages/DashboardUser2';
import DashboardUser3 from './pages/DashboardUser3';
import DashboardUser4 from './pages/DashboardUser4';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rute untuk halaman admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/dashboard/user1" element={<DashboardUser1 />} />
          <Route path="/dashboard/user2" element={<DashboardUser2 />} />
          <Route path="/dashboard/user3" element={<DashboardUser3 />} />
          <Route path="/dashboard/user4" element={<DashboardUser4 />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;