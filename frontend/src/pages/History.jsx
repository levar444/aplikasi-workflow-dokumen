import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function History() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <DashboardLayout userRole={user.role}>
      <h2>Riwayat Workflow</h2>
      <p>Menampilkan seluruh log aktivitas workflow sistem.</p>
    </DashboardLayout>
  );
}