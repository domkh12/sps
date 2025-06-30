import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setLabels, setParking } from "./parkingSlice";

const parkingAdapter = createEntityAdapter({});

const initialState = parkingAdapter.getInitialState();

export const parkingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParkingSpaces: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/parking-spaces?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParking = responseData.content.map((parking) => {
          parking.id = parking.uuid;
          return parking;
        });
         return {
           ...parkingAdapter.setAll(initialState, loadedParking),
           totalPages: responseData.page.totalPages,
           totalElements: responseData.page.totalElements,
           pageNo: responseData.page.number,
           pageSize: responseData.page.size,
         };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Parking", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Parking", id })),
          ];
        } else return [{ type: "Parking", id: "LIST" }];
      },
    }),

    filterParkingSpaces: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        keywords = "",
        branchUuid = "",
      }) => ({
        url: `/parking-spaces/filters?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&branchUuid=${branchUuid}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParking = responseData.content.map((parking) => {
          parking.id = parking.uuid;
          return parking;
        });
         return {
           ...parkingAdapter.setAll(initialState, loadedParking),
           totalPages: responseData.page.totalPages,
           totalElements: responseData.page.totalElements,
           pageNo: responseData.page.number,
           pageSize: responseData.page.size,
         };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Parking", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Parking", id })),
          ];
        } else return [{ type: "Parking", id: "LIST" }];
      },
    }),

    addNewParking: builder.mutation({
      query: (initialState) => ({
        url: "/parking-spaces",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: (result, error, arg) =>
          [
            { type: "Parking", id: "LIST" },
            { type: "BranchList", id: "LIST" }
          ],
    }),

    updateParking: builder.mutation({
      query: ({ uuid, ...initialParkingData }) => ({
        url: `/parking-spaces/${uuid}`,
        method: "PATCH",
        body: {
          ...initialParkingData,
        },
      }),
      invalidatesTags: (result, error, arg) =>
          [
            { type: "Parking", uuid: arg.uuid },
          ]
    }),
    
    deleteParking: builder.mutation({
      query: ({ uuid }) => ({
        url: `/parking-spaces/${uuid}`,
        method: "DELETE",
        body: {
          uuid,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Parking", id: arg.uuid },
      ],
    }),

    findAllLabels: builder.mutation({
      query: () => ({
        url: `/parking-spaces/list`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setLabels({ data }));
        } catch (error) {
          console.error("Failed to fetch parking label:", error);
        }
      },
    }),

    findParkingByUuid: builder.mutation({
      query: (uuid) => ({
        url: `/parking-spaces/${uuid}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setParking(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },
    }),

    findParkingSpaceByUuid: builder.query({
      query: (uuid) => ({
        url: `/parking-spaces/${uuid}`,
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "ParkingSpaceByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "ParkingSpaceByUuid", id})),];
        } else return [{type: "ParkingSpaceByUuid", id: "LIST"}];
      },
    }),
  }),
});

export const {
  useGetParkingSpacesQuery,
  useFilterParkingSpacesQuery,
  useAddNewParkingMutation,
  useUpdateParkingMutation,
  useDeleteParkingMutation,
  useFindAllLabelsMutation,
  useFindParkingByUuidMutation,
  useFindParkingSpaceByUuidQuery,
} = parkingApiSlice;

// return the query result object
export const selectParkingResult = parkingApiSlice.endpoints.getParkingSpaces.select();
// create memorized selector
const selectParkingData = createSelector(
  selectParkingResult,
  (parkingResult) => parkingResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllParking,
  selectById: selectParkingById,
  selectIds: selectParkingIds,
  // pass the selector that return the parking slice of state
} = parkingAdapter.getSelectors(
  (state) => selectParkingData(state) ?? initialState
);
