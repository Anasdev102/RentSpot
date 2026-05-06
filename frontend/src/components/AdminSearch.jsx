import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const resources = [
  { key: 'users', label: 'User', path: '/admin/users', title: (item) => item.name, subtitle: (item) => item.email },
  { key: 'stadiums', label: 'Stadium', path: '/admin/stadiums', title: (item) => item.name, subtitle: (item) => item.city },
  { key: 'reservations', label: 'Reservation', path: '/admin/reservations', title: (item) => item.stadium?.name || `Reservation #${item.id}`, subtitle: (item) => `${item.user?.name || 'User'} - ${item.status}` },
  { key: 'payments', label: 'Payment', path: '/admin/payments', title: (item) => `Payment #${item.id}`, subtitle: (item) => `${item.status} - $${item.amount}` },
  { key: 'reviews', label: 'Review', path: '/admin/reviews', title: (item) => item.stadium?.name || `Review #${item.id}`, subtitle: (item) => `${item.user?.name || 'User'} - ${item.rating}/5` },
];

export default function AdminSearch() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const normalizedQuery = query.trim();

  useEffect(() => {
    const close = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          resources.map((resource) => api.get(`/admin/${resource.key}`, { params: { search: normalizedQuery } }))
            .map((request) => request.catch(() => ({ data: { data: [] } })))
        );

        setResults(responses.flatMap((response, index) => {
          const resource = resources[index];
          const rows = response.data.data || response.data || [];
          return rows.slice(0, 3).map((item) => ({ ...item, resource }));
        }));
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [normalizedQuery]);

  const groupedResults = useMemo(() => results.slice(0, 8), [results]);

  const openResult = (item) => {
    setOpen(false);
    setQuery('');
    navigate(`${item.resource.path}?highlight=${item.id}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-80">
      <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          placeholder="Search users, stadiums, reservations..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => groupedResults.length > 0 && setOpen(true)}
        />
        <Search className="text-slate-500" size={20} />
      </label>

      {open && (
        <div className="panel-pop absolute right-0 z-50 mt-3 max-h-[420px] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,35,65,0.16)] sm:w-[430px]">
          {loading && <p className="px-3 py-3 text-sm text-slate-500">Searching...</p>}
          {!loading && groupedResults.length === 0 && <p className="px-3 py-3 text-sm text-slate-500">No results found.</p>}
          {groupedResults.map((item) => (
            <button
              key={`${item.resource.key}-${item.id}`}
              type="button"
              onClick={() => openResult(item)}
              className="grid w-full grid-cols-[auto_1fr] gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
            >
              <span className="rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-black text-primary">{item.resource.label}</span>
              <span>
                <span className="block text-sm font-black text-slate-950">{item.resource.title(item)}</span>
                <span className="mt-1 block text-xs text-slate-500">{item.resource.subtitle(item)}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
