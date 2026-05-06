import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import stadiumsReducer from '../features/stadiums/stadiumsSlice';
import reservationsReducer from '../features/reservations/reservationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stadiums: stadiumsReducer,
    reservations: reservationsReducer,
  },
});
