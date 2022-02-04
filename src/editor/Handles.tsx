import { Vertex } from "./points";

interface HandlesProps {
  vertices: Vertex[];
  onMouseDown: Function;
  onClick: Function;
}

const HANDLE_RADIUS = 8;

export default function Handles({
  vertices,
  onMouseDown,
  onClick,
}: HandlesProps) {
  return (
    <>
      {vertices.map(({ x, y, type }, i) => (
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
