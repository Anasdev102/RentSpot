import SmoothSelect from '../SmoothSelect';
import StadiumCard from '../StadiumCard';
import { useLanguage } from '../../i18n/LanguageContext';

export default function StadiumResults({ stadiums, loading, error, sort, favoriteIds, onSortChange, onFavoriteChange }) {
  const { t } = useLanguage();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">{stadiums.length} {t('stadiums.fieldsFound')}</p>
        <SmoothSelect
          className="max-w-[180px]"
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'newest', label: t('stadiums.sortNewest') },
            { value: 'price_asc', label: t('stadiums.priceAsc') },
            { value: 'price_desc', label: t('stadiums.priceDesc') },
            { value: 'rating_desc', label: t('stadiums.topRated') },
          ]}
        />
      </div>
      {loading && <p className="text-muted">{t('stadiums.loading')}</p>}
      {!loading && error && (
        <div className="card mb-5 p-6">
          <p className="text-sm font-black text-slate-950">{t('stadiums.unableTitle')}</p>
          <p className="mt-2 text-sm text-muted">{t('stadiums.unableText')}</p>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stadiums.map((stadium) => (
          <StadiumCard
            key={stadium.id}
            stadium={stadium}
            isFavorite={favoriteIds.includes(stadium.id)}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
      </div>
      {!loading && !error && stadiums.length === 0 && <p className="card p-6 text-muted">{t('stadiums.empty')}</p>}
    </section>
  );
}
