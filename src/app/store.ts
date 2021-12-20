import { configureStore } from "@reduxjs/toolkit";
import patternReducer from "../editor/patternSlice";

export const store = configureStore({ reducer: { pattern: patternReducer } });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
