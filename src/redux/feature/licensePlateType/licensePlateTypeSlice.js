import { createSlice } from "@reduxjs/toolkit";

const licensePlateTypeSlice = createSlice({
    name: "licensePlateType",
    initialState: {
        licensePlateTypeFilter: [],
        isOpenQuickEditLicensePlateType: false,
        uuidForQuickEditLicensePlateType: "",
        uuidLicensePlateTypeForDelete: "",
        isOpenQuickCreateLicensePlateType: false,
    },
    reducers: {
        setUuidLicensePlateTypeForDelete: (state, action) => {
            state.uuidLicensePlateTypeForDelete = action.payload;
        },
        setIsOpenQuickCreateLicensePlateType: (state, action) => {
            state.isOpenQuickCreateLicensePlateType = action.payload;
        },        
        setUuidForQuickEditLicensePlateType: (state, action) => {
            state.uuidForQuickEditLicensePlateType = action.payload;
        },
        setIsOpenQuickEditLicensePlateType: (state, action) => {
            state.isOpenQuickEditLicensePlateType = action.payload;
        },
        setLicensePlateTypeFilter: (state, action) => {
            state.licensePlateTypeFilter = action.payload;
        }
    },
});

export const {
    setUuidLicensePlateTypeForDelete,
    setIsOpenQuickCreateLicensePlateType,
    setUuidForQuickEditLicensePlateTypeForDelete,
    setUuidForQuickEditLicensePlateType,
    setIsOpenQuickEditLicensePlateType,
    setLicensePlateTypeFilter
} = licensePlateTypeSlice.actions;

export default licensePlateTypeSlice.reducer;
