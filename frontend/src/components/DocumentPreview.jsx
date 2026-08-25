import React from 'react';

export default function DocumentPreview({ fileUrl }) {
  return (
    <div className="document-preview">
      {fileUrl ? (
        <iframe src={fileUrl} title="Preview Dokumen" width="100%" height="400px" />
      ) : (
        <p>File preview tidak tersedia.</p>
      )}
    </div>
  );
}