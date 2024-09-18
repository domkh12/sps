import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authAction";

// initialize userToken from localStorage
// const userToken = localStorage.getItem('userToken')
//     ? localStorage.getItem('userToken')
//     : null

const initialState = {
  loading: false,
  userInfo: null,
  // userToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null
      // state.userToken = null
      state.error = null
      state.success = false
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false
      state.userInfo = action.payload
      console.table(action.payload)
      console.log("Hi")
      state.userToken = action.payload.userToken
    })
    builder.addCase(userLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
    })
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
