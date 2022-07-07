import React, { useState } from "react";
import Handles from "./Handles";
import { Guide } from "./Guides";
import { Guides, GUIDE_HORIZONTAL, GUIDE_VERTICAL } from "./Guides";
import GuideMeasurements from "./GuideMeasurements";
import Path from "./Path";
import gcode from "../utils/gcode";
import serialization from "../utils/serialization";
import Controls from "./Controls";
import ToolBox from "./ToolBox";
import mirrorPoints from "./points";
import { Vertex } from "./points";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  selectPattern,
  selectVertices,
  selectGuides,
  setName,
  setScale,
  toggleMirror,
  clearVertices,
  setVertices,
  addVertex,
  setVertexValue,
  clearGuides,
  addGuide,
  setGuidePos,
  finishDragging,
} from "./patternSlice";
import {
  ToolState,
  selectToolMode,
  setToolState as _setToolState,
} from "./toolsSlice";

const TOOL_TYPES = {
  move: "move",
  handle: "handle",
  hLine: "hguide",
  vLine: "vguide",
  clear: "clear",
  curve: "curve",
  // gcode: "gcode",
};

const TOOL_KEYS: { [index: string]: any } = {
  KeyN: TOOL_TYPES.move,
  KeyP: TOOL_TYPES.handle,
  KeyH: TOOL_TYPES.hLine,
  KeyV: TOOL_TYPES.vLine,
  KeyC: TOOL_TYPES.clear,
  KeyS: TOOL_TYPES.curve,
  // KeyG: TOOL_TYPES.gcode,
};

const DEFAULT_SCALE = 1;

export default function Editor() {
  let svg: any;
  const dispatch = useAppDispatch();
  const pattern = useAppSelector(selectPattern);
  const guides = useAppSelector(selectGuides);
  const vertices = useAppSelector(selectVertices);
  const toolState = useAppSelector(selectToolMode);
  const setToolState = (toolMode: ToolState) =>
    dispatch(_setToolState(toolMode));
  const [handleDraggingIndex, setHandleDraggingIndex] = useState(null);
  const [guideDraggingIndex, setGuidDraggingIndex] = useState(null);
  const [image, setImage] = useState("/pattern.png");
  const [gcodeString, setGcodeString] = useState("");

  function addHandle(e: React.MouseEvent<HTMLElement>) {
    if (e.altKey) {
      dispatch(clearVertices());
      return;
    }
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    dispatch(
      addVertex({
        anchorX: null,
        anchorY: null,
        x: cursorpt.x,
        y: cursorpt.y,
        type: "end",
      })
    );
  }

  function createGuide(
    e: React.MouseEvent<HTMLElement>,
    guideType: Guide["type"]
  ) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    const guide: Guide = {
      type: guideType,
      originIndex: null,
      pos: guideType === GUIDE_HORIZONTAL ? cursorpt.y : cursorpt.x,
      length: 0,
      lengthExpresion: 0,
      direction: 1,
      label: "",
    };
    return guide;
  }

  function addHGuide(e: React.MouseEvent<HTMLElement>) {
    dispatch(addGuide(createGuide(e, GUIDE_HORIZONTAL)));
  }

  function addVGuide(e: React.MouseEvent<HTMLElement>) {
    dispatch(addGuide(createGuide(e, GUIDE_VERTICAL)));
  }

  function handleGcodeAction() {
    setGcodeString(
      gcode(pattern.mirror ? mirrorPoints(vertices) : vertices, pattern.scale)
    );
  }

  function handleKeyPress(e: React.KeyboardEvent<SVGElement>) {
    const key = e.code;
    if (key === "KeyC") {
      if (e.shiftKey) {
        dispatch(clearVertices());
        dispatch(clearGuides());
      }
      setToolState("move");
    } else if (key === "KeyG") {
      handleGcodeAction();
      setToolState("move");
    } else if (key === "KeyI") {
      let reversedVertices = [...vertices];
      reversedVertices.reverse();
      dispatch(setVertices(reversedVertices));
      setToolState("move");
    } else if (key === "KeyR") {
      if (vertices.length) {
        const yAxis = vertices[0].x;
        let reflectedVertices = vertices.map((vertex) => {
          const newVertex: Vertex = { ...vertex };
          newVertex.x = yAxis - (vertex.x - yAxis);
          return newVertex;
        });

        dispatch(setVertices(reflectedVertices));
      }
      setToolState("move");
    } else if (key === "KeyM") {
      dispatch(toggleMirror());
    } else {
      setToolState(TOOL_KEYS[key]);
    }
  }

  function handleHandleClick(i: number) {
    if (toolState !== TOOL_TYPES.curve) {
      return;
    }
    let vertex = vertices[i];
    let newVertex: Vertex = { ...vertex };

    newVertex.type = "control";
    const DELTA = 50;
    newVertex.x = vertex.x + DELTA;
    newVertex.y = vertex.y + DELTA;

    let newVertexs = [...vertices];
    newVertexs.splice(i, 0, newVertex);
    dispatch(setVertices(newVertexs));
  }

  function handleDrag(e: React.MouseEvent<SVGElement>) {
    if (handleDraggingIndex === null && guideDraggingIndex === null) {
      return;
    }

    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());

    if (handleDraggingIndex !== null) {
      const SNAP_DISTANCE = 20;

      //horizontals
      let distance = 1000; //start with a big number to find the closests.
      let snapHGuide: Guide | null = null;
      let snapHGuideIndex = null;

      guides.forEach((guide: Guide, i) => {
        if (guide.type === GUIDE_HORIZONTAL) {
          const newDistance = Math.abs(guide.pos - cursorpt.y);
          if (newDistance < distance && newDistance < SNAP_DISTANCE) {
            snapHGuide = guide;
            snapHGuideIndex = i;
            distance = newDistance;
          }
        }
      });
      if (snapHGuide) {
        cursorpt.y = snapHGuide["pos"]; //using dot notationg breaks ts??
      }

      //vertical
      distance = 1000;
      let snapVGuide = null;
      let snapVGuideIndex = -1;
      guides.forEach((guide, i) => {
        if (guide.type === GUIDE_VERTICAL) {
          const newDistance = Math.abs(guide.pos - cursorpt.x);
          if (newDistance < distance && newDistance < SNAP_DISTANCE) {
            snapVGuide = guide;
            snapVGuideIndex = i;
            distance = newDistance;
          }
        }
      });
      if (snapVGuide) {
        cursorpt.x = snapVGuide["pos"];
      }

      const vertex = {
        type: vertices[handleDraggingIndex].type,
        anchorY: snapHGuideIndex,
        anchorX: snapVGuideIndex,
        x: cursorpt.x,
        y: cursorpt.y,
      };
      dispatch(
        setVertexValue({
          vertex,
          index: handleDraggingIndex,
        })
      );
    } else if (guideDraggingIndex !== null) {
      const pos = {
        x: cursorpt.x,
        y: cursorpt.y,
        index: guideDraggingIndex,
      };
      dispatch(setGuidePos(pos));
    } else {
      console.error("weird");
    }
  }

  function handleNewAction() {
    console.log("new, clearing.");
    dispatch(clearVertices());
    dispatch(clearGuides());
    setToolState("move");
    setHandleDraggingIndex(null);
    setGuidDraggingIndex(null);
    dispatch(setScale(DEFAULT_SCALE));
    dispatch(setName(""));
  }

  function handleSaveAction() {
    serialization.save();
  }

  function handleLoadAction(name: string) {
    if (name === "") {
      dispatch(setName(""));
      return;
    } else if (name === pattern.name) {
      return;
    }
    serialization.load(name);
    setToolState("move");
    setHandleDraggingIndex(null);
    setGuidDraggingIndex(null);
  }

  const TOOL_FUNCTIONS: { [index: string]: any } = {
    move: () => {},
    handle: addHandle,
    hguide: addHGuide,
    vguide: addVGuide,
  };

  const viewBoxWidth = 1000;
  const viewBoxHeight = 600;
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  return (
    <div
      className="container"
      style={{ border: "thin solid blue" }}
      // contentEditable="true"
    >
      <div className="controls">
        <Controls
          image={image}
          onBackgroundSelected={setImage}
          onNewAction={handleNewAction}
          onSaveAction={handleSaveAction}
          onLoadAction={handleLoadAction}
          gcode={gcodeString}
          onGcodeAction={handleGcodeAction}
        />
      </div>
      <ToolBox />
      <svg
        id="svg"
        ref={(ref) => {
          svg = ref;
        }}
        viewBox={viewBox}
        className="background-img"
        style={{ border: "thin solid red", height: "100vh" }}
        onClick={TOOL_FUNCTIONS[toolState]}
        onMouseUp={() => {
          setHandleDraggingIndex(null);
          setGuidDraggingIndex(null);
          dispatch(finishDragging());
        }}
        onMouseMove={handleDrag}
        tabIndex={0}
        onKeyPress={handleKeyPress}
      >
        <image href={image} height="100%" />
        <Path vertices={vertices} mirror={pattern.mirror} />
        <GuideMeasurements
          width={viewBoxWidth}
          height={viewBoxHeight}
          scale={pattern.scale}
        />
        <Guides
          width={viewBoxWidth}
          height={viewBoxHeight}
          onMouseDown={setGuidDraggingIndex}
        />
        <Handles
          vertices={vertices}
          onMouseDown={setHandleDraggingIndex}
          onClick={handleHandleClick}
        />
      </svg>
    </div>
  );
}
