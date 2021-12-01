import React, { useState, useRef, useLayoutEffect } from "react";
import { pathDataToPoints } from "../pathDataToPoints.js";
import Handles from "../Handles.jsx";

function Controls({ onChange }) {
  let options = {
    waist: 560,
    torso: 400,
    // armsCyeX: 120,
    // armsCyeY: 353.00001,
    shoulderToWaist: 680,
    neckWidth: 200,
    neckHeight: 180
  };
  let controls = [];
  for (const option in options) {
    const value = options[option];

    controls.push(
      <div className="controls">
        <label key={option}>
          <div>
            <div>{value}</div>
            <div>
              <input
                min="10"
                max="1700"
                type="range"
                value={value}
                onChange={element => {
                  const newValue = element.target.valueAsNumber;
                  const newOptions = Object.assign({}, options, {
                    [option]: newValue
                  });
                  onChange(newOptions);
                }}
              />
            </div>
          </div>
          <div>{option}</div>
        </label>
      </div>
    );
  }
  return controls;
}

const default_values = {
  waist: 560,
  torso: 400,
  // armsCyeX: 120,
  // armsCyeY: 353.00001,
  shoulderToWaist: 680,
  neckWidth: 200,
  neckHeight: 180
};

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

  const [options, setOptions] = useState(default_values);
  // const [waist, setWaist] = useState(560);
  // const [torso, setTorso] = useState(400);
  // const [armsCyeX, setArmsCyeX] = useState(120);
  // const [armsCyeY, setArmsCyeY] = useState(353.00001);
  // const [shoulderToWaist, setShoulderToWaist] = useState(680);
  // const [neckWidth, setNeckWidth] = useState(200);
  // const [neckHeight, setNeckHeight] = useState(180);

  const { waist, torso, shoulderToWaist, neckWidth, neckHeight } = options;

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
    <div className="container">
      <form>
        <Controls options={options} onChange={setOptions} />
        <input
          value="reset"
          type="button"
          onClick={() => setOptions(default_values)}
        />
      </form>

      <div className="svg-container">
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
