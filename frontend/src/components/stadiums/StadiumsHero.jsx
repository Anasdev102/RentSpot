import SmoothSelect from '../SmoothSelect';
import { useLanguage } from '../../i18n/LanguageContext';

export default function StadiumsHero({ filters, sportOptions, cityOptions, onFilterChange }) {
  const { t } = useLanguage();

  return (
    <section className="relative mb-6 rounded-lg border border-slate-200 bg-slate-900 px-6 py-9 text-white">
      <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1800&q=85" alt="" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
      <div className="relative max-w-xl text-slate-950">
        <h1 className="text-3xl font-black leading-tight">{t('stadiums.explore')} <span className="block text-secondary">{t('stadiums.fields')}</span></h1>
        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-600">{t('stadiums.subtitle')}</p>
      </div>
      <div className="relative mt-6 grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <SmoothSelect
          className="z-40"
          value={filters.sport_id}
          onChange={(value) => onFilterChange({ sport_id: value })}
          placeholder={t('stadiums.allSports')}
          options={[{ value: '', label: t('stadiums.allSports') }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
        />
        <SmoothSelect
          className="z-30"
          value={filters.city}
          onChange={(value) => onFilterChange({ city: value })}
          placeholder={t('stadiums.allCities')}
          options={[{ value: '', label: t('stadiums.allCities') }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
        />
        <input className="input border-0 bg-slate-50" type="date" />
        <input className="input border-0 bg-slate-50" type="number" placeholder={t('stadiums.price')} value={filters.max_price} onChange={(event) => onFilterChange({ max_price: event.target.value })} />
        <button className="btn-primary px-7">{t('stadiums.search')}</button>
      </div>
    </section>
  );
}
