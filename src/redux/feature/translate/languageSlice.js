import { createSlice } from "@reduxjs/toolkit";
import translations from "../../../data/translation.json";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: "en",
    translations: translations,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
