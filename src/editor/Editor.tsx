import React, { useState } from "react";
import Handles from "./Handles";
import { Guide } from "./Guides";
import Guides from "./Guides";
import GuideMeasurements from "./GuideMeasurements";
import Path from "./Path";
import gcode from "../utils/gcode";
import Controls from "./Controls";
import ToolBox from "./ToolBox";
import mirrorPoints from "./points";
import { Handle } from "./points";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectPattern, setName, setScale, toggleMirror } from "./patternSlice";
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
  const [points, setPoints] = useState([] as Handle[]);
  const [guideData, setGuideData] = useState([] as Guide[]);
  const toolState = useAppSelector(selectToolMode);
  const setToolState = (toolMode: ToolState) =>
    dispatch(_setToolState(toolMode));
  const [handleDraggingIndex, setHandleDraggingIndex] = useState(null);
  const [guideDraggingIndex, setGuidDraggingIndex] = useState(null);
  const [image, setImage] = useState("/pattern.png");
  const [gcodeString, setGcodeString] = useState("");

  function addHandle(e: React.MouseEvent<HTMLElement>) {
    if (e.altKey) {
      setPoints([]);
      return;
    }
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setPoints([...points, [cursorpt.x, cursorpt.y, "end"]]);
  }

  function addHGuide(e: React.MouseEvent<HTMLElement>) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setGuideData([...guideData, [cursorpt.y, "hLine"]]);
  }

  function addVGuide(e: React.MouseEvent<HTMLElement>) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setGuideData([...guideData, [cursorpt.x, "vLine"]]);
  }

  function handleGcodeAction() {
    setGcodeString(
      gcode(pattern.mirror ? mirrorPoints(points) : points, pattern.scale)
    );
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLElement>) {
    const key = e.code;
    if (key === "KeyC") {
      if (e.shiftKey) {
        setPoints([]);
        setGuideData([]);
      }
      setToolState("move");
    } else if (key === "KeyG") {
      handleGcodeAction();
      setToolState("move");
    } else if (key === "KeyI") {
      let reversedPoints = [...points];
      reversedPoints.reverse();
      setPoints(reversedPoints);
      setToolState("move");
    } else if (key === "KeyR") {
      if (points.length) {
        const yAxis = points[0][0];
        let reflectedPoints = points.map((point) => {
          const newPoint: Handle = [...point];
          const a = point[0] - yAxis;
          newPoint[0] = yAxis - a;
          return newPoint;
        });

        setPoints(reflectedPoints);
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
    let point = points[i];
    let newPoint: Handle = [...point];

    newPoint[2] = "control";
    // point[3] = "S";
    newPoint[0] = point[0] + 200;
    newPoint[1] = point[1] + 100;

    let newPoints = [...points];
    newPoints.splice(i, 0, newPoint);
    setPoints(newPoints);
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
      let newPoints = [...points];

      const SNAP_DISTANCE = 20;

      //horizontals
      let distance = 1000; //
      let snapHGuide = null;

      guideData.forEach((guide) => {
        if (guide[1] === "hLine") {
          const newDistance = Math.abs(guide[0] - cursorpt.y);
          if (newDistance < distance && newDistance < SNAP_DISTANCE) {
            snapHGuide = guide;
            distance = newDistance;
          }
        }
      });
      if (snapHGuide) {
        cursorpt.y = snapHGuide[0];
      }

      //vertical
      distance = 1000;
      let snapVGuide = null;
      guideData.forEach((guide) => {
        if (guide[1] === "vLine") {
          const newDistance = Math.abs(guide[0] - cursorpt.x);
          if (newDistance < distance && newDistance < SNAP_DISTANCE) {
            snapVGuide = guide;
            distance = newDistance;
          }
        }
      });
      if (snapVGuide) {
        cursorpt.x = snapVGuide[0];
      }

      newPoints[handleDraggingIndex][0] = cursorpt.x;
      newPoints[handleDraggingIndex][1] = cursorpt.y;
      setPoints(newPoints);
    } else if (guideDraggingIndex !== null) {
      let newGuideData = [...guideData];
      const guide = guideData[guideDraggingIndex];

      if (guide[1] === "hLine") {
        newGuideData[guideDraggingIndex][0] = cursorpt.y;
      } else {
        newGuideData[guideDraggingIndex][0] = cursorpt.x;
      }

      setGuideData(newGuideData);
    } else {
      console.log("wtf");
    }
  }

  function handleControlsGuideChange(value: number, i: number) {
    let newGuides = [...guideData];
    newGuides[i][0] = value;
    setGuideData(newGuides);
  }

  function handleNewAction() {
    console.log("new, clearing.");
    setPoints([]);
    setGuideData([]);
    setToolState("move");
    setHandleDraggingIndex(null);
    setGuidDraggingIndex(null);
    dispatch(setScale(DEFAULT_SCALE));
    dispatch(setName(""));
  }

  function handleSaveAction() {
    if (pattern.name === "") {
      return;
    }
    const out = {
      name: pattern.name,
      handles: points,
      guides: guideData,
      scale: pattern.scale,
    };
    console.log("saving", out);
    window.localStorage.setItem(pattern.name, JSON.stringify(out));
  }

  function handleLoadAction(name: string) {
    if (name === "") {
      dispatch(setName(""));
      return;
    } else if (name === pattern.name) {
      return;
    }

    const patternString = window.localStorage.getItem(name);
    if (!patternString) {
      console.log(`pattern: ${name} not found`, name);
      return;
    }
    const patternData = JSON.parse(patternString);
    console.log(patternData);
    console.log("loading,", name);
    setPoints(patternData.handles);
    setGuideData(patternData.guides);
    setToolState("move");
    setHandleDraggingIndex(null);
    setGuidDraggingIndex(null);
    dispatch(setScale(patternData.scale));
    dispatch(setName(name));
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
      tabIndex={0}
      onKeyPress={handleKeyPress}
      // contentEditable="true"
    >
      <div className="controls">
        <Controls
          guides={guideData}
          image={image}
          onChange={handleControlsGuideChange}
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
        style={{ border: "thin solid red", height: "90vh" }}
        onClick={TOOL_FUNCTIONS[toolState]}
        onMouseUp={() => {
          setHandleDraggingIndex(null);
          setGuidDraggingIndex(null);
        }}
        onMouseMove={handleDrag}
      >
        <image transform="scale(1)" href={image} width="100%" height="100%" />
        <GuideMeasurements
          guideData={guideData}
          width={viewBoxWidth}
          height={viewBoxHeight}
          scale={pattern.scale}
        />
        <Guides
          guideData={guideData}
          width={viewBoxWidth}
          height={viewBoxHeight}
          onMouseDown={setGuidDraggingIndex}
        />
        <Path points={points} mirror={pattern.mirror} />
        <Handles
          points={points}
          onMouseDown={setHandleDraggingIndex}
          onClick={handleHandleClick}
        />
      </svg>
    </div>
  );
}
