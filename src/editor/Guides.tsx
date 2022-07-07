import { useAppSelector } from "../app/hooks";
//FIXME: circular dependency prevents importing constants
import { selectGuides } from "./patternSlice";

export type GuideOld = [number, "hLine" | "vLine"];

export const GUIDE_HORIZONTAL = "h";
export const GUIDE_VERTICAL = "v";

export interface Guide {
  type: "h" | "v";
  originIndex: number | null;
  pos: number;
  length: number;
  lengthExpresion: number | string;
  direction: 1 | -1;
  label: string;
}

export interface GuidesProps {
  width: number;
  height: number;
  onMouseDown: Function;
}

export function Guides({ width, height, onMouseDown }: GuidesProps) {
  const guides = useAppSelector(selectGuides);
  return (
    <>
      {guides.map(({ pos, type }, i) => {
        let points = {};
        if (type === GUIDE_HORIZONTAL) {
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
