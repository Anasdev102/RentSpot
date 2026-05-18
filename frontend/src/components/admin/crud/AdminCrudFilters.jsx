import { Search } from 'lucide-react';
import SmoothSelect from '../../SmoothSelect';

export default function AdminCrudFilters({ filters, lookups, resourceFilters, onChange, onFilter, onClear }) {
  return (
    <div className="card mt-6 grid gap-3 p-4 md:grid-cols-4">
      {resourceFilters.map((filter) => (
        filter.type === 'resource-select' ? (
          <SmoothSelect
            key={filter.name}
            value={filters[filter.name] ?? ''}
            onChange={(value) => onChange({ ...filters, [filter.name]: value })}
            placeholder={filter.label}
            options={[{ value: '', label: filter.label }, ...(lookups[filter.resource] || []).map((item) => ({ value: item.id, label: item.name }))]}
          />
        ) : filter.type === 'select' ? (
          <SmoothSelect
            key={filter.name}
            value={filters[filter.name] ?? ''}
            onChange={(value) => onChange({ ...filters, [filter.name]: value })}
            placeholder={filter.label}
            options={filter.options.map((option) => ({ value: option, label: option || filter.label }))}
          />
        ) : (
          <input
            key={filter.name}
            className="input"
            type={filter.type}
            placeholder={filter.label}
            value={filters[filter.name] ?? ''}
            onChange={(event) => onChange({ ...filters, [filter.name]: event.target.value })}
          />
        )
      ))}
      <div className="flex gap-2">
        <button onClick={onFilter} className="btn-primary py-2"><Search size={16} /> Filter</button>
        <button onClick={onClear} className="btn-outline py-2">Clear</button>
      </div>
    </div>
  );
}
