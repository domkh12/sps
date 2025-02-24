import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setParkingLotDetail } from "./parkingDetailSlice";

const parkingDetailAdapter = createEntityAdapter({});

const initialState = parkingDetailAdapter.getInitialState();

export const parkingDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllParkingDetail: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/parking-details?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedParkingDetails = responseData.content.map(
          (parkingDetail) => {
            parkingDetail.id = parkingDetail.uuid;
            return parkingDetail;
          }
        );
        return {
          ...parkingDetailAdapter.setAll(initialState, loadedParkingDetails),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ParkingDetail", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ParkingDetail", id })),
          ];
        } else return [{ type: "ParkingDetail", id: "LIST" }];
      },
    }),

    getParkigDetail: builder.mutation({
      query: ({ uuid }) => ({
        url: `/parking-details/${uuid}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setParkingLotDetail(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetAllParkingDetailQuery, useGetParkigDetailMutation } =
  parkingDetailApiSlice;
