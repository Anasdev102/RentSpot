import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ReservationStats from '../../components/user-dashboard/ReservationStats';
import ReservationsTable from '../../components/user-dashboard/ReservationsTable';
import ReviewForm from '../../components/user-dashboard/ReviewForm';
import UserDashboardHero from '../../components/user-dashboard/UserDashboardHero';
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
        <UserDashboardHero user={user} onLogout={signOut} />
        <ReservationStats reservations={list} />
        <ReservationsTable
          reservations={list}
          error={error}
          loading={loading}
          onPay={pay}
          onCancel={cancel}
          onReview={prepareReview}
        />
        <ReviewForm
          reservations={list}
          review={review}
          message={reviewMessage}
          onReviewChange={setReview}
          onSubmit={submitReview}
        />
      </main>
      <Footer />
    </>
  );
}
