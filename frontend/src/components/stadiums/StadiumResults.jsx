import SmoothSelect from '../SmoothSelect';
import StadiumCard from '../StadiumCard';

export default function StadiumResults({ stadiums, loading, sort, favoriteIds, onSortChange, onFavoriteChange }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">{stadiums.length} Fields Found</p>
        <SmoothSelect
          className="max-w-[180px]"
          value={sort}
          onChange={onSortChange}
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
        {stadiums.map((stadium) => (
          <StadiumCard
            key={stadium.id}
            stadium={stadium}
            isFavorite={favoriteIds.includes(stadium.id)}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
      </div>
      {!loading && stadiums.length === 0 && <p className="card p-6 text-muted">No stadiums match these filters.</p>}
    </section>
  );
}
