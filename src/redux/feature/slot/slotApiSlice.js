import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setSlot } from "./slotSlice";

const slotAdapter = createEntityAdapter({});

const initialState = slotAdapter.getInitialState();

export const slotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/parking-lots?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSlots = responseData.content.map((slot) => {
          slot.id = slot.uuid;
          return slot;
        });
        return {
          ...slotAdapter.setAll(initialState, loadedSlots),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Slot", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Slot", id })),
          ];
        } else return [{ type: "Slot", id: "LIST" }];
      },
    }),

    filterSlots: builder.query({
      query: ({ pageNo = 1, pageSize = 5, keywords = "", branchUuid = "" }) => ({
        url: `/parking-lots/filters?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&branchUuid=${branchUuid}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSlots = responseData.content.map((slot) => {
          slot.id = slot.uuid;
          return slot;
        });
        return {
          ...slotAdapter.setAll(initialState, loadedSlots),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Slot", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Slot", id })),
          ];
        } else return [{ type: "Slot", id: "LIST" }];
      },
    }),

    addNewSlot: builder.mutation({
      query: (initialState) => ({
        url: "/parking-lots",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "Slot", id: "LIST" }],
    }),

    addMultipleSlot: builder.mutation({
      query: (initialState) => ({
        url: "/parking-lots/multiple",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "Slot", id: "LIST" }],
    }),

    updateSlot: builder.mutation({
      query: ({ uuid, ...initialSlotData }) => ({
        url: `/parking-lots/${uuid}`,
        method: "PATCH",
        body: {
          ...initialSlotData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Slot", uuid: arg.uuid },
      ],
    }),

    deleteSlot: builder.mutation({
      query: ({ uuid }) => ({
        url: `/parking-lots/${uuid}`,
        method: "DELETE",
        body: { uuid },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Slot", id: arg.uuid },
      ],
    }),

    findAllLabels: builder.mutation({
      query: () => ({
        url: `/parking-lots/labels`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setLabels({ data }));
        } catch (error) {
          console.error("Failed to fetch slot labels:", error);
        }
      },
    }),

    findSlotByUuid: builder.mutation({
      query: (uuid) => ({
        url: `/parking-lots/${uuid}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSlot(data));
        } catch (error) {
          console.error("Failed to fetch slot:", error);
        }
      },
    }),
  }),
});

export const {
  useAddMultipleSlotMutation,
  useGetSlotsQuery,
  useFilterSlotsQuery,
  useAddNewSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
  useFindAllLabelsMutation,
  useFindSlotByUuidMutation,
} = slotApiSlice;

// Selectors
export const selectSlotResult = slotApiSlice.endpoints.getSlots.select();

const selectSlotData = createSelector(
  selectSlotResult,
  (slotResult) => slotResult.data ?? initialState
);

export const {
  selectAll: selectAllSlots,
  selectById: selectSlotById,
  selectIds: selectSlotIds,
} = slotAdapter.getSelectors((state) => selectSlotData(state));
