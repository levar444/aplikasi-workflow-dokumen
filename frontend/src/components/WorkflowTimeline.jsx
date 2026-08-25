import React, { useEffect, useState } from 'react';
import { documentService } from '../services/documentService';

export default function WorkflowTimeline({ documentId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    documentService.getDocumentHistory(documentId)
      .then(res => setHistory(res.data))
      .catch(() => {});
  }, [documentId]);

  return (
    <div className="workflow-timeline">
      <h3>Timeline Workflow</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <div className="timeline-point"></div>
            <div className="timeline-content">
              <strong>{item.actor}</strong>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
              <p>{item.action}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}