import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export default function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="notification-dropdown">
      <div className="notif-header">
        <h4>Notifikasi</h4>
        <span onClick={onClose}>✕</span>
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p className="empty-notif">Tidak ada notifikasi baru</p>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className={`notif-item ${n.read ? '' : 'unread'}`}>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}