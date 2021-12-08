import { Bezier } from "bezier-js";

const zSafe = 10;
const zCut = -5;
const feed = 2000;

export default function gcode(points, scale) {
  if (!points.length) {
    return;
  }

  //TODO: set units instad of assuming mm.
  const MM_TO_CM_FACTOR = 10;
  scale *= MM_TO_CM_FACTOR;

  //translate to 0 and flip Y to match common cnc coordinate systems.
  const first = points[0]; //TODO: find the closest point to bot/left
  points = points.map((point) => {
    let newPoint = [...point];
    newPoint[0] = (point[0] - first[0]) * scale;
    newPoint[1] = (point[1] - first[1]) * -scale;
    return newPoint;
  });

  const oldPoints = points;
  points = [...points];
  console.log("generating gcode");

  const firstPoint = points.shift(0);

  let g1s = [];
  // let start = null;
  let control = null;
  points.forEach((point, i) => {
    i += 1; //ZOMG!!!! messedd up is
    if (point[2] === "control") {
      // start = points[i - 1];
      control = point;
      g1s.push(`(control ${i})`);
      return;
    }

    if (control) {
      const bezier = new Bezier(
        // start[0],
        // start[1],
        // control[0],
        // control[1],
        oldPoints[i - 2][0],
        oldPoints[i - 2][1],
        oldPoints[i - 1][0],
        oldPoints[i - 1][1],
        point[0],
        point[1]
      );
      //TODO add steps arg.
      const steps = 30;
      bezier.getLUT(steps).forEach((step) => {
        g1s.push(`G1 X${step.x} Y${step.y} (${i} step)`);
      });
      control = null;
      // start = null;
    } else {
      g1s.push(`G1 X${point[0]} Y${point[1]} (${i})`);
    }
  });

  const gcodeText = `G0 Z${zSafe}
G0 X${firstPoint[0]} Y${firstPoint[1]} (0)
G1 Z${zCut} F${feed}
${g1s.join("\n")}
G0 Z${zSafe}
  `;

  return gcodeText;
}
