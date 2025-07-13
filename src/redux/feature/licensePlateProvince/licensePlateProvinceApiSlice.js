import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const licensePlateProvinceAdapter = createEntityAdapter({});

const initialState = licensePlateProvinceAdapter.getInitialState();

export const licensePlateProvinceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({    

    getAllLicensePlateProvinces: builder.query({
      query: () => ({
        url: "/license-plate-provinces",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "LicensePlateProvinces", id: "LIST"}, ...result.ids.map((id) => ({type: "LicensePlateProvinces", id})),];
        } else return [{type: "LicensePlateProvinces", id: "LIST"}];
      },
    }),

    createLicensePlateProvince: builder.mutation({
      query: (initialState) => ({
        url: "/license-plate-provinces",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "LicensePlateProvinces", id: "LIST" }],
    }),

    updateLicensePlateProvince: builder.mutation({
      query: ({uuid, ...initialLicensePlateProvinceData}) => ({
        url: `/license-plate-provinces/${uuid}`,
        method: "PUT",
        body: {
          ...initialLicensePlateProvinceData,
        },
      }),
      invalidatesTags: [{type: "LicensePlateProvinces", id: "LIST"}],
    }),

    getLicensePlateProvinceByUuid: builder.query({
      query: ({uuid}) => `license-plate-provinces/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "LicensePlateProvinceByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "LicensePlateProvinceByUuid", id})),];
        } else return [{type: "LicensePlateProvinceByUuid", id: "LIST"}];
      },
    }),

    deleteLicensePlateProvince: builder.mutation({
      query: ({ uuid }) => ({
        url: `/license-plate-provinces/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "LicensePlateProvinces", id: "LIST" }],
    }),

  }),
});

export const {
    useCreateLicensePlateProvinceMutation,
    useUpdateLicensePlateProvinceMutation,
    useGetLicensePlateProvinceByUuidQuery,
    useDeleteLicensePlateProvinceMutation,
    useGetAllLicensePlateProvincesQuery,
} = licensePlateProvinceApiSlice;



// return query result object

export const selectLicensePlateProvinceResult =
  licensePlateProvinceApiSlice.endpoints.getAllLicensePlateProvinces.select();

// create momorized selector

const selectLicensePlateProvinceData = createSelector(
  selectLicensePlateProvinceResult,
  (licensePlateProvinceResult) => licensePlateProvinceResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring

export const {
  selectAll: selectAllLicensePlateProvinces,
  selectById: selectLicensePlateProvinceById,
  selectIds: selectLicensePlateProvinceIds,
  // pass the selector that return the licensePlateProvince slice of state
} = licensePlateProvinceAdapter.getSelectors(
  (state) => selectLicensePlateProvinceData(state) ?? initialState
);
