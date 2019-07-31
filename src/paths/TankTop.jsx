import React, { useState, useRef, useLayoutEffect } from "react";
import { pathDataToPoints } from "../pathDataToPoints.js";
import Handles from "../Handles.jsx";

export function TankTop() {
  const firstRender = useRef(true);
  const pathRef = React.createRef();
  let [points, setPoints] = useState([]);

  useLayoutEffect(() => {
    //get the points from the DOM only once.
    if (!firstRender.current) {
      return;
    }

    let _points = pathDataToPoints(pathRef.current.pathSegList);
    console.log("_points", _points);
    firstRender.current = false;
    setPoints(_points);
  }, [pathRef]);
  console.log("points", points);

  const [waist, setWaist] = useState(560);
  const [torso, setTorso] = useState(400);
  // const [armsCyeX, setArmsCyeX] = useState(120);
  // const [armsCyeY, setArmsCyeY] = useState(353.00001);
  const [shoulderToWaist, setShoulderToWaist] = useState(680);
  const [neckWidth, setNeckWidth] = useState(200);
  const [neckHeight, setNeckHeight] = useState(180);

  const width = waist;
  const height = shoulderToWaist;

  const path =
    `M ${waist / 2}, ${shoulderToWaist}` + //0
    `L 0, ${shoulderToWaist}` + //1
    `V ${shoulderToWaist - torso}` + //2
    `C 100, 250 110, 190 ${neckWidth / 1.6}, 30` + //3 4 5
    `L ${waist / 2 - neckWidth / 2}, 0` + //6
    `C ${waist / 2 - neckWidth / 2}, ${neckHeight} ${waist /
      2}, ${neckHeight} ${waist / 2}, ${neckHeight}` + //7 8 9
    `C ${waist / 2}, ${neckHeight} ${waist / 2 +
      neckWidth / 2}, ${neckHeight} ${waist / 2 + neckWidth / 2}, 0` + //10 11 12
    `L ${waist - neckWidth / 1.6}, 30` + //13
    `C ${waist - 110}, 190 ${waist - 100}, 250 ${waist}, ${shoulderToWaist -
      torso}` + //14 15 16
    `V ${shoulderToWaist}` + //17
    `Z`;

  const viewBox = `-25 -25 ${width + 40} ${height + 40} `;

  return (
    <div>
      <form>
        <label>
          waist {waist}
          <input
            min={Number.parseInt(neckWidth * 2.6)}
            max="1700"
            type="range"
            value={waist}
            onChange={e => setWaist(e.target.valueAsNumber)}
          />
        </label>
        <label>
          torso {torso}
          <input
            min={neckHeight}
            max={height - neckWidth}
            type="range"
            value={torso}
            onChange={e => setTorso(e.target.valueAsNumber)}
          />
        </label>
        <label>
          shoulder to waist {shoulderToWaist}
          <input
            min={neckHeight}
            max="1500"
            value={shoulderToWaist}
            type="range"
            onChange={e => setShoulderToWaist(e.target.valueAsNumber)}
          />
        </label>
        <label>
          neck width {neckWidth}
          <input
            min="10"
            max="500"
            type="range"
            value={neckWidth}
            onChange={e => setNeckWidth(e.target.valueAsNumber)}
          />
        </label>
        <label>
          neck height {neckHeight}
          <input
            min="10"
            max="500"
            type="range"
            value={neckHeight}
            onChange={e => setNeckHeight(e.target.valueAsNumber)}
          />
        </label>
      </form>

      <div>
        <svg viewBox={viewBox} style={{ height: "90vh" }} id="svg">
          <rect width={width} height={height} />
          <g stroke="#000" fill="#fff">
            <path
              id="path"
              d={path}
              ref={pathRef}
              stroke="#fff"
              strokeWidth="1"
              strokeOpacity="1"
              opacity="1"
              fillOpacity="0"
            />
            <Handles points={points} />
          </g>
        </svg>
      </div>
    </div>
  );
}
