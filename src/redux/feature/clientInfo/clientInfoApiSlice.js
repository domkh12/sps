import { apiSlice } from "../../app/api/apiSlice";
import {createEntityAdapter} from "@reduxjs/toolkit";

const clientInfoAdapter = createEntityAdapter({});

const initialState = clientInfoAdapter.getInitialState();

export const clientInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getClientInfo: builder.query({
      query: ({userId, pageNo = "1", pageSize = "5"}) => ({
        url: `/client-info/${userId}?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedClientInfo = responseData.content.map((clientInfo) => {
          clientInfo.id = clientInfo.id;
          return clientInfo;
        });
        return {
          ...clientInfoAdapter.setAll(initialState, loadedClientInfo),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ClientInfo", id: "LIST" },
            ...result.ids.map((id) => ({ type: "ClientInfo", id })),
          ];
        } else return [{ type: "ClientInfo", id: "LIST" }];
      },
    }),

  }),
});

export const {
  useGetClientInfoQuery,
} = clientInfoApiSlice;
