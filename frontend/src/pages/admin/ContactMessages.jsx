import { Eye, MailCheck, MessageSquareReply, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import SmoothSelect from '../../components/SmoothSelect';

const statusStyles = {
  unread: 'bg-gold/15 text-gold',
  read: 'bg-primary/10 text-primary',
  replied: 'bg-secondary/10 text-secondary',
};

function StatusBadge({ status }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusStyles[status] || statusStyles.unread}`}>{status}</span>;
}

function MessageModal({ message, onClose, onRead, onReplied, onReply }) {
  const [replyText, setReplyText] = useState('');
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyStatus, setReplyStatus] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);

  if (!message) return null;

  const submitReply = async (event) => {
    event.preventDefault();
    setReplyStatus(null);
    setReplyLoading(true);

    try {
      await onReply(message.id, replyText);
      setReplyText('');
      setReplyOpen(false);
      setReplyStatus({ type: 'success', text: 'Reply sent successfully.' });
    } catch (requestError) {
      setReplyStatus({ type: 'error', text: requestError.response?.data?.message || 'Unable to send reply.' });
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="modal-fade fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <section className="modal-zoom max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(15,35,65,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-primary">Contact Message</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{message.subject || 'No subject'}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18} /></button>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p><strong>Name:</strong> {message.name}</p>
          <p><strong>Email:</strong> {message.email}</p>
          <p><strong>Date:</strong> {new Date(message.created_at).toLocaleString()}</p>
          <p><strong>Status:</strong> <StatusBadge status={message.status} /></p>
          {message.user && (
            <div className="rounded-xl bg-white p-3">
              <p className="font-black text-slate-950">Linked account</p>
              <p className="mt-1">{message.user.name} - {message.user.email}</p>
              {message.user.phone && <p>{message.user.phone}</p>}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm font-black uppercase tracking-wide text-slate-400">Message</p>
          <p className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 p-4 leading-7 text-slate-700">{message.message}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-black uppercase tracking-wide text-slate-400">Previous Replies</p>
            <button type="button" onClick={() => setReplyOpen((current) => !current)} className="btn-primary py-2"><MessageSquareReply size={16} /> Reply</button>
          </div>

          <div className="mt-3 grid gap-3">
            {(message.replies || []).map((reply) => (
              <div key={reply.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                  <span>{reply.admin?.name || 'Admin'}</span>
                  <span>{new Date(reply.sent_at).toLocaleString()}</span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{reply.reply_message}</p>
              </div>
            ))}
            {(message.replies || []).length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No replies yet.</p>}
          </div>
        </div>

        {replyOpen && (
          <form onSubmit={submitReply} className="stagger-item mt-6 grid gap-3 rounded-2xl border border-slate-200 p-4">
            <label className="text-sm font-black text-slate-700">Reply message</label>
            <textarea className="input min-h-32" value={replyText} onChange={(event) => setReplyText(event.target.value)} required placeholder="Write a professional response to the sender..." />
            <button disabled={replyLoading} className="btn-primary justify-self-start"><MessageSquareReply size={16} /> {replyLoading ? 'Sending...' : 'Send Reply'}</button>
          </form>
        )}

        {replyStatus && <p className={`mt-4 rounded-lg p-3 text-sm font-semibold ${replyStatus.type === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-700'}`}>{replyStatus.text}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => onRead(message.id)} className="btn-outline"><MailCheck size={16} /> Mark as read</button>
          <button onClick={() => onReplied(message.id)} className="btn-primary"><MessageSquareReply size={16} /> Mark as replied</button>
        </div>
      </section>
    </div>
  );
}

export default function ContactMessages() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [params] = useSearchParams();
  const highlightedId = params.get('highlight');

  const load = (nextFilters = filters) => {
    setError(null);
    const query = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value));
    api.get('/admin/contact-messages', { params: query })
      .then((response) => setRows(response.data.data || response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load contact messages.'));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(filters), 250);
    return () => clearTimeout(timeout);
  }, [filters]);

  const view = async (id) => {
    const response = await api.get(`/admin/contact-messages/${id}`);
    setSelected(response.data);
  };

  const markAsRead = async (id) => {
    const response = await api.patch(`/admin/contact-messages/${id}/read`);
    setRows((current) => current.map((row) => (row.id === id ? response.data : row)));
    setSelected(response.data);
  };

  const markAsReplied = async (id) => {
    const response = await api.patch(`/admin/contact-messages/${id}/replied`);
    setRows((current) => current.map((row) => (row.id === id ? response.data : row)));
    setSelected(response.data);
  };

  const reply = async (id, replyMessage) => {
    const response = await api.post(`/admin/contact-messages/${id}/reply`, { reply_message: replyMessage });
    setRows((current) => current.map((row) => (row.id === id ? response.data : row)));
    setSelected(response.data);
  };

  const remove = async (id) => {
    if (!confirm(`Delete contact message #${id}?`)) return;
    await api.delete(`/admin/contact-messages/${id}`);
    setRows((current) => current.filter((row) => row.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-bold text-primary">Support Inbox</p>
          <h1 className="text-3xl font-black">Contact Messages</h1>
        </div>
      </div>

      <div className="card mt-6 grid gap-3 p-4 md:grid-cols-[1fr_220px]">
        <input className="input" placeholder="Search name, email, subject, message..." value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
        <SmoothSelect
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          placeholder="All statuses"
          options={[
            { value: '', label: 'All statuses' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' },
            { value: 'replied', label: 'Replied' },
          ]}
        />
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <section className="card mt-6 overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>Sender</th><th>Email</th><th>Subject</th><th>Preview</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((message) => (
              <tr key={message.id} className={String(message.id) === highlightedId ? 'bg-primary/10 ring-1 ring-inset ring-primary/20' : ''}>
                <td className="font-bold">{message.name}</td>
                <td>{message.email}</td>
                <td>{message.subject || 'No subject'}</td>
                <td className="max-w-xs truncate">{message.message}</td>
                <td><StatusBadge status={message.status} /></td>
                <td>{new Date(message.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => view(message.id)} className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary" aria-label="View"><Eye size={15} /></button>
                    <button onClick={() => markAsRead(message.id)} className="grid h-8 w-8 place-items-center rounded-md bg-blue-50 text-primary" aria-label="Mark as read"><MailCheck size={15} /></button>
                    <button onClick={() => markAsReplied(message.id)} className="grid h-8 w-8 place-items-center rounded-md bg-secondary/10 text-secondary" aria-label="Mark as replied"><MessageSquareReply size={15} /></button>
                    <button onClick={() => remove(message.id)} className="grid h-8 w-8 place-items-center rounded-md bg-red-50 text-red-700" aria-label="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-sm text-muted">No contact messages found.</p>}
      </section>

      <MessageModal message={selected} onClose={() => setSelected(null)} onRead={markAsRead} onReplied={markAsReplied} onReply={reply} />
    </div>
  );
}
