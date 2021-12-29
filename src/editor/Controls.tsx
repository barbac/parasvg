import { useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectPattern, setName, setScale } from "./patternSlice";
import BackgroundInput from "./BackgroundInput";
import { Guide } from "./Guides";

interface ControlsProps {
  image: string;
  guides: Guide[];
  onChange: Function;
  onBackgroundSelected: Function;
  onNewAction: Function;
  onSaveAction: Function;
  onLoadAction: Function;
  gcode: string;
  onGcodeAction: Function;
}

export default function Controls({
  image,
  guides,
  onChange,
  onBackgroundSelected,
  onNewAction,
  onSaveAction,
  onLoadAction,
  gcode,
  onGcodeAction,
}: ControlsProps) {
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

  const [imageFileName, setImageFileName] = useState("");
  const dispatch = useAppDispatch();
  const pattern = useAppSelector(selectPattern);

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
          {t("New pattern")}
          <input
            type="button"
            value={t("New pattern") as string}
            onClick={() => onNewAction()}
          />
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
            value={pattern.name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
        </div>
        <div>
          <input
            value={t("Save") as string}
            type="button"
            onClick={() => onSaveAction()}
          />
        </div>
      </div>

      <div>
        <div>{t("Background image url")}</div>
        <div>
          <input
            type="text"
            value={imageFileName}
            onChange={(e) => {
              const value = e.target.value;
              setImageFileName(value);
              onBackgroundSelected(value);
            }}
          />
        </div>
      </div>

      <BackgroundInput
        onChange={(filename, img) => {
          setImageFileName(filename);
          onBackgroundSelected(img);
        }}
      />

      <div>
        <div>{t("Scale")}</div>
        <div>
          <input
            type="number"
            value={pattern.scale}
            onChange={(e) => dispatch(setScale(e.target.valueAsNumber))}
          />
        </div>
      </div>

      <div>{t("Guides")}</div>
      {guideInputs}

      <div>
        <div>{t("gcode")}</div>
        <div>
          <input
            type="button"
            value={t("Generate") as string}
            onClick={() => onGcodeAction()}
          />
        </div>
        <textarea
          value={gcode}
          readOnly={true}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      </div>
    </form>
  );
}
