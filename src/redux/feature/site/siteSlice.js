import { createSlice } from "@reduxjs/toolkit";

const siteSlice = createSlice({
  name: "sites",

  // initial data
  initialState: {
    changedSite: false,
    sites: [],
    sitesForChange: [{}]
  },

  // function
  reducers: {
    setSites: (state, action) => {
      state.sites = action.payload;
    },
    setChangedSite: (state, action) => {
      state.changedSite = !state.changedSite;
    },
    setSitesForChange: (state, action) => {
      state.sitesForChange = action.payload;
    }
  },
});

export const { setSites, setChangedSite, setSitesForChange } = siteSlice.actions;

export default siteSlice.reducer;
