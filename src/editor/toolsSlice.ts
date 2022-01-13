import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export type ToolState = "move" | "hguide" | "vguide" | "handle" | "curve";

const initialState = {
  toolMode: "move",
};

export const toolSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    selectToolMode: (state, action: PayloadAction<ToolState>) => {
      state.toolMode = action.payload;
    },
    setToolState: (state, action: PayloadAction<ToolState>) => {
      state.toolMode = action.payload;
    },
  },
});

export const { setToolState } = toolSlice.actions;
export const selectToolMode = (state: RootState) => state.toolbox.toolMode;
export default toolSlice.reducer;
