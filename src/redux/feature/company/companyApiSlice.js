import { apiSlice } from "../../app/api/apiSlice";
import { setCompaniesData } from "./companySlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

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

    filterCompany: builder.query({
      query: ({keywords, pageNo, pageSize, companyTypeUuid, cityUuid}) => ({
        url: `/companies/filters?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&companyTypeUuid=${companyTypeUuid}&cityUuid=${cityUuid}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }), transformResponse: (responseData) => {
        const loadedCompany = responseData.content.map((company) => {
          company.id = company.uuid;
          return company;
        });
        return {
          ...companiesAdapter.setAll(initialState, loadedCompany),
          totalPagesFilter: responseData.page.totalPages,
          totalElementsFilter: responseData.page.totalElements,
          pageNoFilter: responseData.page.number,
          pageSizeFilter: responseData.page.size,
        };
      }, providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "Company", id: "LIST"}, ...result.ids.map((id) => ({type: "Company", id})),];
        } else return [{type: "Company", id: "LIST"}];
      },
    }),

    createCompany: builder.mutation({
      query: (initialState) => ({
        url: "/companies",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),

    updateCompany: builder.mutation({
      query: ({uuid, ...initialCompanyData}) => ({
        url: `/companies/${uuid}`,
        method: "PUT",
        body: {
          ...initialCompanyData,
        },
      }),
      invalidatesTags: [{type: "Company", id: "LIST"}],
    }),

    deleteCompany: builder.mutation({
      query: ({ uuid }) => ({
        url: `/companies/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Company", id: arg.uuid }],
    }),

    getAllCompanies: builder.query({
      query: () => ({
        url: "/companies/names",
        method: "GET",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "CompanyName", id: "LIST"}, ...result.ids.map((id) => ({type: "CompanyName", id})),];
        } else return [{type: "CompanyName", id: "LIST"}];
      },
    }),

    getCompanyByUuid: builder.query({
      query: (uuid) => `companies/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "CompanyByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "CompanyByUuid", id})),];
        } else return [{type: "CompanyByUuid", id: "LIST"}];
      },
    })

  }),
});

export const { useFilterCompanyQuery , useDeleteCompanyMutation, useGetAllCompaniesQuery , useGetCompanyQuery , useCreateCompanyMutation, useGetCompanyByUuidQuery, useUpdateCompanyMutation } = companiesApiSlice;
