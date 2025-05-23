import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../stores/Store';

/**
 * Custom hook to get the `dispatch` function with the correct typing for `AppDispatch`.
 * This is a wrapper around the `useDispatch` hook to ensure that the dispatch function
 * is typed according to the application's `AppDispatch` type.
 * 
 * @returns {AppDispatch} The typed dispatch function.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook to get the `selector` function with the correct typing for `AppState`.
 * This is a wrapper around the `useSelector` hook to ensure that the selector function
 * is typed according to the application's `AppState` type.
 * 
 * @type {TypedUseSelectorHook<AppState>} A typed version of `useSelector` to select the state from the Redux store.
 */
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
