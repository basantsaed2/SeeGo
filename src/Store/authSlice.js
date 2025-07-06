// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

let storedUser = null;
const userString = localStorage.getItem("user");

if (userString && userString !== "undefined") {
  try {
    storedUser = JSON.parse(userString);
  } catch (error) {
    console.error("Failed to parse user JSON:", error);
  }
}

const initialState = {
  user: storedUser || null,
  roles: storedUser?.roles || {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
