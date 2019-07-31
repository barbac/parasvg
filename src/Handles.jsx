import React from "react";
import { controlTypes } from "./pathDataToPoints.js";

const showCurveControls = true;

export default function Handles({ points }) {
  if (!showCurveControls) {
    points = points.filter(point => point[2] !== controlTypes.control);
  }

  return (
    <React.Fragment>
      {points.map(([x, y, type], i) => (
        <g key={i}>
          <circle cx={x} cy={y} className={`handle ${type}`} r="15" />
          <text x={x} y={y}>
            {i}
          </text>
        </g>
      ))}
    </React.Fragment>
  );
}
