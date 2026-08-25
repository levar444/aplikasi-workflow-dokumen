import React from 'react';

export default function DashboardCard({ icon, title, value, description, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-info">
        <h3>{title}</h3>
        <h2>{value}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}