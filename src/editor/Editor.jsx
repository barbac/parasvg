import React, { useState } from "react";
// import { pathDataToPoints } from "../pathDataToPoints.js";
import Handles from "./Handles.jsx";
import Guides from "./Guides.jsx";
import GuideMeasurements from "./GuideMeasurements.jsx";
import Path from "./Path.jsx";
import gcode from "../utils/gcode.js";
import Controls from "./Controls.jsx";

const TOOL_TYPES = {
  none: "none",
  handle: "handle",
  hLine: "hLine",
  vLine: "vLine",
  clear: "clear",
  spline: "spline",
  gcode: "gcode"
};

const TOOL_KEYS = {
  KeyN: TOOL_TYPES.none,
  KeyP: TOOL_TYPES.handle,
  KeyH: TOOL_TYPES.hLine,
  KeyV: TOOL_TYPES.vLine,
  KeyC: TOOL_TYPES.clear,
  KeyS: TOOL_TYPES.spline,
  KeyG: TOOL_TYPES.gcode
};

export default function Editor() {
  let svg;
  const [points, setPoints] = useState([]);
  const [guideData, setGuideData] = useState([]);
  const [toolType, setToolType] = useState(TOOL_TYPES.none);
  const [handleDraggingIndex, setHandleDraggingIndex] = useState(null);
  const [guideDraggingIndex, setGuidDraggingIndex] = useState(null);
  const [scale, setScale] = useState(1);

  function addHandle(e) {
    if (e.altKey) {
      setPoints([]);
      return;
    }
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setPoints([...points, [cursorpt.x, cursorpt.y, "end", "M"]]);
    // console.log(e);
  }

  function addHGuide(e) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setGuideData([...guideData, [cursorpt.y, "hLine"]]);
  }

  function addVGuide(e) {
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setGuideData([...guideData, [cursorpt.x, "vLine"]]);
  }

  function handleKeyPress(e) {
    const key = e.code;
    if (key === "KeyC") {
      if (e.shiftKey) {
        setPoints([]);
        setGuideData([]);
      }
      setToolType(TOOL_TYPES.none);
    } else if (key === "KeyG") {
      console.log("aasking expor");
      gcode(points);
      setToolType(TOOL_TYPES.none);
    } else {
      setToolType(TOOL_KEYS[key]);
    }
  }

  function handleHandleClick(i) {
    if (toolType !== TOOL_TYPES.spline) {
      return;
    }
    let point = points[i];
    let newPoint = [...point];

    newPoint[2] = "control";
    // point[3] = "S";
    newPoint[0] = point[0] + 200;
    newPoint[1] = point[1] + 100;

    let newPoints = [...points];
    newPoints.splice(i, 0, newPoint);
    setPoints(newPoints);
  }

  function handleDrag(e) {
    if (handleDraggingIndex === null && guideDraggingIndex === null) {
      return;
    }

    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    // console.log("drag", cursorpt.x, cursorpt.y);

    if (handleDraggingIndex !== null) {
      let newPoints = [...points];

      const SNAP_DISTANCE = 20;

      //horizontals
      let distance = 1000; //
      let snapHGuide = null;

      guideData.forEach(guide => {
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
      guideData.forEach(guide => {
        if (guide[1] === "vLine") {
          const newDistance = Math.abs(guide[0] - cursorpt.x);
          console.log(guide[0], cursorpt.x, newDistance);
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

  function handleControlsGuideChange(value, i) {
    let newGuides = [...guideData];
    newGuides[i][0] = value;
    setGuideData(newGuides);
  }

  const TOOL_FUNCTIONS = {
    none: () => {},
    handle: addHandle,
    hLine: addHGuide,
    vLine: addVGuide,
    gcode: addVGuide
  };

  const viewBoxWidth = 1000;
  const viewBoxHeight = 600;
  const patternBackground = "/pattern.png";
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  return (
    <div
      className="container"
      style={{ border: "thin solid blue" }}
      tabIndex="0"
      onKeyPress={handleKeyPress}
      // contentEditable="true"
    >
      <div className="controls">
        <Controls
          guides={guideData}
          scale={scale}
          onChange={handleControlsGuideChange}
          onScaleChange={setScale}
        />
      </div>
      <svg
        id="svg"
        ref={ref => (svg = ref)}
        viewBox={viewBox}
        className="background-img"
        style={{ border: "thin solid red", height: "90vh" }}
        onClick={TOOL_FUNCTIONS[toolType]}
        onMouseUp={() => {
          setHandleDraggingIndex(null);
          setGuidDraggingIndex(null);
        }}
        onMouseMove={handleDrag}
      >
        <image
          transform="scale(1)"
          href={patternBackground}
          width="100%"
          height="100%"
        />
        <GuideMeasurements
          guideData={guideData}
          width={viewBoxWidth}
          height={viewBoxHeight}
          scale={scale}
        />
        <Guides
          guideData={guideData}
          width={viewBoxWidth}
          height={viewBoxHeight}
          onMouseDown={setGuidDraggingIndex}
        />
        <Path points={points} />
        <Handles
          points={points}
          onDrag={setPoints}
          onMouseDown={setHandleDraggingIndex}
          onClick={handleHandleClick}
        />
      </svg>
    </div>
  );
}
