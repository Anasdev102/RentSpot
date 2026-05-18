import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StadiumFilters from '../components/stadiums/StadiumFilters';
import StadiumResults from '../components/stadiums/StadiumResults';
import StadiumsHero from '../components/stadiums/StadiumsHero';
import { demoSports } from '../data/demoData';
import { fetchCities, fetchSports, fetchStadiums } from '../features/stadiums/stadiumsSlice';

export default function Stadiums() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const { sports, cities, list, loading } = useSelector((state) => state.stadiums);
  const { token } = useSelector((state) => state.auth);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const sportOptions = sports?.length ? sports : demoSports;
  const cityOptions = cities?.length ? cities : [...new Set(list.map((stadium) => stadium.city).filter(Boolean))];
  const [filters, setFilters] = useState({
    sport_id: params.get('sport_id') || '',
    city: params.get('city') || '',
    max_price: '',
    sort: 'newest',
  });

  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);

  useEffect(() => {
    dispatch(fetchSports());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStadiums(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (!token) {
      setFavoriteIds([]);
      return;
    }

    api.get('/favorites')
      .then((response) => setFavoriteIds((response.data || []).map((stadium) => stadium.id)))
      .catch(() => setFavoriteIds([]));
  }, [token]);

  const updateFavorite = (stadiumId, isFavorite) => {
    setFavoriteIds((current) => (
      isFavorite
        ? [...new Set([...current, stadiumId])]
        : current.filter((id) => id !== stadiumId)
    ));
  };

  const updateFilters = (nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

  const clearFilters = () => {
    setFilters({ sport_id: '', city: '', max_price: '', sort: 'newest' });
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <StadiumsHero filters={filters} sportOptions={sportOptions} cityOptions={cityOptions} onFilterChange={updateFilters} />
        <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
          <StadiumFilters filters={filters} sportOptions={sportOptions} cityOptions={cityOptions} onFilterChange={updateFilters} onClear={clearFilters} />
          <StadiumResults
            stadiums={list}
            loading={loading}
            sort={filters.sort}
            favoriteIds={favoriteIds}
            onSortChange={(value) => updateFilters({ sort: value })}
            onFavoriteChange={updateFavorite}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
