import { CreditCard, Star, XCircle } from 'lucide-react';
import StatusBadge from '../StatusBadge';

export default function ReservationsTable({ reservations, error, loading, onPay, onCancel, onReview }) {
  return (
    <section className="mt-8 card overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 p-5">
        <h2 className="text-sm font-black">My Reservations</h2>
        <button className="text-xs font-bold text-primary">View all</button>
      </div>
      {error && <p className="mx-5 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Stadium</th><th>Date</th><th>Time</th><th>Reservation</th><th>Payment</th><th>Action</th></tr></thead>
          <tbody>
            {reservations.map((item) => (
              <tr key={item.id}>
                <td className="font-bold">{item.stadium?.name}</td>
                <td>{item.date}</td>
                <td>{item.start_time} - {item.end_time}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><StatusBadge status={item.payment?.status || 'unpaid'} /></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {item.payment?.status !== 'paid' && item.status !== 'cancelled' && (
                      <button disabled={loading} onClick={() => onPay(item.id)} className="btn-primary py-2 text-xs"><CreditCard size={15} /> Pay</button>
                    )}
                    {item.status === 'pending' && (
                      <button disabled={loading} onClick={() => onCancel(item.id)} className="btn-outline py-2 text-xs"><XCircle size={15} /> Cancel</button>
                    )}
                    {item.status === 'completed' && (
                      <button type="button" onClick={() => onReview(item)} className="btn-outline py-2 text-xs"><Star size={15} /> Review</button>
                    )}
                    {item.payment?.status === 'paid' && item.status !== 'pending' && item.status !== 'completed' && (
                      <span className="text-xs font-semibold text-muted">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
