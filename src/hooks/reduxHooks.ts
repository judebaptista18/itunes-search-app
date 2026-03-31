import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

/**
 * Custom typed version of useDispatch.
 *
 * Ensures that all dispatched actions are correctly typed,
 * which includes thunk actions and middleware.
 *
 * Usage:
 * const dispatch = useAppDispatch();
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom typed version of useSelector.
 *
 * Enforces RootState typing across the app, providing:
 * Compile time safety when accessing state
 *
 * Usage:
 * const value = useAppSelector((state) => state.search);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
