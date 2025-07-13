import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const genderAdapter = createEntityAdapter({});

const initialState = genderAdapter.getInitialState();

export const genderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({    

    getAllGenders: builder.query({
      query: () => ({
        url: "/genders",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "Genders", id: "LIST"}, ...result.ids.map((id) => ({type: "Genders", id})),];
        } else return [{type: "Genders", id: "LIST"}];
      },
    }),

    createGender: builder.mutation({
      query: (initialState) => ({
        url: "/genders",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "Genders", id: "LIST" }],
    }),

    updateGender: builder.mutation({
      query: ({uuid, ...initialGenderData}) => ({
        url: `/genders/${uuid}`,
        method: "PUT",
        body: {
          ...initialGenderData,
        },
      }),
      invalidatesTags: [{type: "Genders", id: "LIST"}],
    }),

    getGenderByUuid: builder.query({
      query: ({uuid}) => `genders/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "GenderByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "GenderByUuid", id})),];
        } else return [{type: "GenderByUuid", id: "LIST"}];
      },
    }),

    deleteGender: builder.mutation({
      query: ({ uuid }) => ({
        url: `/genders/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Genders", id: "LIST" }],
    }),

  }),
});

export const {
    useCreateGenderMutation,
    useUpdateGenderMutation,
    useGetGenderByUuidQuery,
    useDeleteGenderMutation,
    useGetAllGendersQuery,
} = genderApiSlice;



// return query result object

export const selectGenderResult =
  genderApiSlice.endpoints.getAllGenders.select();

// create momorized selector

const selectGenderData = createSelector(
  selectGenderResult,
  (genderResult) => genderResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring

export const {
  selectAll: selectAllGenders,
  selectById: selectGenderById,
  selectIds: selectGenderIds,
  // pass the selector that return the gender slice of state
} = genderAdapter.getSelectors(
  (state) => selectGenderData(state) ?? initialState
);
