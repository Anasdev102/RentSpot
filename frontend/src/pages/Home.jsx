import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  ContactSection,
  FeaturedStadiumsSection,
  HeroSection,
  HowItWorksSection,
  PopularSportsSection,
  WhyChooseSection,
} from '../components/home/HomeSections';
import api from '../api/axios';
import { fetchCities, fetchSports, fetchStadiums } from '../features/stadiums/stadiumsSlice';

const supportEmail = 'elidrissianas210@gmail.com';

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
        <HeroSection
          sportOptions={sportOptions}
          cityOptions={cityOptions}
          heroSportId={heroSportId}
          heroCity={heroCity}
          onSportChange={setHeroSportId}
          onCityChange={setHeroCity}
          onSubmit={submit}
        />
        <PopularSportsSection />
        <FeaturedStadiumsSection stadiums={list} favoriteIds={favoriteIds} onFavoriteChange={updateFavorite} />
        <HowItWorksSection />
        <WhyChooseSection />
        <ContactSection
          user={user}
          contact={contact}
          contactErrors={contactErrors}
          contactMessage={contactMessage}
          contactLoading={contactLoading}
          supportEmail={supportEmail}
          onContactChange={setContact}
          onSubmit={submitContact}
        />
      </main>
      <Footer />
    </>
  );
}
