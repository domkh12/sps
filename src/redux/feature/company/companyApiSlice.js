import { apiSlice } from "../../app/api/apiSlice";
import { setCompaniesData } from "./companySlice";
import {createEntityAdapter} from "@reduxjs/toolkit";

const companiesAdapter = createEntityAdapter({});

const initialState = companiesAdapter.getInitialState();

export const companiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/companies?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCompanies = responseData.content.map((company) => {
          company.id = company.uuid;
          return company;
        });
        return {
          ...companiesAdapter.setAll(initialState, loadedCompanies),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Company", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Company", id })),
          ];
        } else return [{ type: "Company", id: "LIST" }];
      },
    }),

    getAllCompanies: builder.mutation({
      query: () => ({
        url: "/companies",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCompaniesData({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetAllCompaniesMutation, useGetCompanyQuery } = companiesApiSlice;
