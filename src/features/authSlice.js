import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('cricmind_access_token') || null,
  isAuthenticated: !!localStorage.getItem('cricmind_access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.access;
      state.isAuthenticated = true;
      localStorage.setItem('cricmind_access_token', action.payload.access);
      localStorage.setItem('cricmind_refresh_token', action.payload.refresh);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cricmind_access_token');
      localStorage.removeItem('cricmind_refresh_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
