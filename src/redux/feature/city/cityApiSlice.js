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

    createCity: builder.mutation({
      query: (initialState) => ({
        url: "/cities",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "CityName", id: "LIST" }],
    }),

    updateCity: builder.mutation({
      query: ({uuid, ...initialCityData}) => ({
        url: `/cities/${uuid}`,
        method: "PUT",
        body: {
          ...initialCityData,
        },
      }),
      invalidatesTags: [{type: "CityName", id: "LIST"}],
    }),

    getCityByUuid: builder.query({
      query: ({uuid}) => `cities/${uuid}`,
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "CityByUuid", id: "LIST"}, ...result.ids.map((id) => ({type: "CityByUuid", id})),];
        } else return [{type: "CityByUuid", id: "LIST"}];
      },
    }),

    deleteCity: builder.mutation({
      query: ({ uuid }) => ({
        url: `/cities/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "CityName", id: "LIST" }],
    }),

  }),
});

export const {
  useCreateCityMutation,
  useDeleteCityMutation,
  useGetCityByUuidQuery,
  useUpdateCityMutation,
  useGetAllCitiesQuery
} = cityApiSlice;
