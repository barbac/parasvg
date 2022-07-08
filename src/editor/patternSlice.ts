import { create, all } from "mathjs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Vertex } from "./points";
import { Guide, GUIDE_HORIZONTAL, GUIDE_VERTICAL } from "./Guides";

const math = create(all);

interface Parameters {
  name: string;
  parameters: { [key: string]: number };
}

interface PatternState {
  name: string;
  vertices: Vertex[];
  guides: Guide[];
  scale: number;
  mirror: boolean;
  parameters: Parameters[];
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
      lengthExpresion: 500,
      direction: 1,
      label: "",
    },
    {
      type: "v",
      originIndex: null,
      pos: 30,
      length: 30,
      lengthExpresion: 30,
      direction: 1,
      label: "",
    },
  ],
  parameters: [
    {
      name: "body",
      parameters: {
        Waist: 94,
        Shoulder: 20,
      },
    },
    {
      name: "customization",
      parameters: {
        "Waist extra": 1,
      },
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
  length: string;
  index: number;
}

interface vertexValue {
  vertex: Vertex;
  index: number;
}

interface ParameterValue {
  index: number;
  name: string;
  value: number;
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

function computeGuideLength(
  lengthExpresion: number | string,
  guideIndex: number,
  state: PatternState
) {
  //x or y origin
  if (guideIndex < NON_ORIGINS_START_INDEX) {
    return;
  }

  let guide = state.guides[guideIndex];
  guide.lengthExpresion = lengthExpresion;

  let guideLength = 0;
  try {
    //TODO: use dot notation or something to prevent overwriting duplicated names.
    let scope: { [key: string]: number } = {};
    state.parameters.forEach((parameter) => {
      for (const key in parameter.parameters) {
        scope[key] = parameter.parameters[key];
      }
    });
    state.guides.forEach((guide) => {
      if (guide.label) {
        scope[guide.label] = guide.length;
      }
    });

    guideLength = math.evaluate(`${lengthExpresion}`, scope);
  } catch (e) {
    //TODO: report it or give feedback somehow.
    console.log(e);
    return;
  }
  if (typeof guideLength !== "number") {
    return;
  }

  guide.length = guideLength;
  if (guide.type === GUIDE_HORIZONTAL) {
    const originGuide = state.guides[HORIZONTAL_GUIDE_INDEX];
    guide.pos = originGuide.pos - guide.length / state.scale;
  } else {
    const originGuide = state.guides[VERTICAL_GUIDE_INDEX];
    guide.pos = originGuide.pos + guide.length / state.scale;
  }

  updateAnchoredVertices(state.vertices, guide, guideIndex);
}

export const patternSlice = createSlice({
  name: "pattern",
  initialState,
  reducers: {
    setPattern: (state, action: PayloadAction<PatternState>) => {
      console.log("loading state");
      const { name, scale, mirror, vertices, guides, parameters } =
        action.payload;
      state.name = name;
      state.scale = scale;
      state.mirror = mirror;
      state.vertices = vertices;
      state.guides = guides;
      state.parameters = parameters;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      const oldScale = state.scale;
      state.scale = action.payload;
      const scaleFactor = state.scale / oldScale;
      state.guides.forEach((guide, i) => {
        const oldLength = guide.length;
        guide.length *= scaleFactor;
        guide.length = Math.round(guide.length * 100) / 100;
        if (guide.lengthExpresion === oldLength) {
          guide.lengthExpresion = guide.length;
        }
        state.guides.forEach((guide, i) => {
          computeGuideLength(guide.lengthExpresion, i, state);
        });
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
      lastGuide.lengthExpresion = lastGuide.length;
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
            if (nonOriginGuide.length === nonOriginGuide.lengthExpresion) {
              nonOriginGuide.length = calculateLength(
                nonOriginGuide,
                state.guides,
                state.scale
              );
              nonOriginGuide.lengthExpresion = nonOriginGuide.length;
            } else {
              computeGuideLength(nonOriginGuide.lengthExpresion, i, state);
            }
          }
        }
      } else {
        guide.length = calculateLength(guide, state.guides, state.scale);
        guide.lengthExpresion = guide.length;
      }

      updateAnchoredVertices(state.vertices, guide, guideIndex);
    },
    setGuideLength: (state, action: PayloadAction<GuideLength>) => {
      const guideIndex = action.payload.index;
      computeGuideLength(action.payload.length, guideIndex, state);
    },
    setParameterValue: (state, action: PayloadAction<ParameterValue>) => {
      state.parameters[action.payload.index].parameters[action.payload.name] =
        action.payload.value;
      state.guides.forEach((guide, i) => {
        computeGuideLength(guide.lengthExpresion, i, state);
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
  setGuideLength,
  setParameterValue,
  finishDragging,
} = patternSlice.actions;
export const selectPattern = (state: RootState) => state.pattern.present;
export const selectMirror = (state: RootState) => state.pattern.present.mirror;
export const selectVertices = (state: RootState) =>
  state.pattern.present.vertices;
export const selectGuides = (state: RootState) => state.pattern.present.guides;
export const selectParameters = (state: RootState) =>
  state.pattern.present.parameters;
export default patternSlice.reducer;
