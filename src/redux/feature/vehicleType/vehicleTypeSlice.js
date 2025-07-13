import { createSlice } from "@reduxjs/toolkit";

const vehicleTypeSlice = createSlice({
    name: "vehicleType",
    initialState: {
        vehicleTypeFilter: [],
        isOpenQuickEditVehicleType: false,
        uuidForQuickEditVehicleType: "",
        uuidVehicleTypeForDelete: "",
        isOpenQuickCreateVehicleType: false,
    },
    reducers: {
        setUuidVehicleTypeForDelete: (state, action) => {
            state.uuidVehicleTypeForDelete = action.payload;
        },
        setIsOpenQuickCreateVehicleType: (state, action) => {
            state.isOpenQuickCreateVehicleType = action.payload;
        },        
        setUuidForQuickEditVehicleType: (state, action) => {
            state.uuidForQuickEditVehicleType = action.payload;
        },
        setIsOpenQuickEditVehicleType: (state, action) => {
            state.isOpenQuickEditVehicleType = action.payload;
        },
        setVehicleTypeFilter: (state, action) => {
            state.vehicleTypeFilter = action.payload;
        }
    },
});

export const {
    setUuidVehicleTypeForDelete,
    setIsOpenQuickCreateVehicleType,
    setUuidForQuickEditVehicleTypeForDelete,
    setUuidForQuickEditVehicleType,
    setIsOpenQuickEditVehicleType,
    setVehicleTypeFilter
} = vehicleTypeSlice.actions;

export default vehicleTypeSlice.reducer;
