// Importing necessary dependencies
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    MenuRoutesInterface,
    RouterResponse,
    MenuInterface,
} from "@/services/MenuService/MenuService.d";

// Initial state for the menu reducer
const initialState: {
    routeData?: {}; // Stores both menu and route data
    menuServiceData?: any; // Stores menu data
    route?: []; // Stores route data
    local_menu?: any; // Stores locally available menu
    currentMenuData?: any; // Stores currently selected menu item
    currentSubMenuData?: any; // Stores currently selected sub-menu item
    
    defaultRoute: any;
    routePath: string;
    routeStore: RouterResponse[] | null;
    menuStore: MenuInterface[] | null;
    activeRoute: RouterResponse | null;
    chartData: any
} = {
    defaultRoute: undefined,
    routePath: "",
    routeStore: null,
    menuStore: null,
    activeRoute: null,
    chartData: null
};

// Creating a slice for managing menu-related state
const reducer = createSlice({
    name: "templateProject", // Name of the slice
    initialState,
    reducers: {
        
        setMenuAndRoute: (
            state,
            { payload }: PayloadAction<MenuRoutesInterface>
        ) => {
            if (payload) {
                state.routeStore = payload.route;
                state.menuStore = payload.menu;
            }
        },

        setDefaultRoute: (state,{ payload }: PayloadAction<any>) => {
            if (payload) {
                state.defaultRoute = payload;
            }
        },

        setActiveRoute: (state, { payload }: PayloadAction<RouterResponse>) => {
            if (payload) {
                state.activeRoute = payload;
            }
        },

        setRoutePath: (state, { payload }: PayloadAction<string>) => {
            state.routePath = payload;
        },

        setChartData: (state, { payload }: PayloadAction<any>) => {
            state.chartData = payload;
        },

    },
    extraReducers: () => { }, // Placeholder for additional reducers if needed
});

// Exporting actions and reducer for use in the application
export const {
    reducer: MenuReducer, // Menu reducer for store integration
    actions: {
        setMenuAndRoute, 
        setActiveRoute, 
        setRoutePath,
        setDefaultRoute,
        setChartData
    },
} = reducer;