import React from "react";
import BackgroundInput from "./BackgroundInput.tsx";

export default function Controls({
  guides,
  scale,
  patternName,
  onChange,
  onNameChange,
  onScaleChange,
  onBackgroundSelected,
  onNewAction,
  onSaveAction,
  onLoadAction,
}) {
  const guideInputs = guides.map((guide, i) => {
    const value = guide[0].toFixed(2);
    return (
      <div key={i}>
        <div>{i}</div>
        <div>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.valueAsNumber, i)}
          />
        </div>
      </div>
    );
  });

  const patternNames = ["", ...Object.keys(window.localStorage)];
  const options = patternNames.map((name) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  return (
    <form>
      <div>
        <div>
          <input type="button" value="New pattern" onClick={onNewAction} />
        </div>
      </div>

      <div>
        <div>Patterns</div>
        <div>
          <select onChange={(e) => onLoadAction(e.target.value)}>
            {options}
          </select>
        </div>
      </div>

      <div>
        <div>New name</div>
        <div>
          <input
            type="text"
            value={patternName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div>
          <input value="save" type="button" onClick={onSaveAction} />
        </div>
      </div>

      <div>
        <div>Background image url</div>
        <div>
          <input
            type="text"
            value={patternName}
            onChange={(e) => onBackgroundSelected(e.target.value)}
          />
        </div>
      </div>

      <BackgroundInput onChange={onBackgroundSelected} />

      <div>
        <div>Scale</div>
        <div>
          <input
            type="number"
            value={scale}
            onChange={(e) => onScaleChange(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div>Guides</div>
      {guideInputs}
    </form>
  );
}
