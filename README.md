# Industrial Ventilation Designer (Diagram-First, ACGIH-style)

This project is a **client-side engineering web app** that upgrades the prior worksheet-first experience into a **diagram-first industrial ventilation design workflow**.

You place hoods, ducts, elbows, branch entries, filters, blast gates, and fan components directly on an isometric canvas. The diagram drives the calculations and automatically generates the engineering worksheet/chart.

## Workflow (Diagram First)

1. Use the **left toolbar** to choose a component tool.
2. Click in the **isometric canvas** to place components.
3. Select and drag components in **Select/Move** mode.
4. Edit selected component details in the **right property panel**.
5. Click **Calculate / Solve** to update:
   - governing leg
   - pressure ratio check
   - corrected-flow outputs
   - fan operating point (if fan mode enabled)
   - full engineering calculation chart

## Interface Overview

- **Top bar**: calculate/solve, settings, advanced lock, print/export, fan summary.
- **Left toolbar**: placement tools (hood, straight duct, elbow, junction, blast gate, fan, filter).
- **Center workspace**: interactive isometric canvas with snap, drag, pan (Shift+drag), and zoom.
- **Right panel**: component-specific property editor with defaults/override status.
- **Bottom panel**: printable engineering calculation chart generated from the model.

## Standards Defaults and Override Locking

The app uses a standards/defaults layer (`Calc.Standards`) for engineering defaults.

- Normal mode: defaults are visible and used as locked standards values.
- Advanced mode: unlocks manual override fields for selected coefficients.
- Value status is shown as:
  - `standards default`
  - `calculated`
  - `manual override`

## Engineering Models Implemented

## 1) Straight Duct Loss (ACGIH-style)

Implemented with:

- `F'_d = a * V^b / Q^c` (per foot)
- `F_d = F'_d * L`
- `h_d = F_d * VP_d`

Material defaults:

- Aluminum / black iron / stainless steel
- Other sheet metal / plastic duct (default)
- Flexible duct, fabric wires covered

The property panel shows intermediate values: `V`, `VP_d`, `F'_d`, `F_d`, `h_d`.

## 2) Elbow Loss

Implemented with:

- `h_el = equivalent90Count * F_el * VP_d`
- `equivalent90Count = totalAngle / 90`

Supports round and rectangular defaults with nearest-match lookup and matched table point reporting.

## 3) Branch Entry Loss

Implemented with:

- `h_en = F_en * VP_d`

Uses nearest-match lookup by branch angle and applies branch entry as a single zero-length branch loss (no regain).

## 4) Hood Model

Implemented with:

- `h_h = F_h * VP_d`
- `SP_h = -(1 + F_h) * VP_d` (with `F_a = 1`)

Outputs include hood flow, face velocity, duct VP, hood loss, and hood static pressure.

## 5) Fan Curve / Operating Point Groundwork

Fan component supports manual curve points `(Q, SP)`.

When fan solver mode is enabled:

- fan SP available is interpolated from curve points
- system resistance model is estimated from governing branch
- operating point is solved where fan SP ≈ required SP
- operating-point flow is used to scale corrected-flow estimates

## Balance-by-Design Outputs

The app preserves and upgrades core balance-by-design concepts:

- cumulative branch static pressure
- governing leg identification
- pressure ratio check (`SP_high / SP_low`, redesign flag if `> 1.2`)
- corrected-flow support:
  - `Q_corrected = Q_design * sqrt(SP_governing / SP_duct)`

## Engineering Calculation Chart

The chart is generated from the diagram model and is printable.

Rows include components such as hoods, straight ducts, elbows, branch entries/junctions, filters, blast gates, and fan lines. It shows intermediate values, losses, cumulative SP, and status/source visibility.

## Files

- `index.html` — application shell and panels
- `styles.css` — professional layout and print styling
- `app.js` — diagram editor UI, state, interactions, rendering
- `calc.js` — standards/defaults + engineering calculation modules

## Run

Open `index.html` directly, or serve statically:

```bash
python3 -m http.server 8080
```

## Validation

```bash
npm run check
```

## Limitations / Disclaimer

- Engineering-support tool for preliminary design and iteration.
- Defaults should be validated against project-specific standards and references.
- Fan/system solver is practical V1 groundwork and should be verified against detailed final design and manufacturer curves.
- Final design responsibility remains with qualified engineering review.
