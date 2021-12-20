export type Handle = [number, number, "start" | "end" | "control"];

export function mirrorPoints(points: Array<Handle>) {
  if (points.length < 3) {
    return points;
  }
  const stopIndex = points.length - 1;
  let newPoints: Array<Handle> = [];
  points.forEach((point, i) => {
    if (i === stopIndex) {
      return;
    }
    newPoints.push(point);
  });

  const yAxis = points[stopIndex][0];
  const delta = yAxis * 2;
  for (let i = stopIndex; i >= 0; i--) {
    const point = points[i];
    const newPoint: Handle = [...point];
    newPoint[0] = delta - point[0];
    newPoints.push(newPoint);
  }
  return newPoints;
}

export default mirrorPoints;
