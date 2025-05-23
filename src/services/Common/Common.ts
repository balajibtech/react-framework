import { ApiResponse } from "../services";
import { CommonService } from "../service";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["common"],
}).injectEndpoints({
  endpoints: (build) => ({
    getSavedFilters: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/filters/",
        method: "GET",
      }),
      providesTags: ["common"],
    }),
    saveFilter: build.mutation<ApiResponse<any>, {}>({
      query: (filters: any) => {
        return {
          url: "/",
          method: "PUT",
          body: { service_name: "filters", data: filters },
        };
      },
      invalidatesTags: ["common"],
    }),
    updateSavedFilter: build.mutation<ApiResponse<any>, {}>({
      query: ({ filterId, putData }: any) => ({
        url: `/filters/${filterId}`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["common"],
    }),
    deleteSavedFilter: build.mutation<ApiResponse<any>, number | string>({
      query: (filterId: number | string) => ({
        url: `/policies/${filterId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["common"],
    }),
    getTimestampService: build.mutation<ApiResponse<any>, void>({
      query: () => "/ingestor-logs/",
  }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetSavedFiltersQuery,
  useUpdateSavedFilterMutation,
  useSaveFilterMutation,
  useDeleteSavedFilterMutation,
  useGetTimestampServiceMutation,
} = service;
