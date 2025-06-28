import { apiSlice } from "../../app/api/apiSlice";
import { setSiteTypeData } from "./siteTypeSlice";

export const siteTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSiteTypes: builder.query({
      query: () => ({
        url: "/site-types",
        method: "GET",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "BranchType", id: "LIST" },
            ...result.ids.map((id) => ({ type: "BranchType", id })),
          ];
        } else return [{ type: "BranchType", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllSiteTypesQuery } = siteTypeApiSlice;
