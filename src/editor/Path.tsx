import { Vertex, mirrorPoints } from "./points";

interface PathProps {
  vertices: Vertex[];
  mirror: boolean;
}

export default function Path({ vertices, mirror }: PathProps) {
  if (!vertices.length) {
    return null;
  }

  vertices = mirror ? mirrorPoints(vertices) : vertices;

  let spline = false;
  const commands = vertices.map((vertex, i) => {
    const { x, y } = vertex;
    if (vertex.type === "control") {
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
    `M ${vertices[0].x}, ${vertices[0].y}\n` + commands.join("\n") + " Z";

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
