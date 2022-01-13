import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface PatternState {
  name: string;
  // handles: [],
  // guides: [],
  scale: number;
  mirror: boolean;
}

const initialState: PatternState = {
  name: "",
  scale: 1,
  mirror: false,
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
    setMirror: (state, action: PayloadAction<boolean>) => {
      state.mirror = action.payload;
    },
    toggleMirror: (state, action: PayloadAction<void>) => {
      state.mirror = !state.mirror;
    },
  },
});

export const { setName, setScale, setMirror, toggleMirror } =
  patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern;
export const selectMirror = (state: RootState) => state.pattern.mirror;
export default patternSlice.reducer;
