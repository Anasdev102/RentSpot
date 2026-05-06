import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function formatTime(value) {
  if (!value) return '';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function UserNotifications({ isAdmin = false }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ unread_count: 0, notifications: [] });

  const endpoint = isAdmin ? '/admin/notifications' : '/notifications';

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [endpoint]);

  useEffect(() => {
    const close = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const openNotification = async (notification) => {
    await api.patch(`${endpoint}/${notification.id}/read`);
    setData((current) => ({
      unread_count: Math.max(0, current.unread_count - (notification.read_at ? 0 : 1)),
      notifications: current.notifications.map((item) => (
        item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
      )),
    }));
    setOpen(false);
    navigate(notification.target_url || (isAdmin ? '/admin' : '/dashboard'));
  };

  const markAllAsRead = async () => {
    await api.patch(`${endpoint}/read-all`);
    setData((current) => ({
      unread_count: 0,
      notifications: current.notifications.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })),
    }));
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`notification-trigger relative grid h-7 w-7 place-items-center rounded-full text-slate-700 transition-all duration-300 ease-out hover:bg-slate-100 hover:text-primary ${open ? 'is-open bg-slate-100 text-primary ring-4 ring-primary/10' : ''}`}
        aria-label="Notifications"
      >
        <Bell size={14} />
        {data.unread_count > 0 && (
          <span className="notification-badge absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
            {data.unread_count}
          </span>
        )}
      </button>

      {open && (
        <div className="panel-pop absolute right-0 z-50 mt-3 w-[330px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,35,65,0.16)] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="font-black text-slate-950">Notifications</h3>
              <p className="text-xs text-slate-500">{data.unread_count} unread</p>
            </div>
            <button type="button" onClick={markAllAsRead} className="text-xs font-black text-primary hover:text-blue-700">Mark all read</button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading && data.notifications.length === 0 && <p className="p-4 text-sm text-slate-500">Loading notifications...</p>}
            {!loading && data.notifications.length === 0 && <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}
            {data.notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification)}
                className="grid w-full grid-cols-[auto_1fr] gap-3 border-b border-slate-100 px-4 py-3 text-left transition-all duration-300 ease-out hover:bg-slate-50"
              >
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.read_at ? 'bg-slate-300' : 'bg-primary'}`} />
                <span>
                  <span className="block text-sm font-black text-slate-950">{notification.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">{notification.message}</span>
                  <span className="mt-2 block text-xs font-semibold text-slate-400">{formatTime(notification.created_at)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
