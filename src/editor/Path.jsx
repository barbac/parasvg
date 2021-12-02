import React from "react";

export default function Path({ points }) {
  if (!points.length) {
    return null;
  }

  let spline = false;
  const commands = points.map((point, i) => {
    const [x, y] = point;
    if (point[2] === "control") {
      spline = true;
      return `Q ${x},${y}`;
    } else {
      if (spline) {
        spline = false;
        return ` ${x}, ${y}`;
      }
      return `L ${x}, ${y}`;
    }
  });

  const path =
    `M ${points[0][0]}, ${points[0][1]}\n` + commands.join("\n") + " Z";

  return (
    <path
      className="path"
      d={path}
      stroke="LightSkyBlue"
      strokeWidth="1"
      strokeOpacity="1"
      opacity="1"
      fillOpacity="0"
    />
  );
}
