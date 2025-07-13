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

    createBranchType: builder.mutation({
      query: (initialState) => ({
          url: "/site-types",
          method: "POST",
          body: {
          ...initialState,
          },
      }),
      invalidatesTags: [{ type: "BranchType", id: "LIST" }],
    }),

    updateBranchType: builder.mutation({
      query: ({uuid, ...initialBranchTypeData}) => ({
          url: `/site-types/${uuid}`,
          method: "PUT",
          body: {
          ...initialBranchTypeData,
          },
      }),
      invalidatesTags: [{type: "BranchType", id: "LIST"}],
    }),

    deleteBranchType: builder.mutation({
      query: ({ uuid }) => ({
          url: `/site-types/${uuid}`,
          method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "BranchType", id: "LIST" }],
    }),

    getBranchTypeByUuid: builder.query({
      query: ({uuid}) => `site-types/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "BranchTypeByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "BranchTypeByUuid", id})),];
        } else return [{type: "BranchTypeByUuid", id: "LIST"}];
      },
    }),


  }),
});

export const { 
  useCreateBranchTypeMutation,
  useUpdateBranchTypeMutation,
  useDeleteBranchTypeMutation,
  useGetBranchTypeByUuidQuery,
  useGetAllSiteTypesQuery
} = siteTypeApiSlice;
