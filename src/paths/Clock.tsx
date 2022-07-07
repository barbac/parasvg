import { useRef, useState, useLayoutEffect } from "react";
import * as ReactDOMServer from "react-dom/server";
const PI = Math.PI;

const showPencil = true;
const showVCarving = true;
const showMilling = true;
const showHelpers = true;

export function Clock() {
  const diameter = 1000;
  const width = 1000;
  const height = 1000;
  const numberHeight = 111;
  const numberWidth = 83;
  const smallNumberWidth = 33;
  const smallNumberHeight = 45;
  const innerCircleDiameter = 450;
  const mechanismD = 115.5;
  const numberMargin = 30;
  const markingLength = 40;
  const minutsShaftL = 315;

  let [w, setW] = useState(0);
  let [h, setH] = useState(0);
  const textRef = useRef<any>(null);
  const svgRef = useRef<any>(null);
  useLayoutEffect(() => {
    if (!textRef.current) {
      console.log("no ref");
      return;
    }
    const boundingBox = textRef.current.getBoundingClientRect();
    const bbox = textRef.current.getBBox();
    console.log(boundingBox);
    console.log(bbox);
    console.log(textRef.current.getComputedTextLength());
    setW(boundingBox.width);
    setH(boundingBox.height);
  }, []);
  console.log("w", w, h);
  // window.t = textRef;
  // console.log(textRef);

  const radius = diameter / 2;
  const mechanismR = mechanismD / 2;
  const incerCircleRadius = innerCircleDiameter / 2;
  const centerH = width / 2;
  const centerV = height / 2;
  // const rayRadius = (width / 2) * 0.65;
  const rayRadius = (width / 2) * 0.8;
  // const rayRadius = 400;
  const rayStart = (width / 2) * 0.1;

  const sections = 12;
  const rays = [];
  for (let i = 0; i < sections; i++) {
    const cos = Math.cos((PI / (sections / 2)) * i);
    const sin = Math.sin((PI / (sections / 2)) * i);
    //FIXME: wrong m and l
    const x1 = cos * rayStart;
    const y1 = sin * rayStart;
    const x2 = cos * rayRadius;
    const y2 = sin * rayRadius;
    const ray = `M ${centerH},${centerV} m ${x1},${y1} l ${x2}, ${y2}`;
    rays.push(ray);
  }
  // const raysPath = `M ${centerH}, ${centerV}\n${rays.join("\n")}`;

  // const numberWidthHalf = numberWidth / 2;
  // const numberHeightHalf = numberHeight / 2;

  const minutes = 60;
  const digitMarkings = [];
  for (let i = 0; i < minutes; i++) {
    let extra = 0;
    if (!(i % 5)) {
      extra = 20;
    }
    const cos = Math.cos((PI / (minutes / 2)) * i);
    const sin = Math.sin((PI / (minutes / 2)) * i);
    const x1 = cos * (minutsShaftL - markingLength - 10 + extra) + centerH;
    const x2 = cos * (minutsShaftL + markingLength - 10 + extra) + centerH;
    const y1 = sin * (minutsShaftL - markingLength - 10 + extra) + centerV;
    const y2 = sin * (minutsShaftL + markingLength - 10 + extra) + centerV;

    const marking = `M ${x1},${y1} L ${x2}, ${y2}`;
    digitMarkings.push(marking);
  }
  const digitMarkingsPath = `M ${centerH}, ${centerV}\n${digitMarkings.join(
    "\n"
  )}`;

  const numberRects = [];
  const numbersCount = 12;
  for (let i = 0; i < numbersCount; i++) {
    const x =
      Math.cos((PI / (numbersCount / 2)) * i) *
        (radius - numberWidth / 2 - numberMargin) +
      centerH;
    const y =
      Math.sin((PI / (numbersCount / 2)) * i) *
        (radius - numberHeight / 2 - numberMargin) +
      centerV;
    let width = numberWidth;
    let height = numberHeight;
    if (i === 9) {
      width *= 2;
    } else if (i % 3) {
      width = smallNumberWidth;
      height = smallNumberHeight;
    }

    const crossLenght = 15;
    const path = `M ${x - crossLenght / 2} ${y} h ${crossLenght} m ${
      -crossLenght / 2
    } ${-crossLenght / 2} v ${crossLenght}`;

    numberRects.push(
      <g key={i}>
        <rect
          width={width}
          height={height}
          x={x - width / 2}
          y={y - height / 2}
          fill="none"
          stroke="white"
        />
        <path
          d={path}
          stroke="#fff"
          strokeWidth="1"
          strokeOpacity="1"
          opacity="1"
          fillOpacity="0"
        />
      </g>
    );
  }

  // const viewBox = `-25 -25 ${width + 40} ${height + 40} `;
  const viewBox = `0 0 ${width} ${height}`;

  const millingComponents = (
    <g>
      <circle r={radius} cx={centerH} cy={centerV} fill="none" stroke="#fff" />
    </g>
  );

  const vCarvingComponents = (
    <g className="v-carving">
      <circle
        className="inner-circle"
        r={incerCircleRadius}
        cx={centerH}
        cy={centerV}
        fill="none"
        stroke="#fff"
      />
      <circle
        className="mechanism-circle"
        r={mechanismR}
        cx={centerH}
        cy={centerV}
        fill="none"
        stroke="#fff"
      />
      {/*
      <path
        d={raysPath}
        stroke="#fff"
        strokeWidth="1"
        strokeOpacity="1"
        opacity="1"
        fillOpacity="0"
      />
      */}
      <path
        className="digit-markings"
        d={digitMarkingsPath}
        stroke="skyblue"
        strokeWidth="2"
        strokeOpacity="1"
      />
    </g>
  );

  const layerAttributes = {
    // "inkscape:groupmode": "layer",
    // id: "layer1",
    // "inkscape:label": "Layer 1",
    // "sodipodi:insensitive": "true",
  };
  const pencilComponents = (
    <g {...layerAttributes} className="pencil">
      {numberRects}
    </g>
  );

  const textStyle = {
    fontSize: `${numberHeight}px`,
    fill: "LightSteelBlue",
  };
  const helpers = (
    <g>
      <text
        className="number"
        style={textStyle}
        x={radius * 2 - 113}
        y={centerV + 35}
        ref={textRef}
        textLength={`${numberWidth}px`}
        lengthAdjust="spacingAndGlyphs"
      >
        0
      </text>
      <path
        className="minute-hand"
        d={`M ${centerH},${centerV} m -40,0 l 40,315 l 40,-315 z`}
        stroke="#fff"
        fill="white"
        fillOpacity=".25"
      />
      <path
        className="hour-hand"
        d={`M ${centerH},${centerV} m 0,-40 l 240,40 l -240,40 z`}
        stroke="#fff"
        fill="white"
        fillOpacity=".25"
      />
    </g>
  );

  const svg = (
    <svg viewBox={viewBox} style={{ height: "100vh" }} id="svg" ref={svgRef}>
      <rect width={width} height={height} data-visual="1" />

      {showMilling && millingComponents}
      {showVCarving && vCarvingComponents}
      {showPencil && pencilComponents}
      {showHelpers && helpers}
    </svg>
  );

  return (
    <div
      onClick={() => {
        console.log(ReactDOMServer.renderToStaticMarkup(svg));
      }}
    >
      {svg}
    </div>
  );
}
