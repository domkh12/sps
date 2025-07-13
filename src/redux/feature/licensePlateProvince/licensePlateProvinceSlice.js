import { createSlice } from "@reduxjs/toolkit";

const licensePlateProvinceSlice = createSlice({
    name: "licensePlateProvince",
    initialState: {
        licensePlateProvinceFilter: [],
        isOpenQuickEditLicensePlateProvince: false,
        uuidForQuickEditLicensePlateProvince: "",
        uuidLicensePlateProvinceForDelete: "",
        isOpenQuickCreateLicensePlateProvince: false,
    },
    reducers: {
        setUuidLicensePlateProvinceForDelete: (state, action) => {
            state.uuidLicensePlateProvinceForDelete = action.payload;
        },
        setIsOpenQuickCreateLicensePlateProvince: (state, action) => {
            state.isOpenQuickCreateLicensePlateProvince = action.payload;
        },        
        setUuidForQuickEditLicensePlateProvince: (state, action) => {
            state.uuidForQuickEditLicensePlateProvince = action.payload;
        },
        setIsOpenQuickEditLicensePlateProvince: (state, action) => {
            state.isOpenQuickEditLicensePlateProvince = action.payload;
        },
        setLicensePlateProvinceFilter: (state, action) => {
            state.licensePlateProvinceFilter = action.payload;
        }
    },
});

export const {
    setUuidLicensePlateProvinceForDelete,
    setIsOpenQuickCreateLicensePlateProvince,
    setUuidForQuickEditLicensePlateProvinceForDelete,
    setUuidForQuickEditLicensePlateProvince,
    setIsOpenQuickEditLicensePlateProvince,
    setLicensePlateProvinceFilter
} = licensePlateProvinceSlice.actions;

export default licensePlateProvinceSlice.reducer;
