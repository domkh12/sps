import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roleNames: [],
  },
  reducers: {
    setRoleNames: (state, action) => {
      state.roleNames = action.payload;
    },
  },
});

export const { setRoleNames } = roleSlice.actions;
export const selectRoleNames = (state)=> state.role.roleNames

export default roleSlice.reducer;
