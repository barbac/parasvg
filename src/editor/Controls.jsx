import i18n from "i18next";
import { useTranslation } from "react-i18next";
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
  gcode,
  onGcodeAction,
}) {
  const { t } = useTranslation();
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
        <input
          type="button"
          value="English"
          onClick={() => i18n.changeLanguage("en")}
        />
        <input
          type="button"
          value="Español"
          onClick={() => i18n.changeLanguage("es")}
        />
      </div>

      <div>
        <div>
          <input type="button" value={t("New pattern")} onClick={onNewAction} />
        </div>
      </div>

      <div>
        <div>{t("Patterns")}</div>
        <div>
          <select onChange={(e) => onLoadAction(e.target.value)}>
            {options}
          </select>
        </div>
      </div>

      <div>
        <div>{t("New name")}</div>
        <div>
          <input
            type="text"
            value={patternName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div>
          <input value={t("Save")} type="button" onClick={onSaveAction} />
        </div>
      </div>

      <div>
        <div>{t("Background image url")}</div>
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
        <div>{t("Scale")}</div>
        <div>
          <input
            type="number"
            value={scale}
            onChange={(e) => onScaleChange(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div>{t("Guides")}</div>
      {guideInputs}

      <div>
        <div>{t("gcode")}</div>
        <div>
          <input type="button" value={t("Generate")} onClick={onGcodeAction} />
        </div>
        <textarea
          value={gcode}
          readOnly={true}
          onClick={(e) => e.target.select()}
        />
      </div>
    </form>
  );
}
