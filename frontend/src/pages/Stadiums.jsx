import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SmoothSelect from '../components/SmoothSelect';
import StadiumCard from '../components/StadiumCard';
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

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="relative mb-6 rounded-lg border border-slate-200 bg-slate-900 px-6 py-9 text-white">
          <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1800&q=85" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
          <div className="relative max-w-xl text-slate-950">
            <h1 className="text-3xl font-black leading-tight">Explore Sports <span className="block text-secondary">Fields</span></h1>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-600">Find and book the best sports fields near you</p>
          </div>
          <div className="relative mt-6 grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <SmoothSelect
              className="z-40"
              value={filters.sport_id}
              onChange={(value) => setFilters({ ...filters, sport_id: value })}
              placeholder="All sports"
              options={[{ value: '', label: 'All sports' }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
            />
            <SmoothSelect
              className="z-30"
              value={filters.city}
              onChange={(value) => setFilters({ ...filters, city: value })}
              placeholder="All cities"
              options={[{ value: '', label: 'All cities' }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
            />
            <input className="input border-0 bg-slate-50" type="date" />
            <input className="input border-0 bg-slate-50" type="number" placeholder="Price" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
            <button className="btn-primary px-7">Search</button>
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
          <aside className="card h-fit p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black"><SlidersHorizontal size={16} /> Filters</h2>
              <button className="text-xs font-bold text-primary" onClick={() => setFilters({ sport_id: '', city: '', max_price: '', sort: 'newest' })}>Clear all</button>
            </div>
            <div className="mt-4 grid gap-3">
              <SmoothSelect
                value={filters.sport_id}
                onChange={(value) => setFilters({ ...filters, sport_id: value })}
                placeholder="All sports"
                options={[{ value: '', label: 'All sports' }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
              />
              <SmoothSelect
                value={filters.city}
                onChange={(value) => setFilters({ ...filters, city: value })}
                placeholder="All cities"
                options={[{ value: '', label: 'All cities' }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
              />
              <input className="input" type="number" placeholder="Max price" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
              <div className="grid gap-2 text-xs text-slate-700">
                <label className="flex items-center gap-2"><input type="checkbox" /> Football</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Basketball</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Tennis</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Padel</label>
              </div>
              <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" defaultChecked /> Available only</label>
            </div>
          </aside>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">{list.length} Fields Found</p>
              <SmoothSelect
                className="max-w-[180px]"
                value={filters.sort}
                onChange={(value) => setFilters({ ...filters, sort: value })}
                options={[
                  { value: 'newest', label: 'Sort By: Newest' },
                  { value: 'price_asc', label: 'Price low to high' },
                  { value: 'price_desc', label: 'Price high to low' },
                  { value: 'rating_desc', label: 'Top rated' },
                ]}
              />
            </div>
            {loading && <p className="text-muted">Loading stadiums...</p>}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.map((stadium) => (
                <StadiumCard
                  key={stadium.id}
                  stadium={stadium}
                  isFavorite={favoriteIds.includes(stadium.id)}
                  onFavoriteChange={updateFavorite}
                />
              ))}
            </div>
            {!loading && list.length === 0 && <p className="card p-6 text-muted">No stadiums match these filters.</p>}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
