import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectToolMode, setToolState } from "./toolsSlice";
import { toggleMirror, selectMirror } from "./patternSlice";
import { useTranslation } from "react-i18next";

interface BaseButtonProps {
  title: string;
  tool: string;
  toolMode: string;
  onClick: Function;
}
const BUTTON_LENGHT = 25;

interface ButtonProps extends BaseButtonProps {
  children: React.ReactNode;
}
function Button({ title, tool, toolMode, onClick, children }: ButtonProps) {
  return (
    <button
      title={title}
      className={toolMode === tool ? "active" : ""}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}

interface SvgPathButtonProps extends BaseButtonProps {
  path: string;
}

function SvgPathButton({ path, ...props }: SvgPathButtonProps) {
  return (
    <Button {...props}>
      <svg width={BUTTON_LENGHT} height={BUTTON_LENGHT}>
        <path d={path} fillOpacity="0%" />
      </svg>
    </Button>
  );
}

const MOVE_PATH = `M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z`;
const HANDLE_PATH = `M6,0 Q30,20 6,25`;
const MIRROR_PATH = `M0,0 Q25,20 0,25 M25,0 Q0,20 25,25`;

export default function ToolBox() {
  const dispatch = useAppDispatch();
  const mirror = useAppSelector(selectMirror);
  const toolMode = useAppSelector(selectToolMode);
  const { t } = useTranslation();

  return (
    <div className="toolbox">
      <Button
        title={t("Move")}
        onClick={() => dispatch(setToolState("move"))}
        tool="move"
        toolMode={toolMode}
      >
        <svg viewBox="0 0 320 512" width="25" height="25">
          <path d={MOVE_PATH} />
        </svg>
      </Button>

      <SvgPathButton
        path="M10,0 V20"
        tool="vguide"
        toolMode={toolMode}
        title={t("Vertical guide")}
        onClick={() => dispatch(setToolState("vguide"))}
      />

      <SvgPathButton
        path="M0,10 H20"
        tool="hguide"
        toolMode={toolMode}
        title={t("Horizontal guide")}
        onClick={() => dispatch(setToolState("hguide"))}
      />

      <Button
        title={t("Add vertex")}
        onClick={() => dispatch(setToolState("handle"))}
        tool="handle"
        toolMode={toolMode}
      >
        <svg width={BUTTON_LENGHT} height={BUTTON_LENGHT}>
          <circle
            cx={BUTTON_LENGHT / 2}
            cy={BUTTON_LENGHT / 2}
            r={BUTTON_LENGHT * 0.25}
            fill="#000"
          />
        </svg>
      </Button>

      <SvgPathButton
        title={t("Convert to curve")}
        onClick={() => dispatch(setToolState("curve"))}
        path={HANDLE_PATH}
        tool="curve"
        toolMode={toolMode}
      />

      <SvgPathButton
        title={t("Mirror")}
        onClick={() => dispatch(toggleMirror())}
        path={MIRROR_PATH}
        tool="mirror"
        toolMode={mirror ? "mirror" : ""}
      />
    </div>
  );
}
