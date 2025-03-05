import { apiSlice } from "../../app/api/apiSlice";
import { setTotalCountAnalysis } from "./analysisSlice";

export const analysisApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetTotalCountAnalysisMutation } = analysisApiSlice;
