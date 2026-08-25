import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { templateService } from '../services/templateService';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    templateService.getTemplates().then(res => setTemplates(res.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout userRole={user.role}>
      <h2>Manajemen Template</h2>
      <ul>
        {templates.map(t => (
          <li key={t.id}>{t.name} - {t.description}</li>
        ))}
      </ul>
    </DashboardLayout>
  );
}