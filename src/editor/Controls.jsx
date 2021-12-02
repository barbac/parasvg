import React from "react";

export default function Controls({ guides, scale, onChange, onScaleChange }) {
  const guideInputs = guides.map((guide, i) => {
    const value = guide[0].toFixed(2);
    return (
      <div key={i}>
        <div>{i}</div>
        <div>
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.valueAsNumber, i)}
          />
        </div>
      </div>
    );
  });

  const patternNames = ["tank top", "shirt 1", "shirt 2"];
  const options = patternNames.map(name => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  return (
    <form>
      <div>
        <div>Pattern sections</div>
        <div>
          <select>{options}</select>
        </div>
      </div>

      <div>
        <div>Name</div>
        <div>
          <input type="text" />
        </div>
        <div>
          <input
            value="save"
            type="button"
            onClick={() => console.log("saving patthern")}
          />
        </div>
      </div>

      <div>
        <div>Scale</div>
        <div>
          <input
            type="number"
            value={scale}
            onChange={e => onScaleChange(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div>Guides</div>
      {guideInputs}
    </form>
  );
}
