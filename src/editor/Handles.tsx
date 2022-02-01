import { Handle } from "./points";

interface HandlesProps {
  points: Handle[];
  onMouseDown: Function;
  onClick: Function;
}

const HANDLE_RADIUS = 8;

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
          <circle
            cx={x}
            cy={y}
            className={`${i ? type : "start"}`}
            r={HANDLE_RADIUS}
          />
          <text x={x - HANDLE_RADIUS / 2} y={y + HANDLE_RADIUS / 2}>
            {i}
          </text>
        </g>
      ))}
    </>
  );
}
