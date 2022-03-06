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
  guides: [
    //Default origin guides. used by other guides to set lengths.
    {
      type: "h",
      originIndex: null,
      //TODO: calculate svg height and set it as default pos
      pos: 500,
      length: 500,
      direction: 1,
      label: "",
    },
    {
      type: "v",
      originIndex: null,
      pos: 30,
      length: 30,
      direction: 1,
      label: "",
    },
  ],
};

const HORIZONTAL_GUIDE_INDEX = 0;
const VERTICAL_GUIDE_INDEX = 1;
const NON_ORIGINS_START_INDEX = 2;

interface GuidePos {
  x: number;
  y: number;
  index: number;
}

interface GuideLength {
  length: number;
  index: number;
}

interface vertexValue {
  vertex: Vertex;
  index: number;
}

function calculateLength(guide: Guide, guides: Guide[], scale: number) {
  let length = 0;
  if (guide.type === GUIDE_HORIZONTAL) {
    const originGuide = guides[HORIZONTAL_GUIDE_INDEX];
    length = (originGuide.pos - guide.pos) * scale;
  } else {
    const originGuide = guides[VERTICAL_GUIDE_INDEX];
    length = (guide.pos - originGuide.pos) * scale;
  }
  //TODO: round to int and adjust positions?
  length = Math.round(length * 100) / 100;
  return length;
}

function updateAnchoredVertices(
  vertices: Vertex[],
  guide: Guide,
  guideIndex: number
) {
  vertices.forEach((vertex) => {
    if (guide.type === GUIDE_HORIZONTAL && vertex.anchorY === guideIndex) {
      vertex.y = guide.pos;
    } else if (guide.type === GUIDE_VERTICAL && vertex.anchorX === guideIndex) {
      vertex.x = guide.pos;
    }
  });
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
      const oldScale = state.scale;
      state.scale = action.payload;
      const scaleFactor = state.scale / oldScale;
      state.guides.forEach((guide) => {
        guide.length *= scaleFactor;
        guide.length = Math.round(guide.length * 100) / 100;
      });
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
      state.guides = [...initialState.guides];
    },
    addGuide: (state, action: PayloadAction<Guide>) => {
      const lastIndex = state.guides.push(action.payload) - 1;
      let lastGuide = state.guides[lastIndex];
      lastGuide.length = calculateLength(lastGuide, state.guides, state.scale);
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
      if (guideIndex < NON_ORIGINS_START_INDEX) {
        //x or y origins
        guide.length = 0;

        //update all guides anchored.
        for (
          let i = NON_ORIGINS_START_INDEX, len = state.guides.length;
          i < len;
          i++
        ) {
          let nonOriginGuide = state.guides[i];
          if (nonOriginGuide.type === guide.type) {
            nonOriginGuide.length = calculateLength(
              nonOriginGuide,
              state.guides,
              state.scale
            );
          }
        }
      } else {
        guide.length = calculateLength(guide, state.guides, state.scale);
      }

      updateAnchoredVertices(state.vertices, guide, guideIndex);
    },
    setGuideLength: (state, action: PayloadAction<GuideLength>) => {
      const guideIndex = action.payload.index;
      //x or y origin
      if (guideIndex < NON_ORIGINS_START_INDEX) {
        return;
      }

      let guide = state.guides[guideIndex];
      guide.length = action.payload.length;
      if (guide.type === GUIDE_HORIZONTAL) {
        const originGuide = state.guides[HORIZONTAL_GUIDE_INDEX];
        guide.pos = originGuide.pos - guide.length / state.scale;
      } else {
        const originGuide = state.guides[VERTICAL_GUIDE_INDEX];
        guide.pos = originGuide.pos + guide.length / state.scale;
      }

      updateAnchoredVertices(state.vertices, guide, guideIndex);
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
  setGuideLength,
  finishDragging,
} = patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern.present;
export const selectMirror = (state: RootState) => state.pattern.present.mirror;
export const selectVertices = (state: RootState) =>
  state.pattern.present.vertices;
export const selectGuides = (state: RootState) => state.pattern.present.guides;
export default patternSlice.reducer;
