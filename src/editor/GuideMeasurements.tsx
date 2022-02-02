import { useAppSelector } from "../app/hooks";
import { selectGuides } from "./patternSlice";
import { GUIDE_HORIZONTAL } from "./Guides";

interface GuideMeasurementsProps {
  width: number;
  height: number;
  scale: number;
}

const TRIANGLE_LENGTH = 3;

export default function GuideMeasurements({
  width,
  height,
  scale,
}: GuideMeasurementsProps) {
  const guides = useAppSelector(selectGuides);
  let hGuides: number[] = [];
  let vGuides: number[] = [];
  guides.forEach(({ pos, type }) => {
    if (type === GUIDE_HORIZONTAL) {
      hGuides.push(pos);
    } else {
      vGuides.push(pos);
    }
  });

  const firstHPoint: number = hGuides.length ? hGuides.shift()! : 0;
  const firstVPoint: number = vGuides.length ? vGuides.shift()! : 0;

  return (
    <>
      {hGuides.map((pos, i) => {
        const distance = Math.abs(pos - firstHPoint);
        const x = (width / (hGuides.length + 1)) * (i + 1);
        const textY = firstHPoint - distance / 2;
        const points = {
          x1: x,
          x2: x,
          y1: pos,
          y2: firstHPoint,
        };
        //TODO the measurment should go the other way if the firstPoint is shorter (firstHPoint+distance/2)
        return (
          <g className="measurement" key={i + "h"}>
            <line {...points} />
            <polyline
              points={`${x},${pos} ${x + TRIANGLE_LENGTH},${
                pos + TRIANGLE_LENGTH
              } ${x - TRIANGLE_LENGTH},${pos + TRIANGLE_LENGTH} ${x},${pos}`}
            />
            <polyline
              points={`${x},${firstHPoint} ${x + TRIANGLE_LENGTH},${
                firstHPoint - TRIANGLE_LENGTH
              } ${x - TRIANGLE_LENGTH},${
                firstHPoint - TRIANGLE_LENGTH
              } ${x},${firstHPoint}`}
            />
            <text x={x} y={textY} onClick={() => console.log("this", x)}>
              {(distance * scale).toFixed(2)}
            </text>
          </g>
        );
      })}

      {vGuides.map((pos, i) => {
        const distance = Math.abs(pos - firstVPoint);
        const y = (height / (vGuides.length + 1)) * (i + 1);
        const textX = firstVPoint + distance / 2;
        const points = {
          x1: firstVPoint,
          x2: pos,
          y1: y,
          y2: y,
        };
        //TODO the measurment should go the other way if the firstPoint is shorter (firstHPoint+distance/2)
        return (
          <g className="measurement" key={i + "v"}>
            <line {...points} />
            <polyline
              points={`${firstVPoint},${y} ${firstVPoint + TRIANGLE_LENGTH},${
                y + TRIANGLE_LENGTH
              } ${firstVPoint + TRIANGLE_LENGTH},${
                y - TRIANGLE_LENGTH
              } ${firstVPoint},${y}`}
            />
            <polyline
              points={`${pos},${y} ${pos - TRIANGLE_LENGTH},${
                y - TRIANGLE_LENGTH
              } ${pos - TRIANGLE_LENGTH},${y + TRIANGLE_LENGTH} ${pos},${y}`}
            />
            <text y={y} x={textX}>
              {(distance * scale).toFixed(2)}
            </text>
          </g>
        );
      })}
    </>
  );
}
