import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    finishLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { login, logout, finishLoading } = authSlice.actions;
export default authSlice.reducer;
