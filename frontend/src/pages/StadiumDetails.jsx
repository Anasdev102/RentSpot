import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import GalleryModal from '../components/stadium-details/GalleryModal';
import ReservationCard from '../components/stadium-details/ReservationCard';
import ReviewsList from '../components/stadium-details/ReviewsList';
import StadiumDetailsLoader from '../components/stadium-details/StadiumDetailsLoader';
import StadiumGallery from '../components/stadium-details/StadiumGallery';
import StadiumInfo from '../components/stadium-details/StadiumInfo';
import api from '../api/axios';
import { createReservation } from '../features/reservations/reservationsSlice';
import { fetchStadium } from '../features/stadiums/stadiumsSlice';

export default function StadiumDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading, error: stadiumError } = useSelector((state) => state.stadiums);
  const { current, error } = useSelector((state) => state.reservations);
  const { token } = useSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [form, setForm] = useState({ date: '', start_time: '', end_time: '' });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialFetchPending, setInitialFetchPending] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const nowTime = new Date().toTimeString().slice(0, 5);
  const minStartTime = form.date === today ? nowTime : undefined;

  useEffect(() => {
    let isMounted = true;
    setInitialFetchPending(true);

    dispatch(fetchStadium(id)).finally(() => {
      if (isMounted) setInitialFetchPending(false);
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!token || !id) {
      setIsFavorite(false);
      return;
    }

    api.get('/favorites')
      .then((response) => setIsFavorite((response.data || []).some((stadium) => String(stadium.id) === String(id))))
      .catch(() => setIsFavorite(false));
  }, [token, id]);

  useEffect(() => {
    setActiveImageIndex(0);
    setGalleryOpen(false);
  }, [id, selected?.id]);

  useEffect(() => {
    if (current?.id) navigate('/checkout');
  }, [current, navigate]);

  if (!selected && (loading || initialFetchPending)) {
    return (
      <>
        <Navbar />
        <StadiumDetailsLoader />
        <Footer />
      </>
    );
  }
  if (!selected) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <Link to="/stadiums" className="mb-4 inline-flex text-xs font-bold text-slate-600 hover:text-primary">&lt; Back to all fields</Link>
          <div className="card p-6">
            <h1 className="text-xl font-black text-slate-950">Stadium not found</h1>
            <p className="mt-2 text-sm text-muted">{stadiumError || 'This stadium is unavailable or no longer exists.'}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80';
  const stadiumImages = selected.images?.length ? selected.images : [{ id: 'fallback', image_path: fallbackImage, is_main: true }];
  const activeImage = stadiumImages[activeImageIndex]?.image_path || stadiumImages[0].image_path;
  const showPreviousImage = () => setActiveImageIndex((current) => (current === 0 ? stadiumImages.length - 1 : current - 1));
  const showNextImage = () => setActiveImageIndex((current) => (current === stadiumImages.length - 1 ? 0 : current + 1));

  const reserve = async (event) => {
    event.preventDefault();
    if (!token) return navigate('/login');
    if (!form.date || !form.start_time || !form.end_time) return;
    dispatch(createReservation({ stadium_id: selected.id, ...form }));
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Link to="/stadiums" className="mb-4 inline-flex text-xs font-bold text-slate-600 hover:text-primary">&lt; Back to all fields</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <StadiumGallery
              stadiumName={selected.name}
              images={stadiumImages}
              activeImageIndex={activeImageIndex}
              activeImage={activeImage}
              onPrevious={showPreviousImage}
              onNext={showNextImage}
              onOpen={() => setGalleryOpen(true)}
              onSelect={setActiveImageIndex}
            />
            <StadiumInfo stadium={selected} />
            <ReviewsList reviews={selected.reviews} />
          </section>
          <ReservationCard
            stadium={selected}
            form={form}
            today={today}
            minStartTime={minStartTime}
            error={error}
            isFavorite={isFavorite}
            onFormChange={setForm}
            onSubmit={reserve}
            onFavoriteChange={setIsFavorite}
          />
        </div>
      </main>
      {galleryOpen && (
        <GalleryModal
          stadiumName={selected.name}
          images={stadiumImages}
          activeImageIndex={activeImageIndex}
          activeImage={activeImage}
          onPrevious={showPreviousImage}
          onNext={showNextImage}
          onSelect={setActiveImageIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
      <Footer />
    </>
  );
}
