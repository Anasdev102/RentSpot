import { LogOut } from 'lucide-react';

export default function UserDashboardHero({ user, onLogout }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-secondary p-8 text-white shadow-soft">
      <div className="absolute right-8 top-5 grid h-24 w-24 place-items-center rounded-full border-4 border-white/70 bg-slate-100 text-3xl font-black text-primary">
        {(user?.name || 'U').slice(0, 1)}
      </div>
      <div>
        <p className="text-sm text-white/80">Welcome back,</p>
        <h1 className="text-2xl font-black">{user?.name}</h1>
        <p className="mt-1 text-white/75">{user?.email} {user?.phone && `- ${user.phone}`}</p>
      </div>
      <button onClick={onLogout} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-primary shadow-sm transition hover:bg-slate-100 md:absolute md:right-6 md:top-6 md:mt-0">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}
