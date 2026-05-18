import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSports = createAsyncThunk('stadiums/fetchSports', async () => {
  const { data } = await api.get('/sports');
  return data;
});

export const fetchCities = createAsyncThunk('stadiums/fetchCities', async () => {
  const { data } = await api.get('/stadium-cities');
  return data;
});

export const fetchStadiums = createAsyncThunk('stadiums/fetchStadiums', async (params = {}) => {
  const { data } = await api.get('/stadiums', { params });
  return data;
});

export const fetchStadium = createAsyncThunk('stadiums/fetchStadium', async (id) => {
  const { data } = await api.get(`/stadiums/${id}`);
  return data;
});

const stadiumsSlice = createSlice({
  name: 'stadiums',
  initialState: {
    sports: [],
    cities: [],
    list: [],
    pagination: null,
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSports.fulfilled, (state, action) => {
        const sports = action.payload?.data || action.payload;
        state.sports = Array.isArray(sports) ? sports : [];
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        const cities = action.payload?.data || action.payload;
        state.cities = Array.isArray(cities) ? cities : [];
      })
      .addCase(fetchStadiums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStadiums.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload.data || action.payload || [];
        state.pagination = action.payload.meta || null;
      })
      .addCase(fetchStadium.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(fetchStadium.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selected = action.payload;
      })
      .addCase(fetchStadium.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.selected = state.list.find((stadium) => String(stadium.id) === String(action.meta.arg)) || null;
      })
      .addMatcher((action) => action.type.startsWith('stadiums/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default stadiumsSlice.reducer;
