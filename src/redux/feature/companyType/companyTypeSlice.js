import { createSlice } from "@reduxjs/toolkit";

const companyTypeSlice = createSlice({
    name: "companyType",
    initialState: {
        companyTypeFilter: [],
    },
    reducers: {
        setCompanyTypeFilter: (state, action) => {
            state.companyTypeFilter = action.payload;
        }
    },
});

export const { setCompanyTypeFilter } = companyTypeSlice.actions;

export default companyTypeSlice.reducer;
