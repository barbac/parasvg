import { configureStore } from "@reduxjs/toolkit";
import patternReducer from "../editor/patternSlice";
import toolsReducer from "../editor/toolsSlice";
import undoable, { excludeAction } from "redux-undo";

export const store = configureStore({
  reducer: {
    pattern: undoable(patternReducer, {
      filter: excludeAction(["pattern/setGuidePos", "pattern/setVertexValue"]),
    }),
    toolbox: toolsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
