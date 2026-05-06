import { Images, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

export default function StadiumCard({ stadium, isFavorite = false, onFavoriteChange }) {
  const image = stadium.images?.find((item) => item.is_main)?.image_path || stadium.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80';
  const imageCount = stadium.images?.length || 0;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-36 overflow-hidden">
        <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={image} alt={stadium.name} />
        <span className="absolute right-3 top-3 rounded-md bg-secondary px-2.5 py-1 text-[10px] font-bold text-white">Available</span>
        <FavoriteButton stadiumId={stadium.id} initial={isFavorite} onChange={onFavoriteChange} />
        {imageCount > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-black text-white">
            <Images size={12} /> {imageCount}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-950">{stadium.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted"><MapPin size={13} /> {stadium.city}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gold">
            <Star size={15} fill="currentColor" /> {Number(stadium.reviews_avg_rating || 0).toFixed(1)}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-black text-slate-950">${Number(stadium.price_per_hour).toFixed(0)}<span className="text-xs font-semibold text-muted"> / hour</span></p>
          <Link to={`/stadiums/${stadium.id}`} className="rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-white">Details</Link>
        </div>
      </div>
    </article>
  );
}
