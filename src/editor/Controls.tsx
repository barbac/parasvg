import { useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  selectPattern,
  setName,
  setScale,
  setGuideLength,
  selectGuides,
} from "./patternSlice";
import BackgroundInput from "./BackgroundInput";
import { ControlsWrapper } from "./ControlsWrapper";
import Parameters from "./Parameters";

interface ControlsProps {
  image: string;
  onBackgroundSelected: Function;
  onNewAction: Function;
  onSaveAction: Function;
  onLoadAction: Function;
  gcode: string;
  onGcodeAction: Function;
  svg: string;
  onSvgAction: Function;
}

export default function Controls({
  image,
  onBackgroundSelected,
  onNewAction,
  onSaveAction,
  onLoadAction,
  gcode,
  onGcodeAction,
  svg,
  onSvgAction,
}: ControlsProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const guides = useAppSelector(selectGuides);
  const guideInputs = guides.map(({ lengthExpresion, label }, i) => {
    if (i < 2) {
      //Don't display origins
      return null;
    }
    return (
      <div key={i}>
        <div>{label || i - 1 /*start counting at 1*/}</div>
        <div>
          <input
            type="text"
            value={lengthExpresion}
            onChange={(e) => {
              const value = {
                length: e.target.value,
                index: i,
              };
              dispatch(setGuideLength(value));
            }}
          />
        </div>
      </div>
    );
  });

  const [imageFileName, setImageFileName] = useState("");
  const pattern = useAppSelector(selectPattern);

  const PATTERN_NAME_PREFIX = "PATTERN:";
  const patternNames = [
    "",
    ...Object.keys(window.localStorage)
      .filter((name) => {
        return !name.indexOf(PATTERN_NAME_PREFIX);
      })
      .map((name) => name.replace(PATTERN_NAME_PREFIX, "")),
  ];

  //hardcoded samples. Move them to a db later
  const sample1Label = "tank top - back - sample";
  if (!window.localStorage.getItem(sample1Label)) {
    patternNames.push(sample1Label);
  }
  const sample2Label = "tank top - front - sample";
  if (!window.localStorage.getItem("tank top - front - sample")) {
    patternNames.push(sample2Label);
  }
  ///

  const options = patternNames.map((name) => (
    <option key={name} value={name}>
      {name}
    </option>
  ));

  return (
    <ControlsWrapper className="controls">
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

        <div>{t("Parameters")}</div>
        <Parameters />

        <div>{t("Guides")}</div>
        {guideInputs}

        <div>
          <div>svg</div>
          <div>
            <input
              type="button"
              value={t("Generate") as string}
              onClick={() => onSvgAction()}
            />
          </div>
          <textarea
            value={svg}
            readOnly={true}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
        </div>

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
    </ControlsWrapper>
  );
}
