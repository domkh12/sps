import { createSlice } from "@reduxjs/toolkit";

const genderSlice = createSlice({
    name: "gender",
    initialState: {
        genderFilter: [],
        isOpenQuickEditGender: false,
        uuidForQuickEditGender: "",
        uuidGenderForDelete: "",
        isOpenQuickCreateGender: false,
    },
    reducers: {
        setUuidGenderForDelete: (state, action) => {
            state.uuidGenderForDelete = action.payload;
        },
        setIsOpenQuickCreateGender: (state, action) => {
            state.isOpenQuickCreateGender = action.payload;
        },        
        setUuidForQuickEditGender: (state, action) => {
            state.uuidForQuickEditGender = action.payload;
        },
        setIsOpenQuickEditGender: (state, action) => {
            state.isOpenQuickEditGender = action.payload;
        },
        setGenderFilter: (state, action) => {
            state.genderFilter = action.payload;
        }
    },
});

export const {
    setUuidGenderForDelete,
    setIsOpenQuickCreateGender,
    setUuidForQuickEditGenderForDelete,
    setUuidForQuickEditGender,
    setIsOpenQuickEditGender,
    setGenderFilter
} = genderSlice.actions;

export default genderSlice.reducer;
