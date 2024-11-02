import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();
const userSlice = createSlice({
  name: "users",
  initialState: {
    uuid: "",
    status: "",
  },
  reducers: {
    setUuid: (state, action) => {      
      state.uuid = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setUuid, setStatus } = userSlice.actions;

export default userSlice.reducer;
