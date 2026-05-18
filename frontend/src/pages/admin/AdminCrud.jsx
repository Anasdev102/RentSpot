import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import AdminCrudFilters from '../../components/admin/crud/AdminCrudFilters';
import AdminCrudForm from '../../components/admin/crud/AdminCrudForm';
import AdminCrudTable from '../../components/admin/crud/AdminCrudTable';
import {
  crudColumns,
  crudFields,
  crudFilterFields,
  getEmptyForm,
  getResourceTitle,
  getSingularTitle,
} from '../../config/adminCrudConfig';

function serializeFilters(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined));
}

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

  const title = useMemo(() => getResourceTitle(resource), [resource]);
  const highlightedId = searchParams.get('highlight');
  const canCreate = ['sports', 'stadiums', 'users'].includes(resource);
  const resourceFields = crudFields[resource] || [];
  const resourceColumns = crudColumns[resource] || [];
  const resourceFilters = crudFilterFields[resource] || [];

  const load = (nextFilters = filters) => {
    setError(null);
    api.get(`/admin/${resource}`, { params: serializeFilters(nextFilters) })
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
      setMessage(`${getSingularTitle(title)} #${id} deleted.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Delete failed. This record may be linked to reservations or other data.');
    }
  };

  const startCreate = () => {
    setEditing(null);
    const emptyForm = getEmptyForm(resource);

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
    const nextForm = resourceFields.reduce((next, field) => ({ ...next, [field]: row[field] ?? '' }), {});

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
        crudFields.stadiums.forEach((field) => {
          formData.append(field, payload[field] ?? '');
        });
        formData.append('main_image_index', String(payload.main_image_index ?? 0));
        imageFiles.forEach((file) => formData.append('images[]', file));

        if (editing) {
          formData.append('_method', 'PUT');
          await api.post(`/admin/${resource}/${editing.id}`, formData);
          setMessage(`${getSingularTitle(title)} updated.`);
        } else {
          await api.post(`/admin/${resource}`, formData);
          setMessage(`${getSingularTitle(title)} created.`);
        }
      } else if (editing) {
        delete payload.images;
        delete payload.existing_images;
        delete payload.main_image_index;
        await api.put(`/admin/${resource}/${editing.id}`, payload);
        setMessage(`${getSingularTitle(title)} updated.`);
      } else {
        delete payload.images;
        delete payload.existing_images;
        delete payload.main_image_index;
        await api.post(`/admin/${resource}`, payload);
        setMessage(`${getSingularTitle(title)} created.`);
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

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-bold text-primary">Management</p>
          <h1 className="text-3xl font-black">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCreate && <button onClick={startCreate} className="btn-primary py-2"><Plus size={16} /> Add {getSingularTitle(title)}</button>}
        </div>
      </div>

      <AdminCrudFilters
        filters={filters}
        lookups={lookups}
        resourceFilters={resourceFilters}
        onChange={setFilters}
        onFilter={() => load(filters)}
        onClear={() => { setFilters({}); load({}); }}
      />

      {message && <p className="mt-4 rounded-lg bg-secondary/10 p-3 text-sm font-semibold text-secondary">{message}</p>}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      {(editing || Object.keys(form).length > 0) && (
        <AdminCrudForm
          fields={resourceFields}
          resource={resource}
          editing={editing}
          form={form}
          lookups={lookups}
          imagePreviews={imagePreviews}
          onFormChange={setForm}
          onSubmit={save}
          onCancel={() => { setEditing(null); setForm({}); }}
        />
      )}

      <AdminCrudTable
        columns={resourceColumns}
        rows={rows}
        highlightedId={highlightedId}
        onEdit={startEdit}
        onRemove={remove}
      />
    </>
  );
}
