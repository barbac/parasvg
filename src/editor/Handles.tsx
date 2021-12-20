import { Handle } from "./points";

interface HandlesProps {
  points: Handle[];
  onMouseDown: Function;
  onClick: Function;
}

export default function Handles({
  points,
  onMouseDown,
  onClick,
}: HandlesProps) {
  return (
    <>
      {points.map(([x, y, type], i) => (
        <g
          key={i}
          className="handle"
          onMouseDown={() => onMouseDown(i)}
          onClick={() => onClick(i)}
        >
          <circle cx={x} cy={y} className={`${i ? type : "start"}`} r="15" />
          <text x={x} y={y}>
            {i}
          </text>
        </g>
      ))}
    </>
  );
}
