import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { userService } from '../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    userService.getUsers().then(res => setUsers(res.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout userRole={user.role}>
      <h2>Manajemen Akun Pengguna</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email}) - Role: {u.role}</li>
        ))}
      </ul>
    </DashboardLayout>
  );
}