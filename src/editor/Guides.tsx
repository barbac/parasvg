export type Guide = [number, "hLine" | "vLine"];

interface GuidesProps {
  guideData: Guide[];
  width: number;
  height: number;
  onMouseDown: Function;
}

export default function Guides({
  guideData,
  width,
  height,
  onMouseDown,
}: GuidesProps) {
  return (
    <>
      {guideData.map(([pos, guideType], i) => {
        let points = {};
        if (guideType === "hLine") {
          points = {
            x1: 0,
            x2: width,
            y1: pos,
            y2: pos,
          };
        } else {
          points = {
            x1: pos,
            x2: pos,
            y1: 0,
            y2: height,
          };
        }

        return (
          <g className="guide" onMouseDown={() => onMouseDown(i)} key={i}>
            <line {...points} className="hover" />
            <line {...points} />
          </g>
        );
      })}
    </>
  );
}
