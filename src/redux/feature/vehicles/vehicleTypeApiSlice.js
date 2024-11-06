import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const vehicleTypeAdapter = createEntityAdapter({});

const initialState = vehicleTypeAdapter.getInitialState();

export const vehicleTypeTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleType: builder.query({
      query: () => "/vehicle-types",
      validateStatus: (response, result) => {
        return response.result === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        // console.log(responseData)
        const loadVehicleTypes = responseData.map((vehicleType) => {
          vehicleType.id = vehicleType.uuid;
          return vehicleType;
        });
        return vehicleTypeAdapter.setAll(initialState, loadVehicleTypes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "VehicleType", id: "LIST" },
            ...result.ids.map((id) => ({ type: "VehicleType", id })),
          ];
        } else {
          return [{ type: "VehicleType", id: "LIST" }];
        }
      },
    }),
    addNewVehicleType: builder.mutation({
      query: (initialState) => ({
        url: "/vehicle-types",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "VehicleType", id: "LIST" }],
    }),
    deleteVehicleType: builder.mutation({
      query: (uuid) => ({
        url: `/vehicle-types/${uuid}`,
        method: "DELETE",
        body: {
          uuid,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "VehicleType", id: arg.uuid },
      ],
    }),
    addNewVehicleType: builder.mutation({
      query: (initialState) => ({
        url: "/vehicle-types",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "VehicleType", id: "LIST" }],
    }),
    updateVehicleType: builder.mutation({
      query: ({ uuid, ...initialState }) => ({
        url: `/vehicle-types/${uuid}`,
        method: "PATCH",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "VehicleType", id: arg.uuid },
      ],
    }),
  }),
});

export const {
  useGetVehicleTypeQuery,
  useAddNewVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
  useUpdateVehicleTypeMutation,
} = vehicleTypeTypeApiSlice;

// return query result object

export const selectVehicleTypeResult =
  vehicleTypeTypeApiSlice.endpoints.getVehicleType.select();

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
