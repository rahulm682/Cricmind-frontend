import { configureStore } from '@reduxjs/toolkit';
import { cricketApi } from './services/cricketApi';
import authReducer from './features/authSlice';


export const store = configureStore({
  reducer: {
    [cricketApi.reducerPath]: cricketApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cricketApi.middleware),
});
