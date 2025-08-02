import { apiSlice } from "../../app/api/apiSlice";
import { setTotalCountAnalysis } from "./analysisSlice";

export const analysisApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAnalysis: builder.query({
      query: () => ({
        url: `/analysis`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Analysis", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Analysis", id })),
          ];
        } else return [{ type: "Analysis", id: "LIST" }];
      },
    }),

    getTotalCountAnalysis: builder.mutation({
      query: () => ({
        url: "/analysis/total-counts",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTotalCountAnalysis({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetAnalysisQuery,
  useGetTotalCountAnalysisMutation
} = analysisApiSlice;
