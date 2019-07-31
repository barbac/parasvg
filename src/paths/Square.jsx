import React, { useState, useRef, useLayoutEffect } from "react";
import { pathDataToPoints } from "../pathDataToPoints.js";
import Handles from "../Handles.jsx";

export function Square() {
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

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const path =
    ` M 0, 0` + //0
    ` H ${width}` + //1
    ` V ${height}` + //2
    ` H 0` + //3
    ` Z`;
  console.log(path);

  const viewBox = `-25 -25 ${width + 40} ${height + 40} `;

  return (
    <div>
      <form>
        <label>
          width {width}
          <input
            min="5"
            max="1000"
            type="range"
            value={width}
            onChange={e => setWidth(e.target.valueAsNumber)}
          />
        </label>
        <label>
          height {height}
          <input
            min="5"
            max="1000"
            type="range"
            value={height}
            onChange={e => setHeight(e.target.valueAsNumber)}
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
