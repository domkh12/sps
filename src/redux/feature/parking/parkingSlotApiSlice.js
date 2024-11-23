import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const parkingSlotsAdapter = createEntityAdapter({});

const initialState = parkingSlotsAdapter.getInitialState();

export const parkingSlotsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParkingSlots: builder.query({
      query: () => `/parking-slots`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        console.log("responseData", responseData);
        const loadedParkingSlots = responseData.map((parkingSlots) => {
          parkingSlots.id = parkingSlots.uuid;
          return parkingSlots;
        });
        return parkingSlotsAdapter.setAll(initialState, loadedParkingSlots);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlots", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlots", id })),
          ];
        } else return [{ type: "ParkingSlots", id: "LIST" }];
      },
    }),
    addNewParkingSlots: builder.mutation({
      query: (initialState) => ({
        url: "/parkingSlots",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "ParkingSlots", id: "LIST" }],
    }),

    updateParkingSlots: builder.mutation({
      query: ({ id, ...initialParkingSlotsData }) => ({
        url: `/parkingSlots/${id}`,
        method: "PATCH",
        body: {
          ...initialParkingSlotsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ParkingSlots", id: arg.id },
      ],
    }),

    deleteParkingSlots: builder.mutation({
      query: ({ id }) => ({
        url: `/parkingSlots/${id}`,
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ParkingSlots", id: arg.id },
      ],
    }),

    getParkingSlotsByUuid: builder.mutation({
      query: ({ uuid }) => ({
        url: `/parking-slots/${uuid}`,
      }),
      transformResponse: (responseData) => {
        console.log("responseData", responseData);
        const loadedParkingSlots = responseData.map((parkingSlots) => ({
          ...parkingSlots,
          id: parkingSlots.uuid,
        }));
        return parkingSlotsAdapter.setAll(initialState, [loadedParkingSlots]);
      },
    }),
   
    connectedParkingSlots: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/parkingSlots/${uuid}/status`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      transformResponse: (responseData) => {
        console.log("responseData", responseData);
      },
      invalidatesTags: (result, error, arg) => [
        { type: "ParkingSlots", id: arg.uuid },
      ],
    }),
    getFullNameParkingSlots: builder.query({
      query: () => `/parkingSlots/full-names`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedParkingSlots = responseData.map((parkingSlots) => {
          parkingSlots.id = parkingSlots.uuid;
          return parkingSlots;
        });
        return parkingSlotsAdapter.setAll(initialState, loadedParkingSlots);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlots", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlots", id })),
          ];
        } else return [{ type: "ParkingSlots", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetParkingSlotsQuery,
  useGetParkingSlotsByUuidMutation,
  useAddNewParkingSlotsMutation,
  useUpdateParkingSlotsMutation,
  useDeleteParkingSlotsMutation,
  usePaginationParkingSlotsMutation,
  useSearchParkingSlotsMutation,
  useFindByUuidMutation,
  useConnectedParkingSlotsMutation,
  useGetFullNameParkingSlotsQuery,
} = parkingSlotsApiSlice;

// return the query result object
export const selectParkingSlotsResult =
  parkingSlotsApiSlice.endpoints.getParkingSlots.select();
// create momorized selector
const selectParkingSlotsData = createSelector(
  selectParkingSlotsResult,
  (parkingSlotsResult) => parkingSlotsResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllParkingSlots,
  selectById: selectParkingSlotsById,
  selectIds: selectParkingSlotsIds,
  // pass the selector that return the parkingSlots slice of state
} = parkingSlotsAdapter.getSelectors(
  (state) => selectParkingSlotsData(state) ?? initialState
);
