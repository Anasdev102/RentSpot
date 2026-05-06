import { CalendarDays, ChevronLeft, ChevronRight, Images, MapPin, Ruler, ShieldCheck, Star, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import FavoriteButton from '../components/FavoriteButton';
import Navbar from '../components/Navbar';
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
  const [form, setForm] = useState({ date: '', start_time: '18:00', end_time: '19:00' });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const nowTime = new Date().toTimeString().slice(0, 5);
  const minStartTime = form.date === today ? nowTime : undefined;

  useEffect(() => {
    dispatch(fetchStadium(id));
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

  if (!selected && loading) return <p className="p-8">Loading...</p>;
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
    dispatch(createReservation({ stadium_id: selected.id, ...form }));
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Link to="/stadiums" className="mb-4 inline-flex text-xs font-bold text-slate-600 hover:text-primary">&lt; Back to all fields</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <div className="relative overflow-hidden rounded-lg shadow-soft">
              <button type="button" onClick={() => setGalleryOpen(true)} className="block w-full">
                <img className="h-[330px] w-full object-cover" src={activeImage} alt={selected.name} />
              </button>
              {stadiumImages.length > 1 && (
                <>
                  <button type="button" onClick={showPreviousImage} className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-soft" aria-label="Previous image">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={showNextImage} className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-soft" aria-label="Next image">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <button type="button" onClick={() => setGalleryOpen(true)} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black text-slate-900 shadow-soft">
                <Images size={15} /> View all photos ({stadiumImages.length})
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {stadiumImages.map((img, index) => (
                <button key={img.id || img.image_path} type="button" onClick={() => setActiveImageIndex(index)} className={`overflow-hidden rounded-md border-2 bg-white shadow-sm transition ${activeImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-white hover:border-primary/50'}`}>
                  <img className="h-20 w-full object-cover" src={img.image_path} alt={`${selected.name} ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-950">{selected.name}</h1>
                <span className="rounded-md bg-secondary/10 px-2 py-1 text-xs font-bold text-secondary">Available</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-muted">
                <span><MapPin className="mr-1 inline text-primary" size={18} />{selected.city}</span>
                <span><Users className="mr-1 inline text-primary" size={18} />{selected.capacity || 'Flexible'} capacity</span>
                <span><Star className="mr-1 inline text-gold" size={18} fill="currentColor" />{Number(selected.reviews_avg_rating || 0).toFixed(1)}</span>
              </div>
              <p className="mt-5 text-muted">{selected.description}</p>
              <div className="mt-7 grid gap-3 text-sm md:grid-cols-2">
                <p className="flex items-center gap-3"><Users className="text-slate-500" size={17} /> Capacity <strong className="ml-auto text-slate-900">{selected.capacity || 22} Players</strong></p>
                <p className="flex items-center gap-3"><Ruler className="text-slate-500" size={17} /> Field Type <strong className="ml-auto text-slate-900">Artificial Grass</strong></p>
                <p className="flex items-center gap-3"><ShieldCheck className="text-slate-500" size={17} /> Facilities <strong className="ml-auto text-slate-900">Parking, Showers</strong></p>
              </div>
              <h2 className="mt-10 text-2xl font-black">Reviews</h2>
              <div className="mt-4 grid gap-4">
                {selected.reviews?.map((review) => (
                  <div key={review.id} className="card p-4">
                    <p className="font-bold">{review.user?.name} <span className="text-gold">{review.rating}/5</span></p>
                    <p className="mt-1 text-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="card h-fit p-5">
            <p className="text-lg font-black text-slate-950">Book this field</p>
            <form onSubmit={reserve} className="mt-6 grid gap-4">
              <label className="text-xs font-bold text-slate-700">Select Date<input className="input mt-2" type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
              <div>
                <p className="mb-2 text-xs font-bold text-slate-700">Available Time Slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '16:00 - 17:00', '19:00 - 20:00'].map((slot) => (
                    <button key={slot} type="button" className={`rounded-md border px-2 py-2 text-[11px] font-bold ${slot.startsWith(form.start_time) ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700">Start<input className="input mt-2" type="time" min={minStartTime} value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required /></label>
                <label className="text-xs font-bold text-slate-700">End<input className="input mt-2" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required /></label>
              </div>
              <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 p-4 text-sm">
                <p className="flex justify-between py-2"><span>Price / hour</span><strong>${selected.price_per_hour}</strong></p>
                <p className="flex justify-between py-2"><span>Total Price</span><strong className="text-primary">${selected.price_per_hour}</strong></p>
              </div>
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button className="btn-primary"><CalendarDays size={18} /> Reserve Now</button>
              <FavoriteButton
                stadiumId={selected.id}
                initial={isFavorite}
                onChange={(_, nextValue) => setIsFavorite(nextValue)}
                variant="button"
              />
            </form>
          </aside>
        </div>
      </main>
      {galleryOpen && (
        <div className="modal-fade fixed inset-0 z-[80] bg-slate-950/90 px-4 py-5 text-white">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black">{selected.name}</p>
                <p className="text-xs font-semibold text-white/60">{activeImageIndex + 1} / {stadiumImages.length}</p>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Close gallery">
                <X size={20} />
              </button>
            </div>
            <div className="modal-zoom relative mt-5 flex min-h-0 flex-1 items-center justify-center">
              {stadiumImages.length > 1 && (
                <button type="button" onClick={showPreviousImage} className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Previous image">
                  <ChevronLeft size={24} />
                </button>
              )}
              <img className="max-h-full max-w-full rounded-lg object-contain" src={activeImage} alt={selected.name} />
              {stadiumImages.length > 1 && (
                <button type="button" onClick={showNextImage} className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Next image">
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {stadiumImages.map((img, index) => (
                <button key={img.id || img.image_path} type="button" onClick={() => setActiveImageIndex(index)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 ${activeImageIndex === index ? 'border-secondary' : 'border-white/20'}`}>
                  <img src={img.image_path} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
