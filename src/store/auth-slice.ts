import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './auth-api';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
}

const initialState: AuthState = { isAuthenticated: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<{ username: string }>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
