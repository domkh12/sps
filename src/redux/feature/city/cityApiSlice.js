import { apiSlice } from "../../app/api/apiSlice";


export const cityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query({
      query: () => ({
        url: "/cities",
        method: "GET",
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CityName", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CityName", id })),
          ];
        } else return [{ type: "CityName", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllCitiesQuery } = cityApiSlice;
