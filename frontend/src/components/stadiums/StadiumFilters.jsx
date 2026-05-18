import { SlidersHorizontal } from 'lucide-react';
import SmoothSelect from '../SmoothSelect';

export default function StadiumFilters({ filters, sportOptions, cityOptions, onFilterChange, onClear }) {
  return (
    <aside className="card h-fit p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black"><SlidersHorizontal size={16} /> Filters</h2>
        <button className="text-xs font-bold text-primary" onClick={onClear}>Clear all</button>
      </div>
      <div className="mt-4 grid gap-3">
        <SmoothSelect
          value={filters.sport_id}
          onChange={(value) => onFilterChange({ sport_id: value })}
          placeholder="All sports"
          options={[{ value: '', label: 'All sports' }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
        />
        <SmoothSelect
          value={filters.city}
          onChange={(value) => onFilterChange({ city: value })}
          placeholder="All cities"
          options={[{ value: '', label: 'All cities' }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
        />
        <input className="input" type="number" placeholder="Max price" value={filters.max_price} onChange={(event) => onFilterChange({ max_price: event.target.value })} />
        <div className="grid gap-2 text-xs text-slate-700">
          <label className="flex items-center gap-2"><input type="checkbox" /> Football</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Basketball</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Tennis</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Padel</label>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" defaultChecked /> Available only</label>
      </div>
    </aside>
  );
}
