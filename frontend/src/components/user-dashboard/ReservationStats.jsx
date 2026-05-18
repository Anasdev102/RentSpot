import { CheckCircle2, Clock, Trophy } from 'lucide-react';

const statsConfig = [
  { label: 'Total Reservations', status: null, icon: Trophy, color: 'text-primary' },
  { label: 'Pending', status: 'pending', icon: Clock, color: 'text-gold' },
  { label: 'Confirmed', status: 'confirmed', icon: CheckCircle2, color: 'text-secondary' },
  { label: 'Completed', status: 'completed', icon: CheckCircle2, color: 'text-secondary' },
];

export default function ReservationStats({ reservations }) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-4">
      {statsConfig.map(({ label, status, icon: Icon, color }) => {
        const value = status ? reservations.filter((item) => item.status === status).length : reservations.length;

        return (
          <div key={label} className="card p-5">
            <p className="text-xs font-semibold text-muted">{label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-black">{value}</p>
              <Icon className={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
