import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  // initial data
  initialState: {
    token: null,
  },

  // function
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;      
    },

    logOut: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToekn = (state) => state.auth.token;
