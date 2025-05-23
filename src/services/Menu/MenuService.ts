// // Importing necessary types and services
// import { ApiResponse } from "../ServiceTypes";
// import { MenuService } from "@/services/Services";
// import { MenuRoutesInterface, RouterResponse } from "@/services/Menu/MenuService.d";

// // Interface for menu request
// export interface menuRequest {
//     url: string; // URL parameter for menu requests
// }

// // Enhancing MenuService with additional endpoints
// const service = MenuService.enhanceEndpoints({}).injectEndpoints({
//     endpoints: (build) => ({
//         // Mutation to fetch menu routes for travel agencies
//         getMenuRoutes: build.mutation<ApiResponse<MenuRoutesInterface>, void>({
//             query: () => "travelagency/", // API endpoint to get menu routes
//         }),

//         // Mutation to fetch unauthenticated menu routes
//         getlocalUnAuthMenuRoutes: build.mutation<ApiResponse<MenuRoutesInterface>, void>({
//             query: () => "unauthMenuRoutes/", // API endpoint for unauthorized user menu routes
//         }),

//         // Mutation to fetch authenticated menu routes
//         getlocalAuthMenuRoutes: build.mutation<ApiResponse<MenuRoutesInterface>, void>({
//             query: () => "authMenuRoutes/", // API endpoint for authenticated user menu routes
//         }),

//         // Mutation to update menu routes (used for workflow reordering)
//         updateLocalMenuRoutes: build.mutation<
//             ApiResponse<RouterResponse[]>,
//             { service: string; data: any }
//         >({
//             query: (putData) => ({
//                 url: `/`, // API endpoint for updating menu routes
//                 method: "PUT", // Using PUT method to modify existing menu routes
//                 body: putData, // Request body containing service name and updated data
//             }),
//         }),
//     }),
//     overrideExisting: true, // Ensures existing endpoints are overridden if needed
// });

// // Exporting hooks for each mutation to be used in functional components
// export const {
//     useGetMenuRoutesMutation,         // Hook to fetch menu routes
//     useGetlocalAuthMenuRoutesMutation, // Hook to fetch authenticated menu routes
//     useGetlocalUnAuthMenuRoutesMutation, // Hook to fetch unauthenticated menu routes
//     useUpdateLocalMenuRoutesMutation // Hook to update menu routes
// } = service;
