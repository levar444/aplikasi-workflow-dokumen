import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import WorkflowTimeline from '../components/WorkflowTimeline';
import DocumentPreview from '../components/DocumentPreview';
import ConfirmModal from '../components/ConfirmModal';
import RevisionModal from '../components/RevisionModal';
import { documentService } from '../services/documentService';

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    documentService.getDocumentById(id).then(res => setDoc(res.data)).catch(() => {});
  }, [id]);

  if (!doc) return <DashboardLayout userRole={user.role}><p>Memuat detail...</p></DashboardLayout>;

  const handleApprove = () => {
    documentService.approveDocument(id).then(() => {
      alert('Dokumen berhasil disetujui');
      window.location.reload();
    });
  };

  const handleRevision = (reason) => {
    documentService.reviseDocument(id, reason).then(() => {
      alert('Dokumen dikembalikan untuk revisi');
      window.location.reload();
    });
  };

  return (
    <DashboardLayout userRole={user.role}>
      <div className="document-detail-container">
        <h2>Detail Dokumen: {doc.documentNumber}</h2>
        <div className="detail-grid">
          <div>
            <p><strong>Nama Lengkap:</strong> {doc.name}</p>
            <p><strong>NIK:</strong> {doc.nik}</p>
            <p><strong>Jenis Dokumen:</strong> {doc.documentType}</p>
            <p><strong>Status:</strong> {doc.status}</p>
            <p><strong>Alamat:</strong> {doc.address}</p>
            <p><strong>No Telepon:</strong> {doc.phone}</p>
            <p><strong>Email:</strong> {doc.email}</p>
            <p><strong>Keterangan:</strong> {doc.description}</p>
          </div>
          <div>
            <DocumentPreview fileUrl={doc.fileUrl} />
          </div>
        </div>

        <WorkflowTimeline documentId={id} />

        {user.role === 'USER1' && doc.status === 'SUBMITTED_TO_USER1' && (
          <div className="action-buttons">
            <button onClick={() => setShowConfirm(true)} className="btn-success">Approve</button>
            <button onClick={() => setShowRevision(true)} className="btn-danger">Kembalikan untuk Revisi</button>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={showConfirm} 
        title="Konfirmasi Approval" 
        message="Apakah Anda yakin dokumen ini sudah sesuai?" 
        onConfirm={handleApprove} 
        onClose={() => setShowConfirm(false)} 
      />

      <RevisionModal 
        isOpen={showRevision} 
        onClose={() => setShowRevision(false)} 
        onSubmit={handleRevision} 
      />
    </DashboardLayout>
  );
}