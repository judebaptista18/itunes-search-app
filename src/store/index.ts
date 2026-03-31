import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';

// Configure the Redux store with search slice reducer
export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
