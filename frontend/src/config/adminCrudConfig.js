export const crudColumns = {
  sports: ['name', 'icon'],
  stadiums: ['name', 'city', 'price_per_hour', 'is_active'],
  reservations: ['date', 'start_time', 'end_time', 'status'],
  payments: ['amount', 'status', 'transaction_id'],
  users: ['name', 'email', 'role'],
  reviews: ['rating', 'comment'],
};

export const crudFields = {
  sports: ['name', 'icon'],
  stadiums: ['sport_id', 'name', 'description', 'city', 'address', 'price_per_hour', 'capacity', 'is_active'],
  reservations: ['status'],
  payments: ['status', 'transaction_id'],
  users: ['name', 'email', 'password', 'phone', 'role'],
  reviews: ['rating', 'comment'],
};

export const crudFieldOptions = {
  role: ['user', 'admin'],
  status: {
    reservations: ['pending', 'confirmed', 'cancelled', 'completed'],
    payments: ['unpaid', 'paid', 'failed', 'refunded'],
  },
  is_active: ['true', 'false'],
};

export const crudFilterFields = {
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

export const optionalCrudFields = ['icon', 'description', 'address', 'capacity', 'phone', 'transaction_id', 'comment'];

export function getResourceTitle(resource) {
  return resource.charAt(0).toUpperCase() + resource.slice(1);
}

export function getSingularTitle(title) {
  return title.slice(0, -1) || title;
}

export function getEmptyForm(resource) {
  return crudFields[resource].reduce((next, field) => ({ ...next, [field]: '' }), {});
}
