import { CalendarDays, CreditCard, Dumbbell, Grid2X2, Inbox, LogOut, Menu, MessageSquare, Settings, Trophy, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const items = [
  ['Dashboard', '/admin', Grid2X2],
  ['Sports', '/admin/sports', Dumbbell],
  ['Stadiums', '/admin/stadiums', Trophy],
  ['Reservations', '/admin/reservations', CalendarDays],
  ['Payments', '/admin/payments', CreditCard],
  ['Users', '/admin/users', Users],
  ['Reviews', '/admin/reviews', MessageSquare],
  ['Contact Messages', '/admin/contact-messages', Inbox],
  ['Settings', '/admin', Settings],
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminInitial = (user?.name || 'Admin').trim().slice(0, 1).toUpperCase();

  const signOut = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-slate-200/80 bg-white px-4 py-5 text-slate-700 shadow-[10px_0_35px_rgba(15,23,42,0.04)]">
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-lg font-black text-secondary ring-1 ring-secondary/20">R</span>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-950">RENTSPOT</h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Admin</p>
            </div>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition-all duration-300 ease-out hover:bg-slate-100 hover:text-slate-900 md:hidden" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <div className="mt-2 flex items-center gap-3 text-sm font-bold text-slate-700">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-slate-500 shadow-sm">
              <Grid2X2 size={17} />
            </span>
            Admin Control
          </div>
        </div>
      </div>

      <div className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1">
        <p className="px-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Pages</p>
        <nav className="mt-3 grid content-start gap-1.5 pb-4">
          {items.map(([label, path, Icon]) => (
            <NavLink
              key={label + path}
              end={label === 'Dashboard'}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold tracking-[0.01em] transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-secondary/10 text-secondary shadow-[0_10px_24px_rgba(53,200,90,0.12)] ring-1 ring-secondary/15'
                  : 'text-slate-500 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {({ isActive }) => (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 ease-out ${
                      isActive ? 'bg-white text-secondary shadow-sm' : 'text-slate-500 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm'
                    }`}>
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="truncate">{label}</span>
                  </span>
                  {label === 'Reviews' && <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-black text-cyan-700">New</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-slate-100 pt-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary/10 text-sm font-black text-secondary ring-1 ring-secondary/20">{adminInitial}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950">{user?.name || 'Admin'}</p>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">RENTSPOT control</p>
            </div>
          </div>
          <button onClick={signOut} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-500 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-red-100 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] md:flex">
      <div className="hidden md:sticky md:top-0 md:block md:h-screen md:w-[272px] md:shrink-0">
        {sidebar}
      </div>

      <div className={`fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm transition-all duration-300 ease-out md:hidden ${sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-[80] w-[280px] transform transition-all duration-300 ease-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebar}
      </div>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <button type="button" onClick={() => setSidebarOpen(true)} className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-secondary md:hidden">
          <Menu size={18} /> Menu
        </button>
        <div key={location.pathname} className="route-transition admin-section-transition">
          {outlet}
        </div>
      </main>
    </div>
  );
}
