import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const checkInAdapter = createEntityAdapter({});

const initialState = checkInAdapter.getInitialState();

export const checkInApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheckIn: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/vehicles/check-in?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCheckIn = responseData.content.map((checkIn) => {
          checkIn.id = checkIn.uuid;
          return checkIn;
        });
        return {
          ...checkInAdapter.setAll(initialState, loadedCheckIn),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CheckIn", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CheckIn", id })),
          ];
        } else return [{ type: "CheckIn", id: "LIST" }];
      },
    }),

    filterCheckIn: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        dateFrom = "",
        dateTo = "",
        keywords = ""
      }) => ({
        url: `/vehicles/check-in/filters?keywords=${keywords}&pageNo=${pageNo}&pageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCheckIn = responseData.content.map((checkIn) => {
          checkIn.id = checkIn.uuid;
          return checkIn;
        });
        return {
          ...checkInAdapter.setAll(initialState, loadedCheckIn),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CheckIn", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CheckIn", id })),
          ];
        } else return [{ type: "CheckIn", id: "LIST" }];
      },
    }),

  }),
});

export const {
  useFilterCheckInQuery,
  useGetCheckInQuery,
} = checkInApiSlice;

// return the query result object
export const selectCheckInResult = checkInApiSlice.endpoints.getCheckIn.select();

// create momorized selector
const selectCheckInData = createSelector(
  selectCheckInResult,
  (checkInResult) => checkInResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllCheckIn,
  selectById: selectCheckInById,
  selectIds: selectCheckInIds,
  // pass the selector that return the checkIn slice of state
} = checkInAdapter.getSelectors((state) => selectCheckInData(state) ?? initialState);
