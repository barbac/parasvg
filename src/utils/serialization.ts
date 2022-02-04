import { store } from "../app/store";

const PATTERN_NAME_PREFIX = "PATTERN:";

function load(name: string) {
  console.log("loading...");
  const patternString = window.localStorage.getItem(PATTERN_NAME_PREFIX + name);
  if (!patternString) {
    console.log(`pattern: ${name} not found`, name);
    return;
  }
  const pattern = JSON.parse(patternString);
  console.log(pattern);
  store.dispatch({ type: "pattern/setPattern", payload: pattern });
}

function save() {
  const pattern = store.getState().pattern.present;
  if (pattern.name === "") {
    return;
  }
  console.log("saving", pattern);
  window.localStorage.setItem(
    PATTERN_NAME_PREFIX + pattern.name,
    JSON.stringify(pattern)
  );
}

const functions = {
  load,
  save,
};
export default functions;
