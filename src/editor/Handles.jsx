import React from "react";
import { controlTypes } from "./pathDataToPoints.js";

const showCurveControls = true;

export default function Handles({ points, onMouseDown, onClick }) {
  if (!showCurveControls) {
    points = points.filter((point) => point[2] !== controlTypes.control);
  }

  return (
    <React.Fragment>
      {points.map(([x, y, type], i) => (
        <g
          key={i}
          className="handle"
          onMouseDown={() => onMouseDown(i)}
          onClick={() => onClick(i)}
        >
          <circle cx={x} cy={y} className={`${i ? type : "start"}`} r="15" />
          <text x={x} y={y}>
            {i}
          </text>
        </g>
      ))}
    </React.Fragment>
  );
}
