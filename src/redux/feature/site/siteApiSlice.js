import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setSites } from "./siteSlice";

const sitesAdapter = createEntityAdapter({});

const initialState = sitesAdapter.getInitialState();

export const sitesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/sites?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSites = responseData.content.map((site) => {
          site.id = site.uuid;
          return site;
        });
        return {
          ...sitesAdapter.setAll(initialState, loadedSites),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Site", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Site", id })),
          ];
        } else return [{ type: "Site", id: "LIST" }];
      },
    }),

    filterSites: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        keywords = "",
        cityId = "",
        siteTypeId = "",
        companyId = "",
      }) => ({
        url: `/sites/filter?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords}&cityId=${cityId}&siteTypeId=${siteTypeId}&companyId=${companyId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSites = responseData.content.map((site) => {
          site.id = site.uuid;
          return site;
        });
        return {
          ...sitesAdapter.setAll(initialState, loadedSites),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Site", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Site", id })),
          ];
        } else return [{ type: "Site", id: "LIST" }];
      },
    }),

    getSitesList: builder.mutation({
      query: () => ({
        url: "/sites/all",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSites(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getBranchList: builder.query({
        query: () => ({
            url: `/sites/all`,
        }),
        providesTags: (result, error, arg) => {
            if (result?.ids) {
            return [{ type: "BranchName", id: "LIST" }, ...result.ids.map((id) => ({ type: "BranchName", id }))];
            } else return [{ type: "BranchName", id: "LIST" }];
        },
    }),

    createNewSite: builder.mutation({
      query: (initialState) => ({
        url: "/sites",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: (result, error, arg) =>
          [
            { type: "Site", id: "LIST" },
            { type: "BranchName", id: "LIST" },
            { type: "Company", id: "LIST" },
            { type: "CompanyName", id: "LIST" }
          ],
    }),

    updateSite: builder.mutation({
      query: ({ uuid, ...initialState }) => ({
        url: `/sites/${uuid}`,
        method: "PATCH",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: (result, error, arg) =>
          [
            { type: "Site", id: arg.uuid },
            { type: "BranchName", id: "LIST" },
            { type: "Company", id: "LIST" },
            { type: "CompanyName", id: "LIST" }
          ],
    }),

    deleteSite: builder.mutation({
      query: ({ uuid }) => ({
        url: `/sites/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) =>
          [
            { type: "Site", id: arg.uuid },
            { type: "BranchName", id: "LIST" },
            { type: "Company", id: "LIST" },
            { type: "CompanyName", id: "LIST" }
          ],
    }),

    getSiteByUuid: builder.query({
        query: (uuid) => ({
            url: `/sites/${uuid}`,
        }),
        providesTags: (result, error, arg) => {
          if (result?.ids) {
            return [{type: "BranchByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "BranchByUuid", id})),];
          } else return [{type: "BranchByUuid", id: "LIST"}];
        },
    }),

    getListBranch: builder.query({
        query: () => ({
            url: `/sites/list`,
        }),
        providesTags: (result, error, arg) => {
            if (result?.ids) {
            return [{ type: "BranchList", id: "LIST" }, ...result.ids.map((id) => ({ type: "BranchList", id }))];
            } else return [{ type: "BranchList", id: "LIST" }];
        },
    }),


  }),
});

export const {
  useGetListBranchQuery,
  useGetBranchListQuery,
  useGetSiteByUuidQuery,
  useDeleteSiteMutation,
  useGetSitesQuery,
  useGetSitesListMutation,
  useCreateNewSiteMutation,
  useUpdateSiteMutation,
  useFilterSitesQuery,
} = sitesApiSlice;

// return the query result object
export const selectSiteResult = sitesApiSlice.endpoints.getSites.select();

// create momorized selector
const selectSiteData = createSelector(
  selectSiteResult,
  (siteResult) => siteResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllSite,
  selectById: selectSiteById,
  selectIds: selectSiteIds,
  // pass the selector that return the site slice of state
} = sitesAdapter.getSelectors((state) => selectSiteData(state) ?? initialState);
