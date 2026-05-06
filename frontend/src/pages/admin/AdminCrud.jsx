import { Image, Pencil, Plus, Search, Trash2, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import SmoothSelect from '../../components/SmoothSelect';
import StatusBadge from '../../components/StatusBadge';

const columns = {
  sports: ['id', 'name', 'icon'],
  stadiums: ['id', 'name', 'city', 'price_per_hour', 'is_active'],
  reservations: ['id', 'date', 'start_time', 'end_time', 'status'],
  payments: ['id', 'amount', 'status', 'transaction_id'],
  users: ['id', 'name', 'email', 'role'],
  reviews: ['id', 'rating', 'comment'],
};

const fields = {
  sports: ['name', 'icon'],
  stadiums: ['sport_id', 'name', 'description', 'city', 'address', 'price_per_hour', 'capacity', 'is_active'],
  reservations: ['status'],
  payments: ['status', 'transaction_id'],
  users: ['name', 'email', 'password', 'phone', 'role'],
  reviews: ['rating', 'comment'],
};

const fieldOptions = {
  role: ['user', 'admin'],
  status: {
    reservations: ['pending', 'confirmed', 'cancelled', 'completed'],
    payments: ['unpaid', 'paid', 'failed', 'refunded'],
  },
  is_active: ['true', 'false'],
};

const filterFields = {
  sports: [{ name: 'search', label: 'Search sport', type: 'text' }],
  stadiums: [
    { name: 'search', label: 'Search stadium', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'sport_id', label: 'Sport', type: 'resource-select', resource: 'sports' },
  ],
  reservations: [
    { name: 'search', label: 'User or stadium', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['', 'pending', 'confirmed', 'cancelled', 'completed'] },
    { name: 'date', label: 'Date', type: 'date' },
  ],
  payments: [
    { name: 'search', label: 'User, stadium, transaction', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['', 'unpaid', 'paid', 'failed', 'refunded'] },
  ],
  users: [
    { name: 'search', label: 'Search user', type: 'text' },
    { name: 'role', label: 'Role', type: 'select', options: ['', 'user', 'admin'] },
  ],
  reviews: [
    { name: 'search', label: 'Comment, user, stadium', type: 'text' },
    { name: 'rating', label: 'Rating', type: 'select', options: ['', '1', '2', '3', '4', '5'] },
    { name: 'stadium_id', label: 'Stadium', type: 'resource-select', resource: 'stadiums' },
  ],
};

export default function AdminCrud({ resource }) {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [lookups, setLookups] = useState({ sports: [], stadiums: [] });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchParams] = useSearchParams();
  const title = useMemo(() => resource.charAt(0).toUpperCase() + resource.slice(1), [resource]);
  const highlightedId = searchParams.get('highlight');

  const load = (nextFilters = filters) => {
    setError(null);
    const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== undefined));
    api.get(`/admin/${resource}`, { params })
      .then((response) => setRows(response.data.data || response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load data.'));
  };

  useEffect(() => {
    setFilters({});
    setMessage(null);
    setError(null);
    load({});
  }, [resource]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/sports'),
      api.get('/admin/stadiums'),
    ])
      .then(([sportsResponse, stadiumsResponse]) => {
        setLookups({
          sports: sportsResponse.data.data || sportsResponse.data,
          stadiums: stadiumsResponse.data.data || stadiumsResponse.data,
        });
      })
      .catch(() => {
        setLookups({ sports: [], stadiums: [] });
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      load(filters);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, resource]);

  useEffect(() => {
    const files = Array.isArray(form.images) ? form.images : [];
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews(previews);

    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [form.images]);

  const remove = async (id) => {
    if (!confirm(`Delete ${resource} #${id}?`)) return;
    setMessage(null);
    setError(null);

    try {
      await api.delete(`/admin/${resource}/${id}`);
      setRows((current) => current.filter((row) => row.id !== id));
      setMessage(`${title.slice(0, -1) || title} #${id} deleted.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Delete failed. This record may be linked to reservations or other data.');
    }
  };

  const startCreate = () => {
    setEditing(null);
    const emptyForm = fields[resource].reduce((next, field) => ({ ...next, [field]: '' }), {});

    if (resource === 'stadiums') {
      setForm({ ...emptyForm, is_active: true, images: [], existing_images: [], main_image_index: 0 });
      return;
    }

    if (resource === 'users') {
      setForm({ ...emptyForm, role: 'user' });
      return;
    }

    setForm(emptyForm);
  };

  const startEdit = (row) => {
    setEditing(row);
    const nextForm = fields[resource].reduce((next, field) => ({ ...next, [field]: row[field] ?? '' }), {});

    if (resource === 'stadiums') {
      setForm({
        ...nextForm,
        images: [],
        existing_images: row.images || [],
        main_image_index: 0,
      });
      return;
    }

    setForm(nextForm);
  };

  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form };
    setMessage(null);
    setError(null);

    if (resource === 'stadiums') {
      payload.is_active = payload.is_active === true || payload.is_active === 'true';
    }

    if (resource === 'users' && editing && !payload.password) {
      delete payload.password;
    }

    try {
      const imageFiles = resource === 'stadiums' && Array.isArray(form.images) ? form.images : [];

      if (resource === 'stadiums' && imageFiles.length > 0) {
        const formData = new FormData();
        fields.stadiums.forEach((field) => {
          formData.append(field, payload[field] ?? '');
        });
        formData.append('main_image_index', String(payload.main_image_index ?? 0));
        imageFiles.forEach((file) => formData.append('images[]', file));

        if (editing) {
          formData.append('_method', 'PUT');
          await api.post(`/admin/${resource}/${editing.id}`, formData);
          setMessage(`${title.slice(0, -1) || title} updated.`);
        } else {
          await api.post(`/admin/${resource}`, formData);
          setMessage(`${title.slice(0, -1) || title} created.`);
        }
      } else if (editing) {
        delete payload.images;
        delete payload.existing_images;
        delete payload.main_image_index;
        await api.put(`/admin/${resource}/${editing.id}`, payload);
        setMessage(`${title.slice(0, -1) || title} updated.`);
      } else {
        delete payload.images;
        delete payload.existing_images;
        delete payload.main_image_index;
        await api.post(`/admin/${resource}`, payload);
        setMessage(`${title.slice(0, -1) || title} created.`);
      }

      setForm({});
      setEditing(null);
      load();
    } catch (requestError) {
      const errors = requestError.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      setError(firstError || requestError.response?.data?.message || 'Save failed.');
    }
  };

  const canCreate = ['sports', 'stadiums', 'users'].includes(resource);
  const resourceFilters = filterFields[resource] || [];
  const renderField = (field) => {
    const isPasswordOptional = field === 'password' && editing;
    const commonProps = {
      className: 'input',
      value: form[field] ?? '',
      onChange: (e) => setForm({ ...form, [field]: e.target.value }),
      required: !['icon', 'description', 'address', 'capacity', 'phone', 'transaction_id', 'comment'].includes(field) && !isPasswordOptional,
    };
    const selectCommonProps = {
      key: field,
      value: form[field] ?? '',
      onChange: (value) => setForm({ ...form, [field]: value }),
      required: commonProps.required,
    };

    if (field === 'role') {
      return (
        <SmoothSelect {...selectCommonProps} placeholder="Role" options={[{ value: '', label: 'Role' }, ...fieldOptions.role.map((option) => ({ value: option, label: option }))]} />
      );
    }

    if (field === 'sport_id') {
      return (
        <SmoothSelect {...selectCommonProps} placeholder="Sport" options={[{ value: '', label: 'Sport' }, ...lookups.sports.map((sport) => ({ value: sport.id, label: sport.name }))]} />
      );
    }

    if (field === 'stadium_id') {
      return (
        <SmoothSelect {...selectCommonProps} placeholder="Stadium" options={[{ value: '', label: 'Stadium' }, ...lookups.stadiums.map((stadium) => ({ value: stadium.id, label: stadium.name }))]} />
      );
    }

    if (field === 'status') {
      const options = fieldOptions.status[resource] || [];
      return (
        <SmoothSelect {...selectCommonProps} placeholder="Status" options={[{ value: '', label: 'Status' }, ...options.map((option) => ({ value: option, label: option }))]} />
      );
    }

    if (field === 'is_active') {
      return (
        <SmoothSelect {...selectCommonProps} placeholder="Active status" options={[{ value: '', label: 'Active status' }, ...fieldOptions.is_active.map((option) => ({ value: option, label: option === 'true' ? 'active' : 'inactive' }))]} />
      );
    }

    return (
      <input
        key={field}
        {...commonProps}
        type={field.includes('price') || field === 'capacity' || field === 'rating' || field.endsWith('_id') ? 'number' : field === 'password' ? 'password' : 'text'}
        placeholder={field.replaceAll('_', ' ')}
      />
    );
  };

  const handleStadiumImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setForm({ ...form, images: files, main_image_index: 0 });
    event.target.value = '';
  };

  const renderStadiumImages = () => {
    if (resource !== 'stadiums') {
      return null;
    }

    const existingImages = form.existing_images || [];
    const selectedMainIndex = Number(form.main_image_index ?? 0);

    return (
      <div className="md:col-span-3">
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center transition hover:border-primary hover:bg-primary/5">
          <UploadCloud className="mb-2 text-primary" size={28} />
          <span className="text-sm font-black text-slate-900">Upload stadium images</span>
          <span className="mt-1 text-xs font-semibold text-slate-500">JPG, PNG or WEBP. Max 5MB per image.</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleStadiumImageChange}
          />
        </label>

        {existingImages.length > 0 && imagePreviews.length === 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Current gallery</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {existingImages.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={item.image_path} alt="" className="h-28 w-full object-cover" />
                  <div className="flex items-center justify-between p-3 text-xs font-bold text-slate-600">
                    <span>{item.is_main ? 'Main image' : 'Gallery image'}</span>
                    <Image size={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">New gallery</p>
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [], main_image_index: 0 })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <X size={13} /> Clear
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <button
                  key={`${preview.name}-${index}`}
                  type="button"
                  onClick={() => setForm({ ...form, main_image_index: index })}
                  className={`overflow-hidden rounded-2xl border bg-white text-left transition ${selectedMainIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                >
                  <img src={preview.url} alt="" className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="truncate text-xs font-black text-slate-900">{preview.name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{selectedMainIndex === index ? 'Main image' : 'Click to make main'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-bold text-primary">Management</p>
          <h1 className="text-3xl font-black">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCreate && <button onClick={startCreate} className="btn-primary py-2"><Plus size={16} /> Add {title.slice(0, -1) || title}</button>}
        </div>
      </div>
      <div className="card mt-6 grid gap-3 p-4 md:grid-cols-4">
        {resourceFilters.map((filter) => (
          filter.type === 'resource-select' ? (
            <SmoothSelect
              key={filter.name}
              value={filters[filter.name] ?? ''}
              onChange={(value) => setFilters({ ...filters, [filter.name]: value })}
              placeholder={filter.label}
              options={[{ value: '', label: filter.label }, ...(lookups[filter.resource] || []).map((item) => ({ value: item.id, label: item.name }))]}
            />
          ) : filter.type === 'select' ? (
            <SmoothSelect
              key={filter.name}
              value={filters[filter.name] ?? ''}
              onChange={(value) => setFilters({ ...filters, [filter.name]: value })}
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
              onChange={(event) => setFilters({ ...filters, [filter.name]: event.target.value })}
            />
          )
        ))}
        <div className="flex gap-2">
          <button onClick={() => load(filters)} className="btn-primary py-2"><Search size={16} /> Filter</button>
          <button onClick={() => { setFilters({}); load({}); }} className="btn-outline py-2">Clear</button>
        </div>
      </div>
      {message && <p className="mt-4 rounded-lg bg-secondary/10 p-3 text-sm font-semibold text-secondary">{message}</p>}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {(editing || Object.keys(form).length > 0) && (
        <form onSubmit={save} className="card mt-6 grid gap-4 p-5 md:grid-cols-3">
          {fields[resource].map((field) => renderField(field))}
          {renderStadiumImages()}
          <div className="flex gap-2">
            <button className="btn-primary">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setEditing(null); setForm({}); }} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}
      <section className="card mt-6 overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>{columns[resource].map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={String(row.id) === highlightedId ? 'bg-primary/10 ring-1 ring-inset ring-primary/20' : ''}>
                {columns[resource].map((column) => (
                  <td key={column}>
                    {['status', 'role'].includes(column) ? <StatusBadge status={String(row[column])} /> : String(row[column] ?? '')}
                  </td>
                ))}
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(row)} className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary" aria-label="Edit"><Pencil size={15} /></button>
                    <button onClick={() => remove(row.id)} className="grid h-8 w-8 place-items-center rounded-md bg-red-50 text-red-700" aria-label="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
