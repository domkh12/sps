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
    }),
});

export const { useGetCompanyTypeQuery } = companyTypeApiSlice;
