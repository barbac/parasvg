# parasvg

Use react to create parameterizable svg files.

# Features
This is kind of like a CAD application.

* Use horizontal and vertical guides to snap vertices.
* Use math expressions with guides and other parameters to calculate positions.
* Export grbl/marlin compatible gcode for a 3 axis or a specialized 4 axis(end effector rotates on the Z axis at the start of a curve) CNC machine.
* Background images for reference.
* Undo/redo functionality
* Multi language. English and Spanish for now.

## Demo
https://barbac.github.io/parasvg/


### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production in the `build` directory.<br>

### TODO
* Dynamic ui to create non guide parameters.
* Print as PDF.
* SVG export.
* Button to invert background colors. Try reading the pixels directly to auto invert them.
* Delete handles
* Insert handles between other handles.

### Known issues
* Changing a parameter's label should update all expressions.
* Setting the scale to 0, messes up all the expressions.
* Saving doesn't update list of patterns. This is just a display bug
* UI gets messy with many guides. Some fade out or similar functionally would help.
