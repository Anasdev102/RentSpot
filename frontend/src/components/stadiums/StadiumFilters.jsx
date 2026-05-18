import { SlidersHorizontal } from 'lucide-react';
import SmoothSelect from '../SmoothSelect';
import { useLanguage } from '../../i18n/LanguageContext';

export default function StadiumFilters({ filters, sportOptions, cityOptions, onFilterChange, onClear }) {
  const { t } = useLanguage();

  return (
    <aside className="card h-fit p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black"><SlidersHorizontal size={16} /> {t('stadiums.filters')}</h2>
        <button className="text-xs font-bold text-primary" onClick={onClear}>{t('stadiums.clearAll')}</button>
      </div>
      <div className="mt-4 grid gap-3">
        <SmoothSelect
          value={filters.sport_id}
          onChange={(value) => onFilterChange({ sport_id: value })}
          placeholder={t('stadiums.allSports')}
          options={[{ value: '', label: t('stadiums.allSports') }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
        />
        <SmoothSelect
          value={filters.city}
          onChange={(value) => onFilterChange({ city: value })}
          placeholder={t('stadiums.allCities')}
          options={[{ value: '', label: t('stadiums.allCities') }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
        />
        <input className="input" type="number" placeholder={t('stadiums.maxPrice')} value={filters.max_price} onChange={(event) => onFilterChange({ max_price: event.target.value })} />
        <div className="grid gap-2 text-xs text-slate-700">
          <label className="flex items-center gap-2"><input type="checkbox" /> Football</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Basketball</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Tennis</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Padel</label>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" defaultChecked /> {t('stadiums.availableOnly')}</label>
      </div>
    </aside>
  );
}
