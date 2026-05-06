import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchReservations = createAsyncThunk('reservations/fetch', async () => {
  const { data } = await api.get('/reservations');
  return data;
});

export const createReservation = createAsyncThunk('reservations/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/reservations', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Reservation failed' });
  }
});

export const payReservation = createAsyncThunk('reservations/pay', async (reservationId) => {
  const { data } = await api.post(`/reservations/${reservationId}/pay`);
  return data;
});

export const cancelReservation = createAsyncThunk('reservations/cancel', async (reservationId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/reservations/${reservationId}/cancel`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Cancel failed' });
  }
});

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(payReservation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((reservation) => (
          reservation.id === action.payload.id ? action.payload : reservation
        ));
      })
      .addMatcher((action) => action.type.startsWith('reservations/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('reservations/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default reservationsSlice.reducer;
