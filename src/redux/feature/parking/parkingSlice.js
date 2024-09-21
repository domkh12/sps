import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const deleteParkingByUuid = createAsyncThunk(
  "parking/deleteParkingByUuid",
  async (uuid) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/parking/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete parking entry');
    }
    return uuid;
  }
);

export const fetchParkingData = createAsyncThunk(
  "parking/fetchParkingData",
  async ({ pageNo, pageSize }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/parking?pageNo=${pageNo}&pageSize=${pageSize}`,{
      headers: {
        'Authorization': `Bearer ${token}`,        
        'Content-Type': 'application/json'
      }      
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch parking data');
    }
    return response.json()
  }
);

const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    setOpenModal: false,
    parkingData: [],
    pagination: {
      size: 0,
      number: 0,
      totalElements: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    onCloseModal(state) {
      state.setOpenModal = false;
    },
    onOpenModal(state) {
      state.setOpenModal = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParkingData.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingData = action.payload.content;
        state.pagination = action.payload.page;
      })
      .addCase(fetchParkingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteParkingByUuid.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteParkingByUuid.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingData = state.parkingData.filter(entry => entry.uuid !== action.payload);
      })
      .addCase(deleteParkingByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export  const { onCloseModal, onOpenModal } = parkingSlice.actions;


export default parkingSlice.reducer;
