import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const checkOutAdapter = createEntityAdapter({});

const initialState = checkOutAdapter.getInitialState();

export const checkOutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheckOut: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/vehicles/check-out?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCheckOut = responseData.content.map((checkOut) => {
          checkOut.id = checkOut.uuid;
          return checkOut;
        });
        return {
          ...checkOutAdapter.setAll(initialState, loadedCheckOut),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CheckOut", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CheckOut", id })),
          ];
        } else return [{ type: "CheckOut", id: "LIST" }];
      },
    }),

    filterCheckOut: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        dateFrom = "",
        dateTo = "",
        keywords = ""
      }) => ({
        url: `/vehicles/check-out/filters?keywords=${keywords}&pageNo=${pageNo}&pageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCheckOut = responseData.content.map((checkOut) => {
          checkOut.id = checkOut.uuid;
          return checkOut;
        });
        return {
          ...checkOutAdapter.setAll(initialState, loadedCheckOut),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CheckOut", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CheckOut", id })),
          ];
        } else return [{ type: "CheckOut", id: "LIST" }];
      },
    }),

  }),
});

export const {
  useFilterCheckOutQuery,
  useGetCheckOutQuery,
} = checkOutApiSlice;

// return the query result object
export const selectCheckOutResult = checkOutApiSlice.endpoints.getCheckOut.select();

// create momorized selector
const selectCheckOutData = createSelector(
  selectCheckOutResult,
  (checkOutResult) => checkOutResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllCheckOut,
  selectById: selectCheckOutById,
  selectIds: selectCheckOutIds,
  // pass the selector that return the checkOut slice of state
} = checkOutAdapter.getSelectors((state) => selectCheckOutData(state) ?? initialState);
