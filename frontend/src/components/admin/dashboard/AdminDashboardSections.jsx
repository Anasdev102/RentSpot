import { CalendarDays, CheckCircle2, Clock3, CreditCard, Eye, MapPin, MoreHorizontal, Trophy, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminNotifications from '../../AdminNotifications';
import AdminProfileMenu from '../../AdminProfileMenu';
import AdminSearch from '../../AdminSearch';

export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const cardShadow = 'shadow-[0_16px_40px_rgba(15,35,65,0.07)]';
const donutColors = ['#0066FF', '#35C85A', '#F5B700'];

const badgeStyles = {
  pending: 'bg-gold/15 text-gold ring-gold/25',
  confirmed: 'bg-secondary/12 text-secondary ring-secondary/25',
  cancelled: 'bg-red-50 text-red-600 ring-red-200',
  completed: 'bg-primary/10 text-primary ring-primary/20',
  paid: 'bg-secondary/12 text-secondary ring-secondary/25',
  unpaid: 'bg-gold/15 text-gold ring-gold/25',
  refunded: 'bg-purple-50 text-purple-600 ring-purple-200',
};

const avatarColors = [
  'bg-primary/10 text-primary',
  'bg-secondary/10 text-secondary',
  'bg-gold/15 text-gold',
  'bg-purple-100 text-purple-700',
  'bg-cyan-100 text-cyan-700',
  'bg-rose-100 text-rose-700',
];

export const statCards = [
  ['Total Users', 'total_users', '+12%', Users, 'from-blue-50 to-blue-100 text-primary'],
  ['Total Stadiums', 'total_stadiums', '+8%', Trophy, 'from-blue-50 to-cyan-100 text-primary'],
  ['Total Reservations', 'reservations', '+15%', CalendarDays, 'from-green-50 to-emerald-100 text-secondary'],
  ['Total Revenue', 'revenue', '+20%', CreditCard, 'from-amber-50 to-yellow-100 text-gold'],
];

function getInitials(name = 'User') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';
}

function getAvatarColor(name = 'User') {
  const total = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[total % avatarColors.length];
}

export function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-[22px] border border-slate-200/80 bg-white ${cardShadow} ${className}`}>
      {children}
    </section>
  );
}

function StatusPill({ status }) {
  const safeStatus = String(status || 'pending').toLowerCase();

  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold capitalize ring-1 ${badgeStyles[safeStatus] || badgeStyles.pending}`}>
      {safeStatus}
    </span>
  );
}

export function StatCard({ label, value, growth, Icon, tone }) {
  return (
    <Panel className="group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,35,65,0.11)]">
      <div className="flex items-start gap-4">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tone}`}>
          <Icon size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <strong className="truncate text-3xl font-black tracking-tight text-slate-950">{value}</strong>
            <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-black text-secondary">{growth}</span>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-400">from last month</p>
        </div>
      </div>
    </Panel>
  );
}

export function ReservationsChart({ data }) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="reservationArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0066FF" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#0066FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#52677F', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52677F', fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: '#0066FF', strokeOpacity: 0.12, strokeWidth: 2 }}
            contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 16px 35px rgba(15,35,65,0.12)' }}
          />
          <Area type="monotone" dataKey="reservations" stroke="#0066FF" strokeWidth={3} fill="url(#reservationArea)" dot={{ r: 4, fill: '#0066FF', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ revenue, data }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-2 sm:flex-row">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3} stroke="none">
              {data.map((entry, index) => <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 16px 35px rgba(15,35,65,0.12)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <strong className="block text-xl font-black text-slate-950">${Number(revenue || 0).toLocaleString()}</strong>
            <span className="text-sm text-slate-500">Total</span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 text-sm text-slate-600">
        {data.map((item, index) => (
          <p key={item.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: donutColors[index % donutColors.length] }} />
            <span>{item.name}</span>
            <strong className="text-slate-950">{item.value}</strong>
          </p>
        ))}
      </div>
    </div>
  );
}

export function AdminTopBar() {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">RENTSPOT Admin</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearch />
        <AdminNotifications />
        <AdminProfileMenu />
      </div>
    </header>
  );
}

export function WelcomePanel({ stats }) {
  const pending = stats.pendingReservations || 0;
  const paid = stats.paidPayments || 0;

  return (
    <section className="grid items-start gap-6 xl:grid-cols-[2fr_0.98fr]">
      <div className="relative min-h-[210px] overflow-hidden rounded-[22px] bg-gradient-to-r from-[#FFE6CF] via-[#F2F1D8] to-[#BFF8D2] p-6 text-slate-950 shadow-[0_14px_36px_rgba(15,35,65,0.06)] md:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-black leading-tight md:text-[34px]">Hello Admin,</h2>
          <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-800">Welcome to your RENTSPOT dashboard. Monitor bookings, payments, and stadium activity with a clean daily overview.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/reservations" className="rounded-xl bg-[#101820] px-5 py-3 text-sm font-black text-white transition hover:bg-primary">View Reservations</Link>
            <span className="rounded-xl bg-white/55 px-4 py-3 text-sm font-bold text-slate-800 ring-1 ring-white/50">{pending} pending</span>
            <span className="rounded-xl bg-white/55 px-4 py-3 text-sm font-bold text-slate-800 ring-1 ring-white/50">{paid} paid</span>
          </div>
        </div>
      </div>

      <Panel className="min-h-[210px] p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-black text-slate-950">Focus for You</h3>
          <div className="flex gap-2">
            <Link to="/admin/reservations" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-primary hover:text-white">&lsaquo;</Link>
            <Link to="/admin/payments" className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-primary hover:text-white">&rsaquo;</Link>
          </div>
        </div>
        <div className="mt-7">
          <h4 className="max-w-sm text-2xl font-black leading-tight text-slate-800">Review pending bookings before peak hours</h4>
          <p className="mt-4 max-w-sm text-base font-medium leading-7 text-slate-600">You have {pending} pending reservations and {paid} paid payments waiting in the admin workflow.</p>
          <Link to="/admin/reservations" className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary">Review Now</Link>
        </div>
      </Panel>
    </section>
  );
}

export function OperationsSnapshot({ stats }) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {[
        [Clock3, 'Pending Reservations', stats.pendingReservations || 0, 'text-gold', 'bg-gold/10'],
        [CheckCircle2, 'Confirmed Reservations', stats.confirmedReservations || 0, 'text-secondary', 'bg-secondary/10'],
        [CreditCard, 'Paid Payments', stats.paidPayments || 0, 'text-primary', 'bg-primary/10'],
      ].map(([Icon, label, value, color, bg]) => (
        <Panel key={label} className="p-5 transition duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <span className={`grid h-14 w-14 place-items-center rounded-full ${bg} ${color}`}><Icon size={25} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-slate-700">{label}</p>
              <div className="mt-10 flex items-end justify-between gap-4">
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <span className="text-sm font-black text-secondary">Live</span>
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </section>
  );
}

export function PopularStadiums({ reservations }) {
  const stadiums = useMemo(() => {
    const grouped = reservations.reduce((items, reservation) => {
      const name = reservation.stadium?.name || 'Unknown stadium';
      const city = reservation.stadium?.city || 'City';
      const current = items[name] || { name, city, reservations: 0, revenue: 0 };
      current.reservations += 1;
      current.revenue += Number(reservation.total_price || 0);
      items[name] = current;
      return items;
    }, {});

    return Object.values(grouped).sort((a, b) => b.reservations - a.reservations).slice(0, 4);
  }, [reservations]);

  return (
    <Panel className="p-5">
      <h2 className="text-lg font-black text-slate-950">Active Stadiums</h2>
      <div className="mt-5 grid gap-4">
        {stadiums.map((stadium) => (
          <div key={stadium.name} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><MapPin size={22} /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950">{stadium.name}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{stadium.city}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-950">{stadium.reservations}</p>
              <p className="text-xs text-slate-400">bookings</p>
            </div>
          </div>
        ))}
        {stadiums.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No stadium activity yet.</p>}
      </div>
    </Panel>
  );
}

export function RecentReservations({ reservations }) {
  return (
    <Panel className="overflow-hidden p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Recent Reservations</h2>
        <button className="rounded-xl px-3 py-2 text-sm font-black text-primary transition hover:bg-primary/10">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="rounded-l-xl px-4 py-4">User</th>
              <th>Stadium</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Reservation Status</th>
              <th>Payment Status</th>
              <th className="rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                <td className="px-4 py-4 font-bold text-slate-900">
                  <span className={`mr-3 inline-grid h-9 w-9 place-items-center rounded-full text-xs font-black ${getAvatarColor(item.user?.name)}`}>{getInitials(item.user?.name)}</span>
                  {item.user?.name}
                </td>
                <td className="font-medium text-slate-600">{item.stadium?.name}</td>
                <td className="text-slate-600">{item.date}</td>
                <td className="text-slate-600">{item.start_time} - {item.end_time}</td>
                <td className="font-bold text-slate-900">${item.total_price}</td>
                <td><StatusPill status={item.status} /></td>
                <td><StatusPill status={item.payment?.status || 'unpaid'} /></td>
                <td>
                  <div className="flex gap-2">
                    <button className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary hover:text-white" aria-label="View reservation"><Eye size={16} /></button>
                    <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label="More actions"><MoreHorizontal size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
