import { MenuService } from "../service";
import { ApiResponse } from "../services";
import { MenuRoutesInterface } from "../Menu/MenuService.d";

const service = MenuService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getLocalAuthMenuRoutes: build.mutation<ApiResponse<MenuRoutesInterface>, void>({
            query: () => "/routes/authMenu.json",
        }),
        getLocalUnauthMenuRoutes: build.mutation<ApiResponse<MenuRoutesInterface>, void>({
            query: () => "/routes/unauthMenu.json",
        }),
    }),
});

export const { 
    useGetLocalAuthMenuRoutesMutation,
    useGetLocalUnauthMenuRoutesMutation
} = service;