import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const vehicleTypeAdapter = createEntityAdapter({});

const initialState = vehicleTypeAdapter.getInitialState();

export const vehicleTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({    

    getAllVehicleTypes: builder.query({
      query: () => ({
        url: "/vehicle-types",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "VehicleTypes", id: "LIST"}, ...result.ids.map((id) => ({type: "VehicleTypes", id})),];
        } else return [{type: "VehicleTypes", id: "LIST"}];
      },
    }),

    createVehicleType: builder.mutation({
      query: (initialState) => ({
        url: "/vehicle-types",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "VehicleTypes", id: "LIST" }],
    }),

    updateVehicleType: builder.mutation({
      query: ({uuid, ...initialVehicleTypeData}) => ({
        url: `/vehicle-types/${uuid}`,
        method: "PUT",
        body: {
          ...initialVehicleTypeData,
        },
      }),
      invalidatesTags: [{type: "VehicleTypes", id: "LIST"}],
    }),

    getVehicleTypeByUuid: builder.query({
      query: ({uuid}) => `vehicle-types/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "VehicleTypeByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "VehicleTypeByUuid", id})),];
        } else return [{type: "VehicleTypeByUuid", id: "LIST"}];
      },
    }),

    deleteVehicleType: builder.mutation({
      query: ({ uuid }) => ({
        url: `/vehicle-types/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "VehicleTypes", id: "LIST" }],
    }),

  }),
});

export const {
    useCreateVehicleTypeMutation,
    useUpdateVehicleTypeMutation,
    useGetVehicleTypeByUuidQuery,
    useDeleteVehicleTypeMutation,
    useGetAllVehicleTypesQuery,
} = vehicleTypeApiSlice;



// return query result object

export const selectVehicleTypeResult =
  vehicleTypeApiSlice.endpoints.getAllVehicleTypes.select();

// create momorized selector

const selectVehicleTypeData = createSelector(
  selectVehicleTypeResult,
  (vehicleTypeResult) => vehicleTypeResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring

export const {
  selectAll: selectAllVehicleTypes,
  selectById: selectVehicleTypeById,
  selectIds: selectVehicleTypeIds,
  // pass the selector that return the vehicleType slice of state
} = vehicleTypeAdapter.getSelectors(
  (state) => selectVehicleTypeData(state) ?? initialState
);
