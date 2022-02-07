import { useState, useLayoutEffect } from "react";

interface ControlsWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const QUERY_STRING = "screen and (max-device-width: 800px)";
export function ControlsWrapper({ className, children }: ControlsWrapperProps) {
  const [open, setOpen] = useState(true);
  const matches = window.matchMedia(QUERY_STRING).matches;
  useLayoutEffect(() => {
    //This doesn't update after the first render.
    const mediaQuery = window.matchMedia(QUERY_STRING).matches;
    if (mediaQuery) {
      setOpen(false);
    }
  }, [matches]);
  return (
    <div className={className}>
      <button className="toggle-controls" onClick={(e) => setOpen(!open)}>
        {open ? "-" : "o"}
      </button>
      <div style={{ display: open ? "" : "none" }}>{children}</div>
    </div>
  );
}
