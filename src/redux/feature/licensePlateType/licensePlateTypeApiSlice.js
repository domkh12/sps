import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const licensePlateTypeAdapter = createEntityAdapter({});

const initialState = licensePlateTypeAdapter.getInitialState();

export const licensePlateTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({    

    getAllLicensePlateTypes: builder.query({
      query: () => ({
        url: "/license-plate-types",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "LicensePlateTypes", id: "LIST"}, ...result.ids.map((id) => ({type: "LicensePlateTypes", id})),];
        } else return [{type: "LicensePlateTypes", id: "LIST"}];
      },
    }),

    createLicensePlateType: builder.mutation({
      query: (initialState) => ({
        url: "/license-plate-types",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "LicensePlateTypes", id: "LIST" }],
    }),

    updateLicensePlateType: builder.mutation({
      query: ({uuid, ...initialLicensePlateTypeData}) => ({
        url: `/license-plate-types/${uuid}`,
        method: "PUT",
        body: {
          ...initialLicensePlateTypeData,
        },
      }),
      invalidatesTags: [{type: "LicensePlateTypes", id: "LIST"}],
    }),

    getLicensePlateTypeByUuid: builder.query({
      query: ({uuid}) => `license-plate-types/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "LicensePlateTypeByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "LicensePlateTypeByUuid", id})),];
        } else return [{type: "LicensePlateTypeByUuid", id: "LIST"}];
      },
    }),

    deleteLicensePlateType: builder.mutation({
      query: ({ uuid }) => ({
        url: `/license-plate-types/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "LicensePlateTypes", id: "LIST" }],
    }),

  }),
});

export const {
    useCreateLicensePlateTypeMutation,
    useUpdateLicensePlateTypeMutation,
    useGetLicensePlateTypeByUuidQuery,
    useDeleteLicensePlateTypeMutation,
    useGetAllLicensePlateTypesQuery,
} = licensePlateTypeApiSlice;



// return query result object

export const selectLicensePlateTypeResult =
  licensePlateTypeApiSlice.endpoints.getAllLicensePlateTypes.select();

// create momorized selector

const selectLicensePlateTypeData = createSelector(
  selectLicensePlateTypeResult,
  (licensePlateTypeResult) => licensePlateTypeResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring

export const {
  selectAll: selectAllLicensePlateTypes,
  selectById: selectLicensePlateTypeById,
  selectIds: selectLicensePlateTypeIds,
  // pass the selector that return the licensePlateType slice of state
} = licensePlateTypeAdapter.getSelectors(
  (state) => selectLicensePlateTypeData(state) ?? initialState
);
