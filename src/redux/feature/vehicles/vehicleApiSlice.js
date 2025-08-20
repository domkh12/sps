import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import {
  setLicensePlateProvincesFetched,
  setLicensePlateTypesFetched,
  setVehicleTypeFetched,
} from "./vehicleSlice";

const vehicleAdapter = createEntityAdapter({});

const initialState = vehicleAdapter.getInitialState();

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/vehicles?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadVehicles = responseData.content.map((vehicle) => {
          vehicle.id = vehicle.uuid;
          return vehicle;
        });
        return {
          ...vehicleAdapter.setAll(initialState, loadVehicles),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Vehicle", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Vehicle", id })),
          ];
        } else return [{ type: "Vehicle", id: "LIST" }];
      },
    }),

    filterVehicles: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        keywords = "",
        branchId = "",
        vehicleTypeId = "",
      }) => ({
        url: `/vehicles/filters?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&branchId=${branchId}&vehicleTypeId=${vehicleTypeId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadVehicles = responseData.content.map((vehicle) => {
          vehicle.id = vehicle.uuid;
          return vehicle;
        });
        return {
          ...vehicleAdapter.setAll(initialState, loadVehicles),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Vehicle", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Vehicle", id })),
          ];
        } else return [{ type: "Vehicle", id: "LIST" }];
      },
    }),

    filterReportVehicles: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        dateFrom = "",
        dateTo = "",
      }) => ({
        url: `/vehicles/report?pageNo=${pageNo}&pageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadVehicles = responseData.content.map((vehicle) => {
          vehicle.id = vehicle.uuid;
          return vehicle;
        });
        return {
          ...vehicleAdapter.setAll(initialState, loadVehicles),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Vehicle", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Vehicle", id })),
          ];
        } else return [{ type: "Vehicle", id: "LIST" }];
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

    deleteVehicle: builder.mutation({
      query: ({ id }) => ({
        url: `/vehicles/${id}`,
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),

    getVehicleByUuid: builder.query({
      query: (uuid) => `vehicles/uuid/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "VehicleByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "VehicleByUuid", id})),];
        } else return [{type: "VehicleByUuid", id: "LIST"}];
      },
    }),

    getReportVehiclePdf: builder.mutation({
      query: () => ({
        url: "/vehicles/report/pdf",
        responseHandler: (res) => res.blob()
      }),
    }),


    getReportVehicleExcel: builder.mutation({
      query: () => ({
        url: "/vehicles/report/excel",
        responseHandler: (res) => res.blob()
      }),
    })

  }),
});

export const {
  useGetReportVehicleExcelMutation,
  useGetReportVehiclePdfMutation,
  useFilterReportVehiclesQuery,
  useGetVehicleByUuidQuery,
  useGetVehiclesQuery,
  useAddNewVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useFilterVehiclesQuery,
} = vehicleApiSlice;



// return query result object

export const selectVehicleResult =
  vehicleApiSlice.endpoints.getVehicles.select();

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
