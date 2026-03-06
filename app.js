const state = {
  densityFactor: 1,
  branches: [
    {
      id: 'B1',
      name: 'Branch B1',
      description: 'Main hood leg',
      designCfm: 1800,
      hood: { slotVp: 0.45, fs: 0.75, fd: 1, accelMode: 1 },
      segments: [
        {
          id: 'B1-S1',
          description: 'Hood to first elbow',
          shape: 'round',
          diameterIn: 16,
          widthIn: 24,
          heightIn: 12,
          cfm: 1800,
          lengthFt: 25,
          frictionMode: 'direct',
          frictionLossPerVp: 0.65,
          frictionFactor: 0.02,
          elbowCount: 1,
          elbowK: 0.35,
          hasBranchEntry: false,
          branchEntryK: 0,
          fittings: [{ id: 'F1', name: 'Blast gate', k: 0.2 }],
          otherLossInWg: 0
        }
      ]
    },
    {
      id: 'B2',
      name: 'Branch B2',
      description: 'Secondary hood leg',
      designCfm: 1400,
      hood: { slotVp: 0.32, fs: 0.6, fd: 1, accelMode: 0 },
      segments: [
        {
          id: 'B2-S1',
          description: 'Hood to junction',
          shape: 'rectangular',
          diameterIn: 14,
          widthIn: 20,
          heightIn: 12,
          cfm: 1400,
          lengthFt: 35,
          frictionMode: 'darcy',
          frictionLossPerVp: 0.5,
          frictionFactor: 0.02,
          elbowCount: 2,
          elbowK: 0.3,
          hasBranchEntry: true,
          branchEntryK: 0.25,
          fittings: [{ id: 'F2', name: 'Transition', k: 0.12 }],
          otherLossInWg: 0.08
        }
      ]
    }
  ]
};

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function format(value, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}


function getValue(container, field, fallback = '') {
  const input = container.querySelector(`[data-field="${field}"]`);
  return input ? input.value : fallback;
}

function getChecked(container, field, fallback = false) {
  const input = container.querySelector(`[data-field="${field}"]`);
  return input ? input.checked : fallback;
}

function updateStateFromDom() {
  state.densityFactor = num(document.getElementById('densityFactor').value, 1);

  const branchEls = Array.from(document.querySelectorAll('[data-branch-index]'));
  branchEls.forEach((branchEl) => {
    const bIdx = num(branchEl.dataset.branchIndex);
    const branch = state.branches[bIdx];
    if (!branch) {
      return;
    }

    branch.name = getValue(branchEl, 'name');
    branch.description = getValue(branchEl, 'description');
    branch.designCfm = num(getValue(branchEl, 'designCfm'), 0);
    branch.hood.slotVp = num(getValue(branchEl, 'hood-slotVp'), 0);
    branch.hood.fs = num(getValue(branchEl, 'hood-fs'), 0);
    branch.hood.fd = num(getValue(branchEl, 'hood-fd'), 0);
    branch.hood.accelMode = num(getValue(branchEl, 'hood-accelMode'), 0);

    const segmentEls = Array.from(branchEl.querySelectorAll('[data-segment-index]'));
    segmentEls.forEach((segmentEl) => {
      const sIdx = num(segmentEl.dataset.segmentIndex);
      const segment = branch.segments[sIdx];
      if (!segment) {
        return;
      }

      segment.description = getValue(segmentEl, 'description');
      segment.shape = getValue(segmentEl, 'shape', 'round');
      segment.diameterIn = num(getValue(segmentEl, 'diameterIn'), 0);
      segment.widthIn = num(getValue(segmentEl, 'widthIn'), 0);
      segment.heightIn = num(getValue(segmentEl, 'heightIn'), 0);
      segment.cfm = num(getValue(segmentEl, 'cfm'), 0);
      segment.lengthFt = num(getValue(segmentEl, 'lengthFt'), 0);
      segment.frictionMode = getValue(segmentEl, 'frictionMode', 'lossPerVp');
      segment.frictionLossPerVp = num(getValue(segmentEl, 'frictionLossPerVp'), 0);
      segment.frictionFactor = num(getValue(segmentEl, 'frictionFactor'), 0.02);
      segment.elbowCount = num(getValue(segmentEl, 'elbowCount'), 0);
      segment.elbowK = num(getValue(segmentEl, 'elbowK'), 0);
      segment.hasBranchEntry = getChecked(segmentEl, 'hasBranchEntry', false);
      segment.branchEntryK = num(getValue(segmentEl, 'branchEntryK'), 0);
      segment.otherLossInWg = num(getValue(segmentEl, 'otherLossInWg'), 0);

      const fittingEls = Array.from(segmentEl.querySelectorAll('[data-fitting-index]'));
      fittingEls.forEach((fitEl) => {
        const fIdx = num(fitEl.dataset.fittingIndex);
        const fitting = segment.fittings[fIdx];
        if (!fitting) {
          return;
        }
        fitting.name = getValue(fitEl, 'fit-name');
        fitting.k = num(getValue(fitEl, 'fit-k'), 0);
      });
    });
  });
}
function addBranch() {
  const n = state.branches.length + 1;
  state.branches.push({
    id: `B${n}`,
    name: `Branch B${n}`,
    description: '',
    designCfm: 1000,
    hood: { slotVp: 0.25, fs: 0.6, fd: 1, accelMode: 0 },
    segments: [
      {
        id: `B${n}-S1`,
        description: '',
        shape: 'round',
        diameterIn: 12,
        widthIn: 18,
        heightIn: 10,
        cfm: 1000,
        lengthFt: 20,
        frictionMode: 'direct',
        frictionLossPerVp: 0.5,
        frictionFactor: 0.02,
        elbowCount: 0,
        elbowK: 0.35,
        hasBranchEntry: false,
        branchEntryK: 0,
        fittings: [],
        otherLossInWg: 0
      }
    ]
  });
  renderInputs();
}

function renderInputs() {
  const root = document.getElementById('branchEditor');
  root.innerHTML = '';

  state.branches.forEach((branch, bIdx) => {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch-block';
    branchDiv.dataset.branchIndex = bIdx;

    const segmentsHtml = branch.segments
      .map((segment, sIdx) => {
        const fittingsHtml = segment.fittings
          .map(
            (fit, fIdx) => `
            <div class="fitting-row" data-fitting-index="${fIdx}">
              <input data-field="fit-name" value="${fit.name}" placeholder="Fitting name" />
              <input data-field="fit-k" type="number" value="${fit.k}" step="0.01" placeholder="K" />
              <button class="danger" data-action="remove-fitting" data-branch-index="${bIdx}" data-segment-index="${sIdx}" data-fitting-index="${fIdx}">Remove fitting</button>
            </div>`
          )
          .join('');

        return `
          <details class="segment-block" open data-segment-index="${sIdx}">
            <summary>${segment.id} — ${segment.description || 'Segment'}</summary>
            <div class="grid three-col">
              <label>Description<input data-field="description" value="${segment.description}" /></label>
              <label>Shape
                <select data-field="shape">
                  <option value="round" ${segment.shape === 'round' ? 'selected' : ''}>Round</option>
                  <option value="rectangular" ${segment.shape === 'rectangular' ? 'selected' : ''}>Rectangular</option>
                </select>
              </label>
              <label>Flow (cfm)<input data-field="cfm" type="number" value="${segment.cfm}" /></label>
              <label>Diameter (in, round)<input data-field="diameterIn" type="number" value="${segment.diameterIn}" /></label>
              <label>Width (in, rectangular)<input data-field="widthIn" type="number" value="${segment.widthIn}" /></label>
              <label>Height (in, rectangular)<input data-field="heightIn" type="number" value="${segment.heightIn}" /></label>
              <label>Straight Length (ft)<input data-field="lengthFt" type="number" value="${segment.lengthFt}" /></label>
              <label>Friction Mode
                <select data-field="frictionMode">
                  <option value="direct" ${segment.frictionMode === 'direct' ? 'selected' : ''}>Direct Loss/VP</option>
                  <option value="darcy" ${segment.frictionMode === 'darcy' ? 'selected' : ''}>Darcy-Weisbach</option>
                </select>
              </label>
              <label>Friction Loss/VP<input data-field="frictionLossPerVp" type="number" step="0.01" value="${segment.frictionLossPerVp}" /></label>
              <label>Darcy f<input data-field="frictionFactor" type="number" step="0.001" value="${segment.frictionFactor}" /></label>
              <label>Elbow Count<input data-field="elbowCount" type="number" value="${segment.elbowCount}" /></label>
              <label>Elbow K (each)<input data-field="elbowK" type="number" step="0.01" value="${segment.elbowK}" /></label>
              <label>Branch Entry K<input data-field="branchEntryK" type="number" step="0.01" value="${segment.branchEntryK}" /></label>
              <label class="checkbox-label">Has Branch Entry
                <input data-field="hasBranchEntry" type="checkbox" ${segment.hasBranchEntry ? 'checked' : ''} />
              </label>
              <label>Other losses (in.wg)<input data-field="otherLossInWg" type="number" step="0.01" value="${segment.otherLossInWg}" /></label>
            </div>
            <div class="fittings-wrap">
              <strong>Special Fittings (K × VP)</strong>
              ${fittingsHtml || '<p class="muted">No fittings added for this segment.</p>'}
              <button data-action="add-fitting" data-branch-index="${bIdx}" data-segment-index="${sIdx}">+ Add Fitting</button>
              <button class="danger" data-action="remove-segment" data-branch-index="${bIdx}" data-segment-index="${sIdx}">Remove Segment</button>
            </div>
          </details>
        `;
      })
      .join('');

    branchDiv.innerHTML = `
      <h3>${branch.id}</h3>
      <div class="grid two-col">
        <label>Branch Name<input data-field="name" value="${branch.name}" /></label>
        <label>Description<input data-field="description" value="${branch.description}" /></label>
        <label>Design Flow (cfm)<input data-field="designCfm" type="number" value="${branch.designCfm}" /></label>
      </div>
      <h4>Hood / Entry (ACGIH style)</h4>
      <div class="grid four-col">
        <label>Slot VP, VP_s (in.wg)<input data-field="hood-slotVp" type="number" step="0.01" value="${branch.hood.slotVp}" /></label>
        <label>F_s<input data-field="hood-fs" type="number" step="0.01" value="${branch.hood.fs}" /></label>
        <label>F_d<input data-field="hood-fd" type="number" step="0.01" value="${branch.hood.fd}" /></label>
        <label>Accel Mode (0/1)
          <select data-field="hood-accelMode">
            <option value="0" ${Number(branch.hood.accelMode) === 0 ? 'selected' : ''}>0 (use duct VP)</option>
            <option value="1" ${Number(branch.hood.accelMode) === 1 ? 'selected' : ''}>1 (use higher VP)</option>
          </select>
        </label>
      </div>
      <div class="tip-row">
        <small>Typical coefficient presets (not exhaustive): plain opening F_s≈0.5, flanged entry F_d≈0.2–0.5, abrupt entry F_d≈1.0. Verify with project references.</small>
      </div>
      ${segmentsHtml}
      <div class="actions-inline">
        <button data-action="add-segment" data-branch-index="${bIdx}">+ Add Segment</button>
        <button class="danger" data-action="remove-branch" data-branch-index="${bIdx}">Remove Branch</button>
      </div>
    `;
    root.appendChild(branchDiv);
  });
}

function renderResults(system) {
  document.getElementById('governingLeg').textContent = system.governingLegId;
  document.getElementById('fanSp').textContent = `${format(system.fanSpTarget)} in.wg`;
  document.getElementById('totalFlow').textContent = `${format(system.totalFlow, 0)} cfm`;

  const junction = system.junctions[0];
  document.getElementById('ratio').textContent = format(junction.pressureRatio, 3);
  const flag = document.getElementById('ratioFlag');
  flag.textContent = junction.redesignRecommended ? 'Redesign recommended (>1.2)' : 'Acceptable (≤1.2)';
  flag.className = junction.redesignRecommended ? 'flag bad' : 'flag good';
}

function chartRows(system) {
  const rows = [];
  system.branches.forEach((branch) => {
    rows.push(`<tr class="section-row"><td colspan="18">${branch.id} — Hood Section</td></tr>`);
    rows.push(`<tr>
      <td>${branch.id}</td><td>HOOD</td><td>Hood/Entry</td><td>${format(branch.totalFlow, 0)}</td>
      <td>—</td><td>—</td><td>—</td><td>${format(branch.hood.ductVp)}</td><td>${format(branch.hood.slotVp)}</td>
      <td>${format(branch.hood.fs, 2)}</td><td>${format(branch.hood.fd, 2)}</td><td>${format(branch.hood.slotLoss)}</td>
      <td>${format(branch.hood.ductLoss)}</td><td>${format(branch.hood.vpAccel)}</td><td>${format(branch.hood.hoodSp)}</td>
      <td>${format(branch.hood.hoodSp)}</td><td>—</td><td>—</td>
    </tr>`);

    branch.segments.forEach((seg) => {
      rows.push(`<tr>
        <td>${branch.id}</td>
        <td>${seg.id}</td>
        <td>${seg.description}</td>
        <td>${format(seg.flow, 0)}</td>
        <td>${seg.geometry.geometryLabel}</td>
        <td>${format(seg.geometry.eqDiameterIn, 2)}</td>
        <td>${format(seg.velocity, 1)}</td>
        <td>${format(seg.vp)}</td>
        <td>—</td>
        <td>${format(seg.lengthFt, 1)}</td>
        <td>${format(seg.frictionPerVp, 3)}</td>
        <td>${format(seg.elbowLossPerVp, 3)}</td>
        <td>${format(seg.branchEntryLossPerVp, 3)}</td>
        <td>${format(seg.fittingsLossPerVp, 3)}</td>
        <td>${format(seg.ductLossPerVp, 3)}</td>
        <td>${format(seg.ductLoss, 3)}</td>
        <td>${format(seg.segmentLoss, 3)}</td>
        <td>${format(seg.cumulativeSp, 3)}</td>
      </tr>`);
    });
  });

  const j = system.junctions[0];
  rows.push(`<tr class="section-row"><td colspan="18">Junction ${j.id} — Governing SP ${format(j.governingSp)} in.wg, Ratio ${format(j.pressureRatio)} (${j.redesignRecommended ? 'Redesign recommended' : 'OK'})</td></tr>`);
  j.paths.forEach((path) => {
    rows.push(`<tr>
      <td>${path.branchId}</td>
      <td>JUNC</td>
      <td>${path.branchName}</td>
      <td>${path.isGoverning ? 'Governing' : 'Non-governing'}</td>
      <td colspan="4">SP_duct: ${format(path.spDuct)} in.wg</td>
      <td colspan="5">Q_corrected = Q_design × √(SP_governing/SP_duct)</td>
      <td colspan="5">Q_corrected: ${format(path.correctedFlow, 1)} cfm</td>
    </tr>`);
  });

  return rows.join('');
}

function calculateAndRender() {
  updateStateFromDom();
  const system = window.Calc.computeSystem(state);
  renderResults(system);
  document.getElementById('calcChartBody').innerHTML = chartRows(system);
}

document.getElementById('addBranch').addEventListener('click', () => {
  updateStateFromDom();
  addBranch();
});

document.getElementById('calculate').addEventListener('click', calculateAndRender);

document.getElementById('branchEditor').addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (!action) {
    return;
  }
  updateStateFromDom();

  const bIdx = num(event.target.dataset.branchIndex);
  const sIdx = num(event.target.dataset.segmentIndex);
  const fIdx = num(event.target.dataset.fittingIndex);

  if (action === 'remove-branch') {
    state.branches.splice(bIdx, 1);
  }

  if (action === 'add-segment' && state.branches[bIdx]) {
    const next = state.branches[bIdx].segments.length + 1;
    state.branches[bIdx].segments.push({
      id: `${state.branches[bIdx].id}-S${next}`,
      description: '',
      shape: 'round',
      diameterIn: 10,
      widthIn: 18,
      heightIn: 10,
      cfm: state.branches[bIdx].designCfm,
      lengthFt: 20,
      frictionMode: 'direct',
      frictionLossPerVp: 0.4,
      frictionFactor: 0.02,
      elbowCount: 0,
      elbowK: 0.35,
      hasBranchEntry: false,
      branchEntryK: 0,
      fittings: [],
      otherLossInWg: 0
    });
  }

  if (action === 'remove-segment' && state.branches[bIdx]) {
    state.branches[bIdx].segments.splice(sIdx, 1);
  }

  if (action === 'add-fitting' && state.branches[bIdx] && state.branches[bIdx].segments[sIdx]) {
    state.branches[bIdx].segments[sIdx].fittings.push({ id: uid('fit'), name: 'Custom fitting', k: 0.1 });
  }

  if (action === 'remove-fitting' && state.branches[bIdx] && state.branches[bIdx].segments[sIdx]) {
    state.branches[bIdx].segments[sIdx].fittings.splice(fIdx, 1);
  }

  renderInputs();
  calculateAndRender();
});

renderInputs();
calculateAndRender();
