import { createSlice } from "@reduxjs/toolkit";

const companyTypeSlice = createSlice({
    name: "companyType",
    initialState: {
        companyTypeFilter: [],
        isOpenQuickEditCompanyType: false,
        uuidForQuickEditCompanyType: "",
        uuidForQuickEditCompanyTypeForDelete: "",
        isOpenQuickCreateCompanyType: false,
    },
    reducers: {
        setIsOpenQuickCreateCompanyType: (state, action) => {
            state.isOpenQuickCreateCompanyType = action.payload;
        },
        setUuidForQuickEditCompanyTypeForDelete: (state, action) => {
            state.uuidForQuickEditCompanyTypeForDelete = action.payload;
        },
        setUuidForQuickEditCompanyType: (state, action) => {
            state.uuidForQuickEditCompanyType = action.payload;
        },
        setIsOpenQuickEditCompanyType: (state, action) => {
            state.isOpenQuickEditCompanyType = action.payload;
        },
        setCompanyTypeFilter: (state, action) => {
            state.companyTypeFilter = action.payload;
        }
    },
});

export const { 
    setIsOpenQuickCreateCompanyType,
    setUuidForQuickEditCompanyTypeForDelete,
    setUuidForQuickEditCompanyType,
    setIsOpenQuickEditCompanyType,
    setCompanyTypeFilter 
} = companyTypeSlice.actions;

export default companyTypeSlice.reducer;
