// Importing necessary dependencies
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
    services: {}
}
// Creating a slice for managing menu-related state
const reducer = createSlice({
    name: "templateProject", // Name of the slice
    initialState,
    reducers: {

        SetChartServiceModuleName: ( state, { payload }: PayloadAction<any>) => {
            if (payload) {                                
                state.services = payload;
            }
        },

        SetFilterData: ( state, { payload }: PayloadAction<any>) => {
            if (payload) {                                
                state.filter = payload;
            }
        },

    },
    extraReducers: () => { }, // Placeholder for additional reducers if needed
});

// Exporting actions and reducer for use in the application
export const {
    reducer: ServiceModuleNameReducer, // Menu reducer for store integration
    actions: {
        SetChartServiceModuleName,
        SetFilterData,
    },
} = reducer;