export interface Vertex {
  anchor: number | null;
  type: "end" | "control";
  x: number;
  y: number;
}

export function mirrorPoints(vertices: Array<Vertex>) {
  if (vertices.length < 3) {
    return vertices;
  }
  const stopIndex = vertices.length - 1;
  let newVertices: Array<Vertex> = [];
  vertices.forEach((vertex, i) => {
    if (i === stopIndex) {
      return;
    }
    newVertices.push(vertex);
  });

  const yAxis = vertices[stopIndex].x;
  const delta = yAxis * 2;
  for (let i = stopIndex; i >= 0; i--) {
    const vertex = vertices[i];
    const newVertex: Vertex = { ...vertex };
    newVertex.x = delta - vertex.x;
    newVertices.push(newVertex);
  }
  return newVertices;
}

export default mirrorPoints;
