import SmoothSelect from '../../SmoothSelect';
import { crudFieldOptions, optionalCrudFields } from '../../../config/adminCrudConfig';
import StadiumImagePicker from './StadiumImagePicker';

function getInputType(field) {
  if (field.includes('price') || field === 'capacity' || field === 'rating' || field.endsWith('_id')) return 'number';
  if (field === 'password') return 'password';
  return 'text';
}

function CrudField({ field, resource, editing, form, lookups, onFormChange }) {
  const isPasswordOptional = field === 'password' && editing;
  const required = !optionalCrudFields.includes(field) && !isPasswordOptional;
  const selectCommonProps = {
    key: field,
    value: form[field] ?? '',
    onChange: (value) => onFormChange({ ...form, [field]: value }),
    required,
  };

  if (field === 'role') {
    return (
      <SmoothSelect {...selectCommonProps} placeholder="Role" options={[{ value: '', label: 'Role' }, ...crudFieldOptions.role.map((option) => ({ value: option, label: option }))]} />
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
    const options = crudFieldOptions.status[resource] || [];
    return (
      <SmoothSelect {...selectCommonProps} placeholder="Status" options={[{ value: '', label: 'Status' }, ...options.map((option) => ({ value: option, label: option }))]} />
    );
  }

  if (field === 'is_active') {
    return (
      <SmoothSelect {...selectCommonProps} placeholder="Active status" options={[{ value: '', label: 'Active status' }, ...crudFieldOptions.is_active.map((option) => ({ value: option, label: option === 'true' ? 'active' : 'inactive' }))]} />
    );
  }

  return (
    <input
      key={field}
      className="input"
      value={form[field] ?? ''}
      onChange={(event) => onFormChange({ ...form, [field]: event.target.value })}
      required={required}
      type={getInputType(field)}
      placeholder={field.replaceAll('_', ' ')}
    />
  );
}

export default function AdminCrudForm({
  fields,
  resource,
  editing,
  form,
  lookups,
  imagePreviews,
  onFormChange,
  onSubmit,
  onCancel,
}) {
  const isStadium = resource === 'stadiums';

  return (
    <form onSubmit={onSubmit} className="card mt-6 grid gap-4 p-5 md:grid-cols-3">
      {fields.map((field) => (
        <CrudField
          key={field}
          field={field}
          resource={resource}
          editing={editing}
          form={form}
          lookups={lookups}
          onFormChange={onFormChange}
        />
      ))}
      {isStadium && (
        <StadiumImagePicker
          existingImages={form.existing_images || []}
          imagePreviews={imagePreviews}
          selectedMainIndex={Number(form.main_image_index ?? 0)}
          onImagesChange={(event) => {
            const files = Array.from(event.target.files || []);
            onFormChange({ ...form, images: files, main_image_index: 0 });
            event.target.value = '';
          }}
          onClear={() => onFormChange({ ...form, images: [], main_image_index: 0 })}
          onMainImageChange={(index) => onFormChange({ ...form, main_image_index: index })}
        />
      )}
      <div className="flex gap-2">
        <button className="btn-primary">{editing ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
