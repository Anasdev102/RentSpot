import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function AdminProfileMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const initial = (user?.name || 'Admin').slice(0, 1).toUpperCase();

  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const signOut = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-base font-black text-white">{initial}</span>
        {user?.name || 'Admin'}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="panel-pop absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,35,65,0.16)] origin-top-right transition-all duration-500 ease-out animate-in fade-in zoom-in-95">
          <button type="button" onClick={() => { setOpen(false); navigate('/admin'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            <LayoutDashboard size={17} /> Dashboard
          </button>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50">
            <LogOut size={17} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
