import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const vehicleAdapter = createEntityAdapter({});

const initialState = vehicleAdapter.getInitialState();

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicle: builder.query({
      query: ({ pageNo = 1, pageSize = 30 } = {}) => `/vehicles?pageNo=${pageNo}&pageSize=${pageSize}`,
      validateStatus: (response, result) => {
        return response.result === 200 && !result.isError;
      },
      serializeQueryArgs: ({ pageNo }) => {
        const newQueryArgs = { ...pageNo };
        if (newQueryArgs.page) {
          delete newQueryArgs.page;
        }
        return newQueryArgs;
      },
      transformResponse: (responseData) => {    
        const loadVehicles = responseData.content.map((vehicle) => {
          vehicle.id = vehicle.uuid;
          return vehicle;
        });
        return{
          ...vehicleAdapter.setAll(initialState, loadVehicles),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Vehicle", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Vehicle", id })),
          ];
        } else {
          return [{ type: "Vehicle", id: "LIST" }];
        }
      },
    }),
    addNewVehicle: builder.mutation({
      query: (initialState) => ({
        url: "/vehicles",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    updateVehicle: builder.mutation({
      query: ({ uuid, ...initialState }) => ({
        url: `/vehicles/${uuid}`,
        method: "PATCH",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Vehicle", id: arg.uuid },
      ],
    }),
  }),
});

export const { useGetVehicleQuery, useAddNewVehicleMutation, useUpdateVehicleMutation } = vehicleApiSlice;

// return query result object

export const selectVehicleResult =
  vehicleApiSlice.endpoints.getVehicle.select();

// create momorized selector

const selectVehicleData = createSelector(
  selectVehicleResult,
  (vehicleResult) => vehicleResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring

export const {
  selectAll: selectAllVehicles,
  selectById: selectVehicleById,
  selectIds: selectVehicleIds,
  // pass the selector that return the vehicle slice of state
} = vehicleAdapter.getSelectors(
  (state) => selectVehicleData(state) ?? initialState
);
