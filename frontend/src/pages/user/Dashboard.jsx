import { CheckCircle2, Clock, CreditCard, LogOut, Star, Trophy, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import SmoothSelect from '../../components/SmoothSelect';
import StatusBadge from '../../components/StatusBadge';
import { logout } from '../../features/auth/authSlice';
import { cancelReservation, fetchReservations, payReservation } from '../../features/reservations/reservationsSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list, error, loading } = useSelector((state) => state.reservations);
  const [review, setReview] = useState({ reservation_id: '', rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState(null);
  const completedReservations = list.filter((item) => item.status === 'completed');
  const selectedReservation = list.find((item) => String(item.id) === String(review.reservation_id));

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  useEffect(() => {
    if (!review.reservation_id && list.length > 0) {
      const preferredReservation = completedReservations[0] || list[0];
      setReview((current) => ({ ...current, reservation_id: preferredReservation.id }));
    }
  }, [completedReservations, list, review.reservation_id]);

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewMessage(null);

    if (!selectedReservation) {
      setReviewMessage({ type: 'error', text: 'Select one of your reservations first.' });
      return;
    }

    if (selectedReservation.status !== 'completed') {
      setReviewMessage({ type: 'error', text: 'You can review a stadium after one of your reservations is completed.' });
      return;
    }

    try {
      await api.post('/reviews', {
        stadium_id: selectedReservation.stadium_id,
        rating: review.rating,
        comment: review.comment,
      });
      setReview({ reservation_id: selectedReservation.id, rating: 5, comment: '' });
      setReviewMessage({ type: 'success', text: 'Review submitted successfully.' });
    } catch (requestError) {
      setReviewMessage({ type: 'error', text: requestError.response?.data?.message || 'Unable to submit review.' });
    }
  };

  const signOut = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const cancel = async (id) => {
    await dispatch(cancelReservation(id));
  };

  const pay = async (id) => {
    await dispatch(payReservation(id));
    dispatch(fetchReservations());
  };

  const prepareReview = (reservation) => {
    setReview({ reservation_id: reservation.id, rating: 5, comment: '' });
    setReviewMessage(null);
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-secondary p-8 text-white shadow-soft">
          <div className="absolute right-8 top-5 grid h-24 w-24 place-items-center rounded-full border-4 border-white/70 bg-slate-100 text-3xl font-black text-primary">
            {(user?.name || 'U').slice(0, 1)}
          </div>
          <div>
            <p className="text-sm text-white/80">Welcome back,</p>
            <h1 className="text-2xl font-black">{user?.name}</h1>
            <p className="mt-1 text-white/75">{user?.email} {user?.phone && `- ${user.phone}`}</p>
          </div>
          <button onClick={signOut} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-primary shadow-sm transition hover:bg-slate-100 md:absolute md:right-6 md:top-6 md:mt-0">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ['Total Reservations', list.length, Trophy, 'text-primary'],
            ['Pending', list.filter((item) => item.status === 'pending').length, Clock, 'text-gold'],
            ['Confirmed', list.filter((item) => item.status === 'confirmed').length, CheckCircle2, 'text-secondary'],
            ['Completed', list.filter((item) => item.status === 'completed').length, CheckCircle2, 'text-secondary'],
          ].map(([label, value, Icon, color]) => (
            <div key={label} className="card p-5"><p className="text-xs font-semibold text-muted">{label}</p><div className="mt-2 flex items-center justify-between"><p className="text-3xl font-black">{value}</p><Icon className={color} /></div></div>
          ))}
        </div>
        <section className="mt-8 card overflow-hidden">
            <div className="flex items-center justify-between border-b border-black/5 p-5"><h2 className="text-sm font-black">My Reservations</h2><button className="text-xs font-bold text-primary">View all</button></div>
          {error && <p className="mx-5 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead><tr><th>Stadium</th><th>Date</th><th>Time</th><th>Reservation</th><th>Payment</th><th>Action</th></tr></thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="font-bold">{item.stadium?.name}</td>
                    <td>{item.date}</td>
                    <td>{item.start_time} - {item.end_time}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td><StatusBadge status={item.payment?.status || 'unpaid'} /></td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {item.payment?.status !== 'paid' && item.status !== 'cancelled' && (
                          <button disabled={loading} onClick={() => pay(item.id)} className="btn-primary py-2 text-xs"><CreditCard size={15} /> Pay</button>
                        )}
                        {item.status === 'pending' && (
                          <button disabled={loading} onClick={() => cancel(item.id)} className="btn-outline py-2 text-xs"><XCircle size={15} /> Cancel</button>
                        )}
                        {item.status === 'completed' && (
                          <button type="button" onClick={() => prepareReview(item)} className="btn-outline py-2 text-xs"><Star size={15} /> Review</button>
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
        <form id="review-form" onSubmit={submitReview} className="card mt-8 grid gap-4 p-6 md:grid-cols-[1fr_160px_1fr_auto]">
          <SmoothSelect
            value={review.reservation_id}
            onChange={(value) => setReview({ ...review, reservation_id: value })}
            required
            disabled={list.length === 0}
            placeholder={list.length === 0 ? 'No reservations yet' : 'Select reservation stadium'}
            options={[{ value: '', label: list.length === 0 ? 'No reservations yet' : 'Select reservation stadium' }, ...list.map((item) => ({ value: item.id, label: `${item.stadium?.name} - ${item.status}` }))]}
          />
          <SmoothSelect
            value={review.rating}
            onChange={(value) => setReview({ ...review, rating: Number(value) })}
            options={[5, 4, 3, 2, 1].map((rating) => ({ value: rating, label: `${rating} stars` }))}
          />
          <input className="input" placeholder="Comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
          <button className="btn-primary" disabled={list.length === 0}><Star size={18} /> Review</button>
          {reviewMessage && <p className={`md:col-span-4 rounded-lg p-3 text-sm font-semibold ${reviewMessage.type === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-gold/10 text-slate-700'}`}>{reviewMessage.text}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
