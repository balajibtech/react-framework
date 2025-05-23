import { CommonService } from "../service";
import { ApiResponse } from "../services";

const service = CommonService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getWebserviceSummary: build.mutation<ApiResponse<any>, void>({
            query: () => "/webservice/summary/",
        }),
        getWebServiceSummaryByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/webservice/summary?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getWebserviceDetailExpand: build.query<ApiResponse<any>, {}>({
            query: (params : {expandData : number | string}) => ({
                url: `/webservice/transaction/?${params?.expandData}`,
                method: 'GET'
            })
        }),
        getWebserviceDetail: build.mutation<any[], {}>({
            query: (params : {pageNumber : number | string}) => ({
                url: `/webservice/?nolimit=Y&page=${params?.pageNumber}`,
                method: 'GET'
            })
        }),
        getWebServiceDetailByFilter: build.query<ApiResponse<any>, {}>({
            query: (params : {filterData : number | string}) => ({
                url: `/webservice/?${params?.filterData}`,
                method: 'GET'
            })
        }),
        getWebServiceServices: build.mutation<ApiResponse<any>, void>({
            query: () => "/webservice/filter-options/",
        }),
    }),
});

export const {
    useGetWebserviceSummaryMutation,
    useLazyGetWebServiceSummaryByFilterQuery,
    useLazyGetWebserviceDetailExpandQuery,
    useGetWebserviceDetailMutation,
    useLazyGetWebServiceDetailByFilterQuery,
    useGetWebServiceServicesMutation,
} = service;