import { MapPin, Ruler, ShieldCheck, Star, Users } from 'lucide-react';

export default function StadiumInfo({ stadium }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-black text-slate-950">{stadium.name}</h1>
        <span className="rounded-md bg-secondary/10 px-2 py-1 text-xs font-bold text-secondary">Available</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-muted">
        <span><MapPin className="mr-1 inline text-primary" size={18} />{stadium.city}</span>
        <span><Users className="mr-1 inline text-primary" size={18} />{stadium.capacity || 'Flexible'} capacity</span>
        <span><Star className="mr-1 inline text-gold" size={18} fill="currentColor" />{Number(stadium.reviews_avg_rating || 0).toFixed(1)}</span>
      </div>
      <p className="mt-5 text-muted">{stadium.description}</p>
      <div className="mt-7 grid gap-3 text-sm md:grid-cols-2">
        <p className="flex items-center gap-3"><Users className="text-slate-500" size={17} /> Capacity <strong className="ml-auto text-slate-900">{stadium.capacity || 22} Players</strong></p>
        <p className="flex items-center gap-3"><Ruler className="text-slate-500" size={17} /> Field Type <strong className="ml-auto text-slate-900">Artificial Grass</strong></p>
        <p className="flex items-center gap-3"><ShieldCheck className="text-slate-500" size={17} /> Facilities <strong className="ml-auto text-slate-900">Parking, Showers</strong></p>
      </div>
    </div>
  );
}
