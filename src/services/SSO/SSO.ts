import { CommonService } from "../service";
import { ApiResponse } from "../services";

const service = CommonService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getSSOSummary: build.mutation<ApiResponse<any>, void>({
            query: () => "/sso-action/summary/",
        }),
        getSSOSummaryByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/sso-action/summary?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getSSODetail: build.mutation<any[], {}>({
            query: (params : {pageNumber : number | string}) => ({
                url: `/sso-action/?nolimit=Y&page=${params?.pageNumber}`,
                method: 'GET'
            })
        }),
        getSSODetailByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/sso-action/?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getSSOServices: build.mutation<ApiResponse<any>, void>({
            query: () => "/sso-action/filter-options/",
        }),
    }),
});

export const {
    useGetSSOSummaryMutation,
    useLazyGetSSOSummaryByFilterQuery,
    useGetSSODetailMutation,
    useLazyGetSSODetailByFilterQuery,
    useGetSSOServicesMutation
} = service;