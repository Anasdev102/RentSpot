import { CreditCard, LockKeyhole } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { payReservation } from '../features/reservations/reservationsSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.reservations);

  if (!current) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16"><p>No reservation selected.</p><Link className="btn-primary mt-4" to="/stadiums">Find stadiums</Link></main>
      </>
    );
  }

  const pay = async () => {
    await dispatch(payReservation(current.id));
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <h1 className="text-center text-2xl font-black">Confirm Your Reservation</h1>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-[1fr_340px]">
          <section className="card p-6">
            <h2 className="text-lg font-black">Reservation Details</h2>
            <div className="mt-5 flex gap-4">
              <img className="h-28 w-36 rounded-md object-cover" src={current.stadium?.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=700&q=80'} alt="" />
              <div>
                <h3 className="font-black">{current.stadium?.name}</h3>
                <p className="mt-1 text-sm text-muted">{current.stadium?.city}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 text-sm">
              <p className="flex justify-between"><strong className="text-text">Date</strong><span>{current.date}</span></p>
              <p className="flex justify-between"><strong className="text-text">Time</strong><span>{current.start_time} - {current.end_time}</span></p>
              <p className="flex justify-between"><strong className="text-text">Reservation</strong><StatusBadge status={current.status} /></p>
              <p className="flex justify-between"><strong className="text-text">Payment</strong><StatusBadge status={current.payment?.status} /></p>
            </div>
          </section>
          <aside className="card p-6">
            <p className="text-sm font-bold text-primary">Payment Summary</p>
            <div className="mt-5 divide-y divide-slate-100 text-sm">
              <p className="flex justify-between py-3"><span>Subtotal</span><strong>${current.total_price}</strong></p>
              <p className="flex justify-between py-3"><span>Service Fee</span><strong>$2</strong></p>
              <p className="flex justify-between py-3 text-lg"><span className="font-black text-slate-950">Total Price</span><strong className="text-primary">${Number(current.total_price) + 2}</strong></p>
            </div>
            <label className="mt-5 flex items-center gap-2 rounded-md border border-slate-200 p-3 text-xs font-semibold"><input type="radio" defaultChecked /> Online Payment</label>
            <button onClick={pay} disabled={loading} className="btn-primary mt-6 w-full"><CreditCard size={18} /> Confirm Payment</button>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted"><LockKeyhole size={14} /> Fake payment for testing. PayPal can be enabled later.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
