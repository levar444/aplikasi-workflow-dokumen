import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DocumentTable from '../components/DocumentTable';
import { documentService } from '../services/documentService';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    documentService.getDocuments(Object.fromEntries(params))
      .then(res => setDocuments(res.data))
      .catch(() => {});
  }, [location.search]);

  return (
    <DashboardLayout userRole={user.role}>
      <h2>Daftar Dokumen</h2>
      <DocumentTable documents={documents} role={user.role} onAction={(action, id) => navigate(`/documents/${id}`)} />
    </DashboardLayout>
  );
}