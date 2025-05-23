import { CommonService } from "../service";
import { ApiResponse } from "../services";

const service = CommonService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getDashboardSummaryByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/dashboard/summary?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getDashboardSummary: build.mutation<ApiResponse<any>, void>({
            query: () => "/dashboard/summary/",
        }),
    }),
});

export const {
    useGetDashboardSummaryMutation,
    useLazyGetDashboardSummaryByFilterQuery
} = service;