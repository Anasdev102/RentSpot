import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function FavoriteButton({ stadiumId, initial = false, onChange, variant = 'icon' }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initial);
  }, [initial]);

  const toggle = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    onChange?.(stadiumId, nextValue);

    try {
      if (nextValue) {
        await api.post(`/favorites/${stadiumId}`);
      } else {
        await api.delete(`/favorites/${stadiumId}`);
      }
    } catch (error) {
      setIsFavorite(!nextValue);
      onChange?.(stadiumId, !nextValue);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'button') {
    return (
      <button type="button" onClick={toggle} disabled={loading} className={isFavorite ? 'btn-primary' : 'btn-outline'}>
        <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 ${isFavorite ? 'text-red-500' : 'text-primary hover:text-red-500'}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}
