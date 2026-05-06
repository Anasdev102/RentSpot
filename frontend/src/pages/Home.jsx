import { BadgeCheck, CalendarCheck, CreditCard, Dumbbell, Headphones, Lock, MapPin, Medal, Search, Send, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import SmoothSelect from '../components/SmoothSelect';
import StadiumCard from '../components/StadiumCard';
import api from '../api/axios';
import { fetchCities, fetchSports, fetchStadiums } from '../features/stadiums/stadiumsSlice';

const sports = [
  ['Football', 'Top football fields', Trophy, 'text-primary', 'bg-primary/10'],
  ['Padel', 'Padel courts', Dumbbell, 'text-secondary', 'bg-secondary/10'],
  ['Tennis', 'Tennis courts', CircleIcon, 'text-primary', 'bg-primary/10'],
  ['Basketball', 'Basketball courts', Medal, 'text-orange-500', 'bg-orange-100'],
];

const supportEmail = 'elidrissianas210@gmail.com';

function CircleIcon(props) {
  return <Trophy {...props} />;
}

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sports: sportOptions, cities, list } = useSelector((state) => state.stadiums);
  const { user } = useSelector((state) => state.auth);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [contact, setContact] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [heroSportId, setHeroSportId] = useState('');
  const [heroCity, setHeroCity] = useState('');
  const [contactMessage, setContactMessage] = useState(null);
  const [contactErrors, setContactErrors] = useState({});
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSports());
    dispatch(fetchCities());
    dispatch(fetchStadiums());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setContact((current) => ({
        ...current,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    api.get('/favorites')
      .then((response) => setFavoriteIds((response.data || []).map((stadium) => stadium.id)))
      .catch(() => setFavoriteIds([]));
  }, [user]);

  const updateFavorite = (stadiumId, isFavorite) => {
    setFavoriteIds((current) => (
      isFavorite
        ? [...new Set([...current, stadiumId])]
        : current.filter((id) => id !== stadiumId)
    ));
  };

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    ['sport_id', 'city'].forEach((key) => {
      if (form.get(key)) params.set(key, form.get(key));
    });
    navigate(`/stadiums?${params.toString()}`);
  };
  const cityOptions = cities?.length ? cities : [...new Set(list.map((stadium) => stadium.city).filter(Boolean))];

  const submitContact = async (event) => {
    event.preventDefault();
    setContactMessage(null);
    setContactErrors({});
    setContactLoading(true);

    try {
      await api.post('/contact', {
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
      });

      setContactMessage('Your message was sent successfully. Our admin team will review it soon.');
      setContact((current) => ({ ...current, subject: '', message: '' }));
    } catch (requestError) {
      setContactErrors(requestError.response?.data?.errors || {});
      setContactMessage(requestError.response?.data?.message || 'Unable to send your message.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="hero-field relative overflow-hidden text-white">
          <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20">
            <div>
              <h1 className="max-w-xl text-5xl font-black leading-tight md:text-6xl">
                Reserve Your Sports Field in <span className="text-secondary">Seconds</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white">Find football, padel, tennis and basketball fields near you. Choose your time, pay online, and enjoy the game.</p>
              <div className="mt-9 flex flex-wrap gap-5 text-sm font-bold">
                {[[Zap, 'Fast Booking'], [ShieldCheck, 'Secure Payment'], [BadgeCheck, 'Instant Confirmation']].map(([Icon, badge]) => (
                  <span key={badge} className="inline-flex items-center gap-2"><Icon className="text-gold" size={18} fill="currentColor" /> {badge}</span>
                ))}
              </div>
            </div>
            <form onSubmit={submit} className="ml-auto grid w-full max-w-2xl gap-0 rounded-lg bg-white p-4 text-text shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="border-b border-black/10 px-4 py-2 md:border-b-0 md:border-r">
                <span className="flex items-center gap-2 text-sm font-black"><MapPin className="text-primary" size={16} /> Sport</span>
                <SmoothSelect
                  name="sport_id"
                  value={heroSportId}
                  onChange={setHeroSportId}
                  placeholder="All Sports"
                  className="mt-2"
                  options={[{ value: '', label: 'All Sports' }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
                />
              </label>
              <label className="border-b border-black/10 px-4 py-2 md:border-b-0 md:border-r">
                <span className="flex items-center gap-2 text-sm font-black"><MapPin className="text-primary" size={16} /> City</span>
                <SmoothSelect
                  name="city"
                  value={heroCity}
                  onChange={setHeroCity}
                  placeholder="All Cities"
                  className="mt-2"
                  options={[{ value: '', label: 'All Cities' }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
                />
              </label>
              <label className="px-4 py-2">
                <span className="flex items-center gap-2 text-sm font-black"><CalendarCheck className="text-primary" size={16} /> Date</span>
                <input name="date" className="mt-2 w-full bg-transparent text-sm font-semibold text-muted outline-none" type="date" />
              </label>
              <button className="btn-primary min-h-20 flex-col px-6"><Search size={22} /> Search</button>
            </form>
          </div>
          <div className="absolute -bottom-10 left-0 h-20 w-full -skew-y-2 bg-white" />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-16">
          <SectionHeader title="Popular Sports" />
          <div className="grid gap-5 md:grid-cols-4">
            {sports.map(([name, text, Icon, iconColor, bgColor]) => (
              <div key={name} className="rounded-lg bg-white p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${bgColor} ${iconColor}`}><Icon size={38} /></div>
                <h3 className="mt-5 font-black">{name}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
                <div className={`mx-auto mt-4 h-1 w-8 rounded-full ${name === 'Padel' ? 'bg-secondary' : name === 'Basketball' ? 'bg-gold' : 'bg-primary'}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-black">Featured Stadiums</h2>
              <Link to="/stadiums" className="text-sm font-bold text-primary">View all stadiums &rarr;</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {list.slice(0, 3).map((stadium) => (
                <StadiumCard
                  key={stadium.id}
                  stadium={stadium}
                  isFavorite={favoriteIds.includes(stadium.id)}
                  onFavoriteChange={updateFavorite}
                />
              ))}
              {list.length === 0 && <p className="text-muted">No stadiums available yet.</p>}
            </div>
          </div>
        </section>

        <section id="how" className="bg-gradient-to-b from-white to-primary/5 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader title="How It Works" />
            <div className="relative grid gap-8 md:grid-cols-3">
              {[[Sparkles, 'Choose a Field', 'Select your favorite sport and choose a field.'], [CalendarCheck, 'Select Date & Time', 'Pick the best date and time that suits you.'], [CreditCard, 'Pay Online & Play', 'Pay securely online and enjoy your game.']].map(([Icon, title, text], index) => (
                <div key={title} className="relative text-center">
                  <span className="mx-auto mb-3 grid h-7 w-7 place-items-center rounded-full bg-secondary text-sm font-black text-white">{index + 1}</span>
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-white shadow-soft"><Icon size={34} /></div>
                  <h3 className="mt-5 font-black">{title}</h3>
                  <p className="mx-auto mt-2 max-w-48 text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader title="Why Choose RENTSPOT?" />
            <div className="grid gap-6 md:grid-cols-4">
              {[[ShieldCheck, 'Real-time Availability', 'Check real-time availability and book instantly.', 'text-primary'], [Lock, 'Secure Payment', '100% secure online payment with suitable options.', 'text-secondary'], [Sparkles, 'Easy Booking', 'Quick and easy booking in just a few steps.', 'text-primary'], [Medal, 'Trusted Fields', 'High quality fields and top rated by players.', 'text-gold']].map(([Icon, title, text, color]) => (
                <div key={title} className="rounded-lg bg-white p-7 text-center shadow-soft">
                  <Icon className={`mx-auto ${color}`} size={44} />
                  <h3 className="mt-5 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid gap-8 rounded-lg bg-primary/5 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10">
            <div>
              <h2 className="text-4xl font-black">Need Help?</h2>
              <div className="mt-4 h-1 w-9 rounded-full bg-secondary" />
              <p className="mt-6 max-w-sm font-semibold leading-7 text-muted">Contact us for support or reservation questions. We are here to help!</p>
              <div className="mt-8 grid gap-5 text-muted">
                <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-white"><Headphones size={19} /></span> +212 6 12 34 56 78</p>
                <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"><CreditCard size={19} /></span> {supportEmail}</p>
                <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-white"><MapPin size={19} /></span> Morocco</p>
              </div>
            </div>
            <form onSubmit={submitContact} className="grid gap-4 rounded-lg bg-white p-6 shadow-soft">
              {user && <p className="rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">Linked to your account: {user.email}</p>}
              {!user && <p className="rounded-lg bg-gold/10 p-3 text-sm font-semibold text-muted">You can send a message as a guest, or login to link it to your account.</p>}
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input" placeholder="Full Name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} required />
                <input className="input" placeholder="Email Address" type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} required />
              </div>
              {contactErrors.name && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.name[0]}</p>}
              {contactErrors.email && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.email[0]}</p>}
              <input className="input" placeholder="Subject" value={contact.subject} onChange={(event) => setContact({ ...contact, subject: event.target.value })} />
              <textarea className="input min-h-32" placeholder="Your Message" value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} required />
              {contactErrors.message && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.message[0]}</p>}
              {contactMessage && <p className={`rounded-lg p-3 text-sm font-semibold ${Object.keys(contactErrors).length > 0 ? 'bg-red-50 text-red-700' : 'bg-secondary/10 text-secondary'}`}>{contactMessage}</p>}
              <button disabled={contactLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary disabled:opacity-60">{contactLoading ? 'Sending...' : 'Send Message'} <Send size={17} /></button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
