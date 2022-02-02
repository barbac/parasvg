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
  const points = pattern.points || [];
  delete pattern.points;
  store.dispatch({ type: "pattern/setPattern", payload: pattern });
  return points;
}

function save(points: any[]) {
  const { pattern } = store.getState();
  if (pattern.name === "") {
    return;
  }
  const _pattern = Object.assign({}, pattern, { points });
  console.log("saving", _pattern);
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
