import { Bezier } from "bezier-js";
import { Vertex } from "../editor/points";

const zSafe = 10;
const zCut = -5;
const feed = 2000;

export default function gcode(vertices: Vertex[], scale: number) {
  if (!vertices.length) {
    return "";
  }

  //TODO: set units instad of assuming mm.
  const MM_TO_CM_FACTOR = 10;
  scale *= MM_TO_CM_FACTOR;

  //translate to 0 and flip Y to match common cnc coordinate systems.
  const first = vertices[0]; //TODO: find the closest point to bot/left
  vertices = vertices.map((vertex: Vertex) => {
    let newVertex: Vertex = { ...vertex };
    newVertex.x = (vertex.x - first.x) * scale;
    newVertex.y = (vertex.y - first.y) * -scale;
    return newVertex;
  });

  const oldVertices = vertices;
  vertices = [...vertices];
  console.log("generating gcode");

  const firstPoint = vertices.shift();
  if (!firstPoint) {
    return ""; // keeps ts happy
  }

  let g1Commands: string[] = [];
  // let start = null;
  let control: Vertex | null = null;
  vertices.forEach((vertex, i) => {
    i += 1; //ZOMG!!!! messedd up i's
    if (vertex.type === "control") {
      // start = vertices[i - 1];
      control = vertex;
      g1Commands.push(`(control ${i})`);
      return;
    }

    if (control) {
      const bezier = new Bezier(
        oldVertices[i - 2].x,
        oldVertices[i - 2].y,
        oldVertices[i - 1].x,
        oldVertices[i - 1].y,
        vertex.x,
        vertex.y
      );
      //TODO add steps arg.
      const steps = 30;
      bezier.getLUT(steps).forEach((step) => {
        g1Commands.push(`G1 X${step.x} Y${step.y} (${i} step)`);
      });
      control = null;
      // start = null;
    } else {
      g1Commands.push(`G1 X${vertex.x} Y${vertex.y} (${i})`);
    }
  });

  const gcodeText = `G0 Z${zSafe}
G0 X${firstPoint.x} Y${firstPoint.y} (0)
G1 Z${zCut} F${feed}
${g1Commands.join("\n")}
G0 Z${zSafe}
  `;

  return gcodeText;
}
