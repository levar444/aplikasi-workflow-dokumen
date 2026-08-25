import React from 'react';

const statusMapping = {
  DRAFT_USER4: { label: 'Draft', class: 'badge-gray' },
  SUBMITTED_TO_USER3: { label: 'Menunggu User 3', class: 'badge-blue' },
  REVISION_USER4: { label: 'Revisi User 4', class: 'badge-warning' },
  DRAFT_USER3: { label: 'Draft User 3', class: 'badge-gray' },
  SUBMITTED_TO_USER2: { label: 'Menunggu User 2', class: 'badge-blue' },
  REVISION_USER3: { label: 'Revisi User 3', class: 'badge-warning' },
  DRAFT_USER2: { label: 'Draft User 2', class: 'badge-gray' },
  SUBMITTED_TO_USER1: { label: 'Menunggu Approval', class: 'badge-purple' },
  REVISION_USER2: { label: 'Revisi User 2', class: 'badge-warning' },
  APPROVED: { label: 'Disetujui', class: 'badge-success' },
  REJECTED: { label: 'Ditolak', class: 'badge-danger' },
};

export default function StatusBadge({ status }) {
  const config = statusMapping[status] || { label: status, class: 'badge-gray' };
  return <span className={`status-badge ${config.class}`}>{config.label}</span>;
}