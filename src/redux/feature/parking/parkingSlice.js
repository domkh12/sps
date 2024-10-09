import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchParkingByUuid = createAsyncThunk(
  "parking/fetchParkingByUuid",
  async (uuid) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/parking/${uuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch parking data by UUID");
    }
    const data = await response.json();    
    return data.parkingSlots;
  }
);

export const createParking = createAsyncThunk(
  "parking/createParking",
  async ({ parkingName, slotQty, latitude, longitude }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/parking`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parkingName,
          slotQty,
          latitude,
          longitude,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create parking entry");
    }
    return response.json();
  }
);

export const searchParking = createAsyncThunk(
  "parking/searchParking",
  async ({ name, pageNo, pageSize }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/parking/${name}?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search parking data");
    }
    return response.json();
  }
);

export const deleteParkingByUuid = createAsyncThunk(
  "parking/deleteParkingByUuid",
  async (uuid) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/parking/${uuid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete parking entry");
    }
    return uuid;
  }
);

export const fetchParkingData = createAsyncThunk(
  "parking/fetchParkingData",
  async ({ pageNo, pageSize }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/parking?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch parking data");
    }
    return response.json();
  }
);

const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    setOpenModal: false,
    parkingData: [],
    parkingSlots: [],
    pagination: {
      size: 0,
      number: 0,
      totalElements: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
    parkingUuid: null,

  },
  reducers: {
    
    onCloseModal(state) {
      state.setOpenModal = false;
    },
    onOpenModal(state) {
      state.setOpenModal = true;
    },    
    updateParkingSlot(state, action) {
      const updatedSlot = action.payload;
      state.parkingSlots = state.parkingSlots.map(slot =>
        slot.uuid === updatedSlot.uuid ? { ...slot, isAvailable: updatedSlot.isAvailable } : slot
      );
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
        state.parkingData = state.parkingData.filter(
          (entry) => entry.uuid !== action.payload
        );
      })
      .addCase(deleteParkingByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchParking.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchParking.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingData = action.payload.content;
        state.pagination = action.payload.page;
      })
      .addCase(searchParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createParking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createParking.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingData.push(action.payload);
      })
      .addCase(createParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchParkingByUuid.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParkingByUuid.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingSlots = action.payload;
      })
      .addCase(fetchParkingByUuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { onCloseModal, onOpenModal, backPagination, nextPagination, updateParkingSlot } = parkingSlice.actions;


export default parkingSlice.reducer;
