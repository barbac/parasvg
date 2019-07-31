export const controlTypes = {
  start: "start",
  end: "end",
  control: "control"
};

export function pathDataToPoints(pathData) {
  console.log("pSelList", pathData, typeof pathData);

  let x = 0;
  let y = 0;
  const points = [];

  for (const segment of pathData) {
    switch (segment.pathSegTypeAsLetter) {
      case "M":
        ({ x, y } = segment);
        points.push([x, y, controlTypes.start, segment.pathSegTypeAsLetter]);
        break;
      case "m":
        x += segment.x;
        y += segment.y;
        points.push([x, y, controlTypes.start, segment.pathSegTypeAsLetter]);
        break;
      case "L":
        ({ x, y } = segment);
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "l":
        x += segment.x;
        y += segment.y;
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "V":
        y = segment.y;
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "v":
        y += segment.y;
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "H":
        x = segment.x;
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "C":
        ({ x, y } = segment);
        points.push([segment.x1, segment.y1, controlTypes.control]);
        points.push([segment.x2, segment.y2, controlTypes.control]);
        points.push([x, y, controlTypes.end, segment.pathSegTypeAsLetter]);
        break;
      case "c":
        const _x = x + segment.x;
        const _y = y + segment.y;
        points.push([segment.x1 + x, segment.y1 + y, controlTypes.control]);
        points.push([segment.x2 + x, segment.y2 + y, controlTypes.control]);
        points.push([_x, _y, controlTypes.end, segment.pathSegTypeAsLetter]);
        x = _x;
        y = _y;
        break;

      default:
        console.log("missing case for segment:", segment.pathSegTypeAsLetter);
        continue;
    }
  }
  return points;
}
