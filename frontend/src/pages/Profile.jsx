import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { userService } from '../services/userService';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    userService.getProfile().then(res => setProfile(res.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout userRole={user.role}>
      <h2>Profil Akun</h2>
      <p><strong>Nama:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </DashboardLayout>
  );
}