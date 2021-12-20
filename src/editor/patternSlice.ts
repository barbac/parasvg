import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface PatternState {
  name: string;
  // handles: [],
  // guides: [],
  scale: number;
}

const initialState: PatternState = {
  name: "",
  scale: 1,
};

export const patternSlice = createSlice({
  name: "pattern",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
  },
});

export const { setName, setScale } = patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern;
export default patternSlice.reducer;
