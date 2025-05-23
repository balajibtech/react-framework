import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, RouterResponse } from '@/services/Initializer/InitializerTypes';

const initialState: { Menus: MenuItem; Routes: RouterResponse[]; LandingRoutes: RouterResponse[]} = {
  Menus: null as unknown as MenuItem,
  Routes: null as unknown as RouterResponse[],
  LandingRoutes: null as unknown as RouterResponse[]
};

const reducer = createSlice({
  name: 'initializer',
  initialState,
  reducers: {
    setMenu: (state, { payload }: PayloadAction<MenuItem>) => {
      return { ...state, Menus: payload };
    },
    setRoute: (state, { payload }: PayloadAction<RouterResponse[]>) => {
      return { ...state, Routes: payload };
    },
    setLandingRoute: (state, {payload}: PayloadAction<RouterResponse[]>) => {
      return {...state, LandingRoutes: payload};
    }
  },
  // extraReducers: (builder) => {
  //   builder
  //     // initial Menu and Route response
  //     .addMatcher(getMenusRoute.matchFulfilled, (state) => {
  //       // return { ...state.Menus, ...state.Routes };
  //     });
  // }
});

export const {
  actions: { setMenu, setRoute, setLandingRoute },
  reducer: initializerReducer
} = reducer;