import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: usersAdapter.setAll, 
  },
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;
