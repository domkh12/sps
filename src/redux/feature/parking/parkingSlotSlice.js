import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchByUuid = createAsyncThunk
(
  "fetchByUuid/fetchByUuid",
  async (uuid) => 
    {
        const response = await fetch
        (
            `${import.meta.env.VITE_API_BASE_URL}/parking-slots/${uuid}`,
            {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (!response.ok) 
        {
            throw new Error("Fetch failed");
        }
        return response.json();
    }
);

const parkingSlotSlice = createSlice({

  name: "parkingSlot",

  initialState: {
    parkingSlot: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => 
    {
        builder
        .addCase(fetchByUuid.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchByUuid.fulfilled, (state, action) => {
            state.parkingSlot = action.payload;
            state.loading = false;
        })
        .addCase(fetchByUuid.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false;
        });
    },
});

// export const {  } =  parkingSlotSlice.actions;


export default parkingSlotSlice.reducer;
