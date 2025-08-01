import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const parkingSlotDetailAdapter = createEntityAdapter({});

const initialState = parkingSlotDetailAdapter.getInitialState();

export const parkingSlotDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParkingSlotDetail: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/parking-slot-details?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParkingSlotDetail = responseData.content.map((parkingSlotDetail) => {
          parkingSlotDetail.id = parkingSlotDetail.uuid;
          return parkingSlotDetail;
        });
        return {
          ...parkingSlotDetailAdapter.setAll(initialState, loadedParkingSlotDetail),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlotDetail", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlotDetail", id })),
          ];
        } else return [{ type: "ParkingSlotDetail", id: "LIST" }];
      },
    }),

    filterParkingSlotDetail: builder.query({
      query: ({
                pageNo = 1,
                pageSize = 5,
                keywords = "",
                dateFrom = "",
                dateTo = "",
      }) => ({
        url: `/parking-slot-details/filters?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParkingSlotDetail = responseData.content.map((parkingSlotDetail) => {
          parkingSlotDetail.id = parkingSlotDetail.uuid;
          return parkingSlotDetail;
        });
        return {
          ...parkingSlotDetailAdapter.setAll(initialState, loadedParkingSlotDetail),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlotDetail", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlotDetail", id })),
          ];
        } else return [{ type: "ParkingSlotDetail", id: "LIST" }];
      },
    }),

    filterReportParkingSlotDetail: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        dateFrom = "",
        dateTo = "",
      }) => ({
        url: `/parking-slot-details/report?pageNo=${pageNo}&pageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParkingSlotDetail = responseData.content.map((parkingSlotDetail) => {
          parkingSlotDetail.id = parkingSlotDetail.uuid;
          return parkingSlotDetail;
        });
        return {
          ...parkingSlotDetailAdapter.setAll(initialState, loadedParkingSlotDetail),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlotDetail", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlotDetail", id })),
          ];
        } else return [{ type: "ParkingSlotDetail", id: "LIST" }];
      },
    }),

    findParkingSlotDetailByUuid: builder.query({
      query: (uuid) => ({
        url: `/parking-slot-details/${uuid}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingSlotDetailByUuid", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingSlotDetailByUuid", id })),
          ];
        } else return [{ type: "ParkingSlotDetailByUuid", id: "LIST" }];
      },
    }),

  }),
});

export const {
  useFilterParkingSlotDetailQuery,
  useGetParkingSlotDetailQuery,
  useFilterReportParkingSlotDetailQuery,
  useFindParkingSlotDetailByUuidQuery,
} = parkingSlotDetailApiSlice;

// return the query result object
export const selectParkingSlotDetailResult = parkingSlotDetailApiSlice.endpoints.getParkingSlotDetail.select();

// create momorized selector
const selectParkingSlotDetailData = createSelector(
  selectParkingSlotDetailResult,
  (parkingSlotDetailResult) => parkingSlotDetailResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllParkingSlotDetail,
  selectById: selectParkingSlotDetailById,
  selectIds: selectParkingSlotDetailIds,
  // pass the selector that return the parkingSlotDetail slice of state
} = parkingSlotDetailAdapter.getSelectors((state) => selectParkingSlotDetailData(state) ?? initialState);
