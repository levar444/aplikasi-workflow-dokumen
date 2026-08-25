import React from 'react';
import StatusBadge from './StatusBadge';

export default function DocumentTable({ documents, onAction, role }) {
  return (
    <div className="table-responsive">
      <table className="document-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Dokumen</th>
            <th>Nama</th>
            <th>Jenis Dokumen</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id}>
              <td>{index + 1}</td>
              <td>{doc.documentNumber}</td>
              <td>{doc.name}</td>
              <td>{doc.documentType}</td>
              <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
              <td><StatusBadge status={doc.status} /></td>
              <td>
                <button onClick={() => onAction('view', doc.id)}>Lihat</button>
                {role === 'USER1' && doc.status === 'SUBMITTED_TO_USER1' && (
                  <>
                    <button onClick={() => onAction('approve', doc.id)}>Approve</button>
                    <button onClick={() => onAction('revise', doc.id)}>Kembalikan</button>
                  </>
                )}
                {role === 'USER2' && (
                  <button onClick={() => onAction('validate', doc.id)}>Validasi</button>
                )}
                {role === 'USER3' && (
                  <button onClick={() => onAction('edit', doc.id)}>Edit</button>
                )}
                {role === 'USER4' && doc.status.includes('REVISION') && (
                  <button onClick={() => onAction('edit', doc.id)}>Perbaiki</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}