import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Guide, GUIDE_HORIZONTAL } from "./Guides";

interface PatternState {
  name: string;
  // handles: [],
  guides: Guide[];
  scale: number;
  mirror: boolean;
}

const initialState: PatternState = {
  name: "",
  scale: 1,
  mirror: false,
  guides: [],
};

interface GuidePos {
  x: number;
  y: number;
  index: number;
}

export const patternSlice = createSlice({
  name: "pattern",
  initialState,
  reducers: {
    setPattern: (state, action: PayloadAction<PatternState>) => {
      console.log("loading state");
      const { name, scale, mirror, guides } = action.payload;
      state.name = name;
      state.scale = scale;
      state.mirror = mirror;
      state.guides = guides;
    },
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
    clearGuides: (state, action: PayloadAction<void>) => {
      state.guides = [];
    },
    addGuide: (state, action: PayloadAction<Guide>) => {
      state.guides.push(action.payload);
    },
    setGuidePos: (state, action: PayloadAction<GuidePos>) => {
      let guide = state.guides[action.payload.index];
      guide.pos =
        guide.type === GUIDE_HORIZONTAL ? action.payload.y : action.payload.x;
    },
  },
});

export const {
  setName,
  setScale,
  setMirror,
  toggleMirror,
  clearGuides,
  addGuide,
  setGuidePos,
} = patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern;
export const selectMirror = (state: RootState) => state.pattern.mirror;
export const selectGuides = (state: RootState) => state.pattern.guides;
export default patternSlice.reducer;
