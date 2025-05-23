import { configureStore } from "@reduxjs/toolkit";
import { CommonService, AuthService, MenuService, DashboardService, GrmService, GrmServiceV1, NotificationService } from "../services/service";
import { MenuReducer } from "./Menu.store";
import { UserReducer } from "./User.store";
import { ServiceModuleNameReducer} from "./Chart.store"
import { Provider } from "react-redux";

/**
 * Configures the Redux store.
 * Combines reducers, adds middleware (including the service's middleware),
 * and sets up the store for use in the application.
 */
export const store = configureStore({
    reducer: {
        MenuReducer,
        UserReducer,
        ServiceModuleNameReducer,
        [DashboardService.reducerPath]: DashboardService.reducer,
        [AuthService.reducerPath]: AuthService.reducer,
        [MenuService.reducerPath]: MenuService.reducer,
        [GrmService.reducerPath]: GrmService.reducer,
        [GrmServiceV1.reducerPath]: GrmServiceV1.reducer,
        [NotificationService.reducerPath]: NotificationService.reducer,
        [CommonService.reducerPath]: CommonService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(DashboardService.middleware)
            .concat(AuthService.middleware)
            .concat(MenuService.middleware)
            .concat(GrmService.middleware)
            .concat(GrmServiceV1.middleware)
            .concat(NotificationService.middleware)
            .concat(CommonService.middleware),
    devTools: true, // Enables Redux DevTools for debugging
});

/**
 * Type definition for the application's state.
 */
export type AppState = ReturnType<typeof store.getState>;

/**
 * Type definition for the application's dispatch function.
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Provides the Redux store to the application's components.
 * Wraps the application with the Redux Provider, making the store available to all connected components.
 * @param {React.FC<{ children: React.ReactNode }>} props - The component's props, including children.
 * @returns {JSX.Element} The Redux Provider with the store and the children.
 */
const AppStoreProvider: React.FC<{ children: React.ReactNode }> = (props) => {
    return <Provider store={store}>{props.children} </Provider>;
};

export { AppStoreProvider };
