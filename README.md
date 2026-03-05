# Industrial Exhaust Duct Sizing & Balance-by-Design (ACGIH-style)

This project is a **client-side, static web app** for preliminary industrial exhaust duct design using an ACGIH-style velocity pressure workflow.

You can open `index.html` directly in a browser and use it immediately.

## What this V1 does

- Lets you build a system from **Branches** with one or more **Segments**.
- Supports per-segment duct geometry:
  - Round diameter
  - Rectangular width × height with calculated equivalent diameter
- Models hood/entry losses with user-entered coefficients:
  - `h_s = F_s × VP_s`
  - `h_d = F_d × VP_d`
  - `SP_hood = (h_s + h_d) + VP_accel`
- Models duct segment losses in worksheet style:
  - `Duct Loss per VP = friction loss per VP + ΣK`
  - `Duct Loss = (Duct Loss per VP) × VP`
- Supports elbows, branch-entry loss, and custom fittings as `K × VP` terms.
- Computes branch cumulative SP, governing leg, fan SP target basis, and corrected flow output:
  - `Q_corrected = Q_design × sqrt(SP_governing / SP_duct)`
- Performs pressure ratio check at the junction and flags when ratio `> 1.2`.
- Produces a printable engineering calculation chart aligned to ACGIH VP-method worksheet concepts.

## Balance-by-design concept (plain language)

At each common junction, all parallel paths should require similar static pressure.

- The path needing the **highest pressure** is the **governing leg**.
- Other paths are compared against it.
- If one path is much lower than another (`SP_high / SP_low > 1.2`), redesign should be considered.

In this app, the governing leg SP is used as the fan static pressure target basis.

## Coefficients: what are `F` and `K`?

- `F` coefficients are used for hood/entry loss terms.
- `K` coefficients are used for duct fitting losses (elbows, branch entries, special fittings).

These coefficients are highly geometry-specific. V1 asks you to enter them so the math stays transparent and traceable.

## Important limitations and disclaimer

- This tool is for **preliminary engineering support**.
- It is not a replacement for final engineered design, code compliance review, or manufacturer/fan selection checks.
- Any “typical values” shown in the UI are convenience hints only, not exhaustive tables.
- ACGIH table content is not reproduced here; users must provide project-appropriate coefficients from approved references.

## Files

- `index.html` — UI (inputs, results, worksheet chart)
- `styles.css` — layout, print styling
- `app.js` — UI state/actions and rendering
- `calc.js` — **pure calculation functions only**

## Use the app

1. Open `index.html` in a browser.
2. Set density factor.
3. Add/edit branches.
4. Add/edit segments inside each branch.
5. Add/edit fittings (K terms) for each segment.
6. Enter hood coefficients (`F_s`, `F_d`) and VP inputs.
7. Click **Calculate**.
8. Review:
   - Governing leg
   - Fan SP target
   - Ratio check and redesign flag
   - Full engineering calculation chart

## Validation commands

```bash
npm run parse
npm run lint
npm run check:load
```

Run all checks:

```bash
npm run check
```
