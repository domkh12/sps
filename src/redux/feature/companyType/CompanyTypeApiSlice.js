import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const companyTypeAdapter = createEntityAdapter({});

const initialState = companyTypeAdapter.getInitialState();

export const companyTypeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyType: builder.query({
            query: () => ({
                url: `/company-types`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "CompanyType", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "CompanyType", id })),
                    ];
                } else return [{ type: "CompanyType", id: "LIST" }];
            },
        }),

        createCompanyType: builder.mutation({
            query: (initialState) => ({
                url: "/company-types",
                method: "POST",
                body: {
                ...initialState,
                },
            }),
            invalidatesTags: [{ type: "CompanyType", id: "LIST" }],
        }),

        updateCompanyType: builder.mutation({
            query: ({uuid, ...initialCompanyTypeData}) => ({
                url: `/company-types/${uuid}`,
                method: "PUT",
                body: {
                ...initialCompanyTypeData,
                },
            }),
            invalidatesTags: [{type: "CompanyType", id: "LIST"}],
        }),

        getCompanyTypeByUuid: builder.query({
            query: ({uuid}) => `company-types/${uuid}`,
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                return [{type: "CompanyTypeByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "CompanyTypeByUuid", id})),];
                } else return [{type: "CompanyTypeByUuid", id: "LIST"}];
            },
        }),

        deleteCompanyType: builder.mutation({
            query: ({ uuid }) => ({
                url: `/company-types/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{ type: "CompanyType", id: "LIST" }],
        }),
    }),
});

export const { 
    useCreateCompanyTypeMutation,
    useDeleteCompanyTypeMutation,
    useGetCompanyTypeByUuidQuery,
    useUpdateCompanyTypeMutation, 
    useGetCompanyTypeQuery
} = companyTypeApiSlice;
