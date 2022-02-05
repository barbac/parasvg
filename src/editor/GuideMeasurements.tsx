import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectGuides, setGuideLabel, setGuidePos } from "./patternSlice";
import { GUIDE_HORIZONTAL } from "./Guides";

const TRIANGLE_LENGTH = 3;
interface GuideMeasurementsProps {
  width: number;
  height: number;
  scale: number;
}

interface InputFieldProps {
  x: number;
  y: number;
  children: React.ReactNode;
  index: number;
  firstPoint: number;
  scale: number;
}

function InputField({
  x,
  y,
  index,
  firstPoint,
  scale,
  children,
}: InputFieldProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const guide = useAppSelector(selectGuides)[index];

  return (
    <g className="measurement" onClick={() => setVisible(!visible)}>
      {children}
      {visible ? (
        <foreignObject width="150" height="1.5em" x={x - 150} y={y - 20}>
          <input
            onClick={(e) => e.stopPropagation()}
            type="text"
            value={guide.label}
            placeholder={t("label")}
            onChange={(e) =>
              dispatch(setGuideLabel({ label: e.target.value, index }))
            }
          />
        </foreignObject>
      ) : (
        <text x={x} y={y}>
          {guide.label}
        </text>
      )}
      {visible && (
        <foreignObject width="100" height="1.5em" x={x + 20} y={y - 20}>
          <input
            onClick={(e) => e.stopPropagation()}
            type="number"
            placeholder={t("value")}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              if (!Number.isNaN(value)) {
                const x = firstPoint + value / scale;
                const y = x;
                dispatch(setGuidePos({ x, y, index }));
              }
            }}
          />
        </foreignObject>
      )}
    </g>
  );
}

export default function GuideMeasurements({
  width,
  height,
  scale,
}: GuideMeasurementsProps) {
  const guides = useAppSelector(selectGuides);
  let hGuides: number[][] = [];
  let vGuides: number[][] = [];
  guides.forEach(({ pos, type }, i) => {
    if (type === GUIDE_HORIZONTAL) {
      hGuides.push([pos, i]);
    } else {
      vGuides.push([pos, i]);
    }
  });

  const firstHPoint: number = hGuides.length ? hGuides.shift()![0] : 0;
  const firstVPoint: number = vGuides.length ? vGuides.shift()![0] : 0;

  return (
    <>
      {hGuides.map(([pos, guideIndex], i) => {
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
          <InputField
            x={x}
            y={textY - 5}
            index={guideIndex}
            firstPoint={firstVPoint}
            scale={scale}
            key={i + "v"}
          >
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
            <text x={x} y={textY + 15}>
              {(distance * scale).toFixed(2)}
            </text>
          </InputField>
        );
      })}

      {vGuides.map(([pos, guideIndex], i) => {
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
          <InputField
            x={textX}
            y={y - 5}
            index={guideIndex}
            firstPoint={firstVPoint}
            scale={scale}
            key={i + "v"}
          >
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
            <text y={y + 15} x={textX}>
              {(distance * scale).toFixed(2)}
            </text>
          </InputField>
        );
      })}
    </>
  );
}
