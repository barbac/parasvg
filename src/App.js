import React from "react";
import "./App.css";
import "./svg.scss";
import * as paths from "./paths.js";

function App() {
  const Path = paths.TankTop;

  return (
    <div className="App">
      <Path />
    </div>
  );
}

export default App;
