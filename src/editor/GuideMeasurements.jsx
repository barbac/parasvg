import React from "react";

export default function GuideMeasurements({ guideData, width, height, scale }) {
  const hGuides = [];
  const vGuides = [];
  guideData.forEach(([pos, guideType]) => {
    if (guideType === "hLine") {
      hGuides.push(pos);
    } else {
      vGuides.push(pos);
    }
  });

  const firstHPoint = hGuides.shift();
  const firstVPoint = vGuides.shift();

  return (
    <React.Fragment>
      {hGuides.map((pos, i) => {
        const distance = Math.abs(pos - firstHPoint);
        const points = {
          x1: width / 2,
          x2: width / 2,
          y1: pos,
          y2: firstHPoint
        };
        //TODO the measurment should go the other way if the firstPoint is shorter (firstHPoint+distance/2)
        return (
          <g className="measurement" key={i + "h"}>
            <line {...points} />
            <text tabIndex={i + 1} x={width / 2} y={firstHPoint - distance / 2}>
              {(distance * scale).toFixed(2)}
            </text>
          </g>
        );
      })}

      {vGuides.map((pos, i) => {
        const distance = Math.abs(pos - firstVPoint);
        const points = {
          x1: firstVPoint,
          x2: pos,
          y1: height / 2,
          y2: height / 2
        };
        //TODO the measurment should go the other way if the firstPoint is shorter (firstHPoint+distance/2)
        return (
          <g className="measurement" key={i + "h"}>
            <line {...points} />
            <text y={height / 2} x={firstVPoint + distance / 2}>
              {(distance * scale).toFixed(2)}
            </text>
          </g>
        );
      })}
    </React.Fragment>
  );
}
