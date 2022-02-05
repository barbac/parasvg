import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Vertex } from "./points";
import { Guide, GUIDE_HORIZONTAL, GUIDE_VERTICAL } from "./Guides";

interface PatternState {
  name: string;
  vertices: Vertex[];
  guides: Guide[];
  scale: number;
  mirror: boolean;
}

const initialState: PatternState = {
  name: "",
  scale: 1,
  mirror: false,
  vertices: [],
  guides: [],
};

interface GuidePos {
  x: number;
  y: number;
  index: number;
}

interface vertexValue {
  vertex: Vertex;
  index: number;
}

export const patternSlice = createSlice({
  name: "pattern",
  initialState,
  reducers: {
    setPattern: (state, action: PayloadAction<PatternState>) => {
      console.log("loading state");
      const { name, scale, mirror, vertices, guides } = action.payload;
      state.name = name;
      state.scale = scale;
      state.mirror = mirror;
      state.vertices = vertices;
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
    clearVertices: (state, action: PayloadAction<void>) => {
      state.vertices = [];
    },
    setVertices: (state, action: PayloadAction<Vertex[]>) => {
      state.vertices = action.payload;
    },
    addVertex: (state, action: PayloadAction<Vertex>) => {
      state.vertices.push(action.payload);
    },
    setVertexValue: (state, action: PayloadAction<vertexValue>) => {
      state.vertices[action.payload.index] = action.payload.vertex;
    },
    clearGuides: (state, action: PayloadAction<void>) => {
      state.guides = [];
    },
    addGuide: (state, action: PayloadAction<Guide>) => {
      state.guides.push(action.payload);
    },
    setGuideLabel: (
      state,
      action: PayloadAction<{ label: string; index: number }>
    ) => {
      state.guides[action.payload.index].label = action.payload.label;
    },
    setGuidePos: (state, action: PayloadAction<GuidePos>) => {
      const guideIndex = action.payload.index;
      let guide = state.guides[guideIndex];
      const { x, y } = action.payload;
      guide.pos = guide.type === GUIDE_HORIZONTAL ? y : x;

      state.vertices.forEach((vertex) => {
        if (guide.type === GUIDE_HORIZONTAL && vertex.anchorY === guideIndex) {
          vertex.y = y;
        } else if (
          guide.type === GUIDE_VERTICAL &&
          vertex.anchorX === guideIndex
        ) {
          vertex.x = x;
        }
      });
    },
    finishDragging: (state, action: PayloadAction<void>) => {
      //dummy reducer to have an undoable action for the entire dragging movement.
    },
  },
});

export const {
  setName,
  setScale,
  setMirror,
  toggleMirror,
  clearVertices,
  setVertices,
  addVertex,
  setVertexValue,
  clearGuides,
  addGuide,
  setGuideLabel,
  setGuidePos,
  finishDragging,
} = patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern.present;
export const selectMirror = (state: RootState) => state.pattern.present.mirror;
export const selectVertices = (state: RootState) =>
  state.pattern.present.vertices;
export const selectGuides = (state: RootState) => state.pattern.present.guides;
export default patternSlice.reducer;
