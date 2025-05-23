import { CommonService } from "../service";
import { ApiResponse } from "../services";

const service = CommonService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getUserActionSummary: build.mutation<ApiResponse<any>, void>({
            query: () => "/user-action/summary/",
        }),
        getUserActionSummaryByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/user-action/summary?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getUserActionDetail: build.mutation<ApiResponse<any>, {}>({
            query: (params : {pageNumber : number | string}) => ({
                url: `/user-action/?nolimit=Y&page=${params?.pageNumber}`,
                method: 'GET'
            }),
        }),
        getUserActionDetailByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/user-action/?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getUserActionServices: build.mutation<ApiResponse<any>, void>({
            query: () => "/user-action/filter-options/",
        })
    }),
});

export const {
    useGetUserActionSummaryMutation,
    useLazyGetUserActionSummaryByFilterQuery,
    useGetUserActionDetailMutation,
    useLazyGetUserActionDetailByFilterQuery,
    useGetUserActionServicesMutation
} = service;