const appState = {
  settings: {
    densityFactor: 1,
    advancedUnlocked: false,
    fanCurveEnabled: false
  },
  ui: {
    tool: 'select',
    selectedId: null,
    panX: 0,
    panY: 0,
    zoom: 1,
    isPanning: false,
    dragId: null,
    dragOffset: { x: 0, y: 0 }
  },
  model: {
    components: [
      {
        id: 'H1', type: 'hood', label: 'Hood 1', branchId: 'B1', order: 1,
        position: { x: 120, y: 120, z: 0 },
        rotation: 30,
        props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, hoodType: 'plainOpening', openingAreaFt2: 4 },
        overrides: { enableFh: false, fh: null }
      },
      {
        id: 'D1', type: 'straightDuct', label: 'Duct B1-1', branchId: 'B1', order: 2,
        position: { x: 220, y: 170, z: 0 },
        rotation: 30,
        props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, lengthFt: 45, material: 'otherSheetMetalPlastic' },
        overrides: { enableABC: false, a: null, b: null, c: null }
      },
      {
        id: 'E1', type: 'elbow', label: 'Elbow B1', branchId: 'B1', order: 3,
        position: { x: 350, y: 230, z: 0 },
        rotation: 60,
        props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, geometry: 'round', elbowType: 'stamped', angleDeg: 90, rd: 1.5, wd: 1 },
        overrides: { enableFel: false, fel: null }
      },
      {
        id: 'J1', type: 'junction', label: 'Branch Entry B1', branchId: 'B1', order: 4,
        position: { x: 470, y: 300, z: 0 },
        rotation: 0,
        props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, branchAngleDeg: 45 },
        overrides: { enableFen: false, fen: null }
      },
      {
        id: 'H2', type: 'hood', label: 'Hood 2', branchId: 'B2', order: 1,
        position: { x: 140, y: 300, z: 20 },
        rotation: 30,
        props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400, hoodType: 'flanged', openingAreaFt2: 3.5 },
        overrides: { enableFh: false, fh: null }
      },
      {
        id: 'D2', type: 'straightDuct', label: 'Duct B2-1', branchId: 'B2', order: 2,
        position: { x: 250, y: 340, z: 20 },
        rotation: 30,
        props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400, lengthFt: 40, material: 'otherSheetMetalPlastic' },
        overrides: { enableABC: false, a: null, b: null, c: null }
      },
      {
        id: 'BG1', type: 'blastGate', label: 'Blast Gate B2', branchId: 'B2', order: 3,
        position: { x: 360, y: 390, z: 20 },
        rotation: 0,
        props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400 },
        overrides: { enableK: false, k: null }
      },
      {
        id: 'J2', type: 'junction', label: 'Branch Entry B2', branchId: 'B2', order: 4,
        position: { x: 470, y: 300, z: 0 },
        rotation: 0,
        props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400, branchAngleDeg: 35 },
        overrides: { enableFen: false, fen: null }
      },
      {
        id: 'F1', type: 'filter', label: 'Collector Filter', branchId: 'MAIN', order: 1,
        position: { x: 590, y: 340, z: 0 },
        rotation: 0,
        props: { shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200 },
        overrides: { dropInWg: null }
      },
      {
        id: 'FN1', type: 'fan', label: 'Exhaust Fan', branchId: 'MAIN', order: 2,
        position: { x: 750, y: 380, z: 0 },
        rotation: 0,
        props: {
          shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200,
          curvePoints: [{ q: 2500, sp: 7.2 }, { q: 3200, sp: 6.1 }, { q: 4000, sp: 4.8 }]
        },
        overrides: {}
      }
    ]
  },
  results: null
};

const svg = document.getElementById('isoCanvas');
const viewportGroup = document.getElementById('viewportGroup');

function idFor(type) {
  const count = appState.model.components.filter((c) => c.type === type).length + 1;
  return `${type.slice(0, 2).toUpperCase()}${count}`;
}

function isoToScreen(position) {
  const x = position.x - position.y;
  const y = (position.x + position.y) * 0.5 - position.z;
  return { x, y };
}

function screenToIso(x, y, z = 0) {
  const isoX = y + x / 2;
  const isoY = y - x / 2;
  return { x: isoX, y: isoY, z };
}

function snapIso(point, step = 20) {
  return {
    x: Math.round(point.x / step) * step,
    y: Math.round(point.y / step) * step,
    z: Math.round(point.z / 10) * 10
  };
}

function updateViewportTransform() {
  viewportGroup.setAttribute('transform', `translate(${appState.ui.panX} ${appState.ui.panY}) scale(${appState.ui.zoom}) translate(600 190)`);
}

function drawGrid() {
  const gridLayer = document.getElementById('gridLayer');
  gridLayer.innerHTML = '';
  const path = [];
  for (let i = -800; i <= 800; i += 40) {
    path.push(`M ${i} -600 L ${i + 1200} 0`);
    path.push(`M ${i} 600 L ${i - 1200} 0`);
  }
  for (let i = -600; i <= 600; i += 40) {
    path.push(`M -1200 ${i} L 1200 ${i}`);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', path.join(' '));
  p.setAttribute('stroke', '#e6edf5');
  p.setAttribute('stroke-width', '1');
  p.setAttribute('fill', 'none');
  gridLayer.appendChild(p);
}

function componentColor(type) {
  const palette = {
    hood: '#1a7f5a', straightDuct: '#2d5c89', elbow: '#366694', junction: '#7a5f2e', blastGate: '#7f3d3d', fan: '#673ab7', filter: '#8a6f1f'
  };
  return palette[type] || '#2d5c89';
}

function componentGlyph(type) {
  if (type === 'hood') {
    return 'M -16 10 L 16 10 L 10 -10 L -10 -10 z';
  }
  if (type === 'straightDuct') {
    return 'M -24 -8 L 24 -8 L 24 8 L -24 8 z';
  }
  if (type === 'elbow') {
    return 'M -16 10 A 18 18 0 0 1 10 -16 L 16 -10 A 26 26 0 0 0 -10 16 z';
  }
  if (type === 'junction') {
    return 'M 0 -16 L 14 8 L -14 8 z';
  }
  if (type === 'blastGate') {
    return 'M -18 -10 L 18 -10 L 18 10 L -18 10 z M -10 -14 L 10 14';
  }
  if (type === 'fan') {
    return 'M 0 -16 A 16 16 0 1 1 -0.1 -16 z M -3 0 L 10 4 L -4 10 z';
  }
  if (type === 'filter') {
    return 'M -18 -12 L 18 -12 L 18 12 L -18 12 z M -12 -12 L -6 12 M 0 -12 L 6 12 M 12 -12 L 18 12';
  }
  return 'M -10 -10 L 10 -10 L 10 10 L -10 10 z';
}

function drawConnections() {
  const layer = document.getElementById('connectionLayer');
  layer.innerHTML = '';
  const byBranch = {};
  appState.model.components.forEach((component) => {
    if (!byBranch[component.branchId]) {
      byBranch[component.branchId] = [];
    }
    byBranch[component.branchId].push(component);
  });

  Object.values(byBranch).forEach((branch) => {
    branch.sort((a, b) => a.order - b.order);
    for (let i = 0; i < branch.length - 1; i += 1) {
      const a = isoToScreen(branch[i].position);
      const b = isoToScreen(branch[i + 1].position);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('class', 'connection');
      line.setAttribute('d', `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
      layer.appendChild(line);
    }
  });
}

function drawComponents() {
  const layer = document.getElementById('componentLayer');
  layer.innerHTML = '';

  appState.model.components.forEach((component) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `component ${appState.ui.selectedId === component.id ? 'selected' : ''}`);
    g.dataset.id = component.id;
    const pos = isoToScreen(component.position);
    g.setAttribute('transform', `translate(${pos.x} ${pos.y}) rotate(${component.rotation || 0})`);

    const glyph = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glyph.setAttribute('class', 'glyph');
    glyph.setAttribute('d', componentGlyph(component.type));
    glyph.setAttribute('fill', 'white');
    glyph.setAttribute('stroke', componentColor(component.type));
    glyph.setAttribute('stroke-width', '2');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '20');
    label.setAttribute('y', '-14');
    label.setAttribute('class', 'flow-tag');
    label.textContent = `${component.label} (${component.branchId})`;

    g.appendChild(glyph);
    g.appendChild(label);
    layer.appendChild(g);
  });
}

function renderCanvas() {
  drawGrid();
  drawConnections();
  drawComponents();
  updateViewportTransform();
}

function renderToolButtons() {
  document.querySelectorAll('.tool').forEach((button) => {
    button.classList.toggle('active', button.dataset.tool === appState.ui.tool);
  });
}

function getSelectedComponent() {
  return appState.model.components.find((component) => component.id === appState.ui.selectedId) || null;
}

function badge(status) {
  const cls = status === 'manual override' ? 'override' : status === 'calculated' ? 'calc' : 'default';
  return `<span class="badge ${cls}">${status}</span>`;
}

function renderPropertyPanel() {
  const selected = getSelectedComponent();
  const selectionMeta = document.getElementById('selectionMeta');
  const form = document.getElementById('propertyForm');

  if (!selected) {
    selectionMeta.textContent = 'No component selected.';
    form.innerHTML = '<p>Select a component on the isometric canvas to edit properties.</p>';
    return;
  }

  selectionMeta.innerHTML = `<strong>${selected.label}</strong><br/>Type: ${window.Calc.componentTypeLabel(selected.type)} • Branch: ${selected.branchId} • ID: ${selected.id}`;
  const lock = !appState.settings.advancedUnlocked;
  const result = appState.results?.worksheetRows.find((row) => row.id === selected.id)?.details;

  let specific = '';
  if (selected.type === 'straightDuct') {
    const mats = window.Calc.Standards.straightDuct.materials;
    specific = `
      <label>Material
        <select data-prop="material">
          ${Object.keys(mats).map((k) => `<option value="${k}" ${selected.props.material === k ? 'selected' : ''}>${mats[k].label}</option>`).join('')}
        </select>
      </label>
      <label>Length (ft)<input type="number" data-prop="lengthFt" value="${selected.props.lengthFt || 0}" /></label>
      <label>Enable a/b/c Override
        <input type="checkbox" data-override-flag="enableABC" ${selected.overrides.enableABC ? 'checked' : ''} ${lock ? 'disabled' : ''}/>
      </label>
      <label>a<input type="number" step="0.0001" data-override="a" value="${selected.overrides.a ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <label>b<input type="number" step="0.001" data-override="b" value="${selected.overrides.b ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <label>c<input type="number" step="0.001" data-override="c" value="${selected.overrides.c ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `V=${result.velocity.toFixed(1)}, VP=${result.vp.toFixed(4)}, F'=${result.fdPrime.toFixed(6)}, F=${result.fd.toFixed(4)}, h_d=${result.loss.toFixed(4)}` : ''}</div>
    `;
  } else if (selected.type === 'elbow') {
    specific = `
      <label>Geometry
        <select data-prop="geometry">
          <option value="round" ${selected.props.geometry === 'round' ? 'selected' : ''}>Round</option>
          <option value="rectangular" ${selected.props.geometry === 'rectangular' ? 'selected' : ''}>Rectangular</option>
        </select>
      </label>
      <label>Elbow Type
        <select data-prop="elbowType">
          ${['stamped','fivePiece','fourPiece','threePiece','mitered','miteredTurningVanes','flatback'].map((k)=>`<option value="${k}" ${selected.props.elbowType===k?'selected':''}>${k}</option>`).join('')}
        </select>
      </label>
      <label>Angle (deg)<input type="number" data-prop="angleDeg" value="${selected.props.angleDeg || 90}" /></label>
      <label>R/D<input type="number" step="0.01" data-prop="rd" value="${selected.props.rd || 1}" /></label>
      <label>W/D<input type="number" step="0.01" data-prop="wd" value="${selected.props.wd || 1}" /></label>
      <label>Enable F_el Override <input type="checkbox" data-override-flag="enableFel" ${selected.overrides.enableFel ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_el override<input type="number" step="0.01" data-override="fel" value="${selected.overrides.fel ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `matched=${result.matched || '-'}, eq90=${result.equivalent90?.toFixed(3) || '-'}, h_el=${result.loss.toFixed(4)}` : ''}</div>
    `;
  } else if (selected.type === 'junction') {
    specific = `
      <label>Branch Angle (deg)<input type="number" data-prop="branchAngleDeg" value="${selected.props.branchAngleDeg || 45}" /></label>
      <label>Enable F_en Override <input type="checkbox" data-override-flag="enableFen" ${selected.overrides.enableFen ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_en override<input type="number" step="0.01" data-override="fen" value="${selected.overrides.fen ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `matched angle=${result.matchedAngle || '-'}, h_en=${result.loss.toFixed(4)}` : ''}</div>
    `;
  } else if (selected.type === 'hood') {
    specific = `
      <label>Hood Type
        <select data-prop="hoodType">
          ${Object.keys(window.Calc.Standards.hood.types).map((k)=>`<option value="${k}" ${selected.props.hoodType===k?'selected':''}>${k}</option>`).join('')}
        </select>
      </label>
      <label>Opening Area (ft²)<input type="number" step="0.01" data-prop="openingAreaFt2" value="${selected.props.openingAreaFt2 || 0}" /></label>
      <label>Enable F_h Override <input type="checkbox" data-override-flag="enableFh" ${selected.overrides.enableFh ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_h override<input type="number" step="0.01" data-override="fh" value="${selected.overrides.fh ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `V_face=${result.faceVelocity.toFixed(1)}, VP_d=${result.vp.toFixed(4)}, F_a=${result.fa}, F_h=${result.fh.toFixed(3)}, h_h=${result.hH.toFixed(4)}, SP_h=${result.spH.toFixed(4)}` : ''}</div>
    `;
  } else if (selected.type === 'fan') {
    const pts = selected.props.curvePoints.map((p) => `${p.q}:${p.sp}`).join(', ');
    specific = `
      <label>Fan Curve Points (q:sp comma-separated)
        <textarea data-prop="curvePointsText" rows="3">${pts}</textarea>
      </label>
      <div class="selection-meta">Operating point: ${appState.results?.operatingPoint ? `${appState.results.operatingPoint.q.toFixed(1)} cfm @ ${appState.results.operatingPoint.sp.toFixed(3)} in.wg` : 'Not solved'}</div>
    `;
  } else if (selected.type === 'filter') {
    specific = `
      <label>Filter ΔSP override (in.wg)
        <input type="number" step="0.01" data-override="dropInWg" value="${selected.overrides.dropInWg ?? ''}" ${lock ? 'disabled' : ''}/>
      </label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `h_filter=${result.loss.toFixed(4)}` : ''}</div>
    `;
  } else if (selected.type === 'blastGate') {
    specific = `
      <label>Enable K Override <input type="checkbox" data-override-flag="enableK" ${selected.overrides.enableK ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>K override<input type="number" step="0.01" data-override="k" value="${selected.overrides.k ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${badge(result?.status || 'standards default')} ${result ? `h_gate=${result.loss.toFixed(4)}` : ''}</div>
    `;
  }

  form.innerHTML = `
    <div class="property-grid" data-selected-form="${selected.id}">
      <label>Label<input data-prop="label" value="${selected.label}" /></label>
      <label>Branch ID<input data-prop="branchId" value="${selected.branchId}" /></label>
      <label>Order<input type="number" data-prop="order" value="${selected.order}" /></label>
      <label>Flow (cfm)<input type="number" data-prop="cfm" value="${selected.props.cfm || 0}" /></label>
      <label>Shape
        <select data-prop="shape">
          <option value="round" ${selected.props.shape === 'round' ? 'selected' : ''}>Round</option>
          <option value="rectangular" ${selected.props.shape === 'rectangular' ? 'selected' : ''}>Rectangular</option>
        </select>
      </label>
      <label>Diameter (in)<input type="number" data-prop="diameterIn" value="${selected.props.diameterIn || 0}" /></label>
      <label>Width (in)<input type="number" data-prop="widthIn" value="${selected.props.widthIn || 0}" /></label>
      <label>Height (in)<input type="number" data-prop="heightIn" value="${selected.props.heightIn || 0}" /></label>
      <label>Iso X<input type="number" data-position="x" value="${selected.position.x}" /></label>
      <label>Iso Y<input type="number" data-position="y" value="${selected.position.y}" /></label>
      <label>Elevation Z<input type="number" data-position="z" value="${selected.position.z}" /></label>
      <label>Rotation<input type="number" data-prop="rotation" value="${selected.rotation || 0}" /></label>
      ${specific}
    </div>
  `;
}

function calcAndRender() {
  appState.results = window.Calc.computeSystem(appState.model, appState.settings);
  document.getElementById('chartBody').innerHTML = window.Calc.formatChartRows(appState.results);

  const summary = document.getElementById('resultSummary');
  summary.innerHTML = `
    <div class="result-card"><h4>Governing Leg</h4><p>${appState.results.governingLegId}</p></div>
    <div class="result-card"><h4>Governing SP</h4><p>${appState.results.governingSp.toFixed(3)} in.wg</p></div>
    <div class="result-card"><h4>Pressure Ratio</h4><p>${appState.results.pressureRatio.toFixed(3)} ${appState.results.redesign ? '⚠️' : '✅'}</p></div>
    <div class="result-card"><h4>Total Design Flow</h4><p>${appState.results.totalFlowDesign.toFixed(1)} cfm</p></div>
  `;

  const fanSummary = document.getElementById('fanSummary');
  if (appState.results.operatingPoint) {
    fanSummary.textContent = `Fan OP: ${appState.results.operatingPoint.q.toFixed(1)} cfm @ ${appState.results.operatingPoint.sp.toFixed(3)} in.wg`;
  } else {
    fanSummary.textContent = `Fan summary: Governing SP ${appState.results.governingSp.toFixed(3)} in.wg`;
  }

  renderPropertyPanel();
  renderCanvas();
}

function addComponentAt(tool, isoPoint) {
  const component = {
    id: idFor(tool),
    type: tool,
    label: `${window.Calc.componentTypeLabel(tool)} ${idFor(tool)}`,
    branchId: 'B1',
    order: appState.model.components.length + 1,
    position: snapIso(isoPoint),
    rotation: 0,
    props: {
      shape: 'round',
      diameterIn: 12,
      widthIn: 18,
      heightIn: 10,
      cfm: 1200,
      lengthFt: 20,
      material: 'otherSheetMetalPlastic',
      angleDeg: 90,
      rd: 1,
      wd: 1,
      elbowType: 'stamped',
      branchAngleDeg: 45,
      hoodType: 'plainOpening',
      openingAreaFt2: 4,
      curvePoints: [{ q: 2000, sp: 7 }, { q: 3200, sp: 5.6 }]
    },
    overrides: { enableABC: false, enableFel: false, enableFen: false, enableFh: false, enableK: false, a: null, b: null, c: null, fel: null, fen: null, fh: null, k: null, dropInWg: null }
  };
  appState.model.components.push(component);
  appState.ui.selectedId = component.id;
  calcAndRender();
}

function pointerToSvg(event) {
  const rect = svg.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * 1200;
  const y = (event.clientY - rect.top) / rect.height * 760;
  const worldX = (x - 600 - appState.ui.panX) / appState.ui.zoom;
  const worldY = (y - 190 - appState.ui.panY) / appState.ui.zoom;
  return { x: worldX, y: worldY };
}

svg.addEventListener('click', (event) => {
  const targetComponent = event.target.closest('.component');
  if (targetComponent) {
    appState.ui.selectedId = targetComponent.dataset.id;
    renderCanvas();
    renderPropertyPanel();
    return;
  }

  if (appState.ui.tool !== 'select') {
    const pt = pointerToSvg(event);
    const iso = screenToIso(pt.x, pt.y, 0);
    addComponentAt(appState.ui.tool, iso);
  }
});

svg.addEventListener('mousedown', (event) => {
  if (event.shiftKey) {
    appState.ui.isPanning = true;
    appState.ui.dragOffset = { x: event.clientX - appState.ui.panX, y: event.clientY - appState.ui.panY };
    return;
  }

  const targetComponent = event.target.closest('.component');
  if (appState.ui.tool === 'select' && targetComponent) {
    appState.ui.dragId = targetComponent.dataset.id;
    const selected = appState.model.components.find((c) => c.id === appState.ui.dragId);
    if (!selected) {
      return;
    }
    const pt = pointerToSvg(event);
    const current = isoToScreen(selected.position);
    appState.ui.dragOffset = { x: current.x - pt.x, y: current.y - pt.y };
  }
});

window.addEventListener('mousemove', (event) => {
  if (appState.ui.isPanning) {
    appState.ui.panX = event.clientX - appState.ui.dragOffset.x;
    appState.ui.panY = event.clientY - appState.ui.dragOffset.y;
    updateViewportTransform();
    return;
  }

  if (!appState.ui.dragId) {
    return;
  }

  const component = appState.model.components.find((c) => c.id === appState.ui.dragId);
  if (!component) {
    return;
  }
  const pt = pointerToSvg(event);
  const target = { x: pt.x + appState.ui.dragOffset.x, y: pt.y + appState.ui.dragOffset.y };
  const iso = snapIso(screenToIso(target.x, target.y, component.position.z));
  component.position.x = iso.x;
  component.position.y = iso.y;
  renderCanvas();
});

window.addEventListener('mouseup', () => {
  appState.ui.dragId = null;
  appState.ui.isPanning = false;
});

svg.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.08 : 0.08;
  appState.ui.zoom = Math.min(2.2, Math.max(0.45, appState.ui.zoom + delta));
  updateViewportTransform();
});

document.getElementById('toolButtons').addEventListener('click', (event) => {
  const button = event.target.closest('[data-tool]');
  if (!button) {
    return;
  }
  appState.ui.tool = button.dataset.tool;
  renderToolButtons();
});

document.getElementById('propertyForm').addEventListener('input', (event) => {
  const selected = getSelectedComponent();
  if (!selected) {
    return;
  }

  const target = event.target;
  if (target.dataset.prop) {
    const key = target.dataset.prop;
    if (key === 'label') {
      selected.label = target.value;
    } else if (key === 'branchId') {
      selected.branchId = target.value || 'MAIN';
    } else if (key === 'order') {
      selected.order = Number(target.value) || 1;
    } else if (key === 'rotation') {
      selected.rotation = Number(target.value) || 0;
    } else if (key === 'curvePointsText') {
      selected.props.curvePoints = target.value.split(',').map((p) => {
        const [q, sp] = p.split(':').map((v) => Number(v.trim()));
        return { q: Number.isFinite(q) ? q : 0, sp: Number.isFinite(sp) ? sp : 0 };
      }).filter((p) => p.q > 0);
    } else if (['cfm','diameterIn','widthIn','heightIn','lengthFt','angleDeg','rd','wd','branchAngleDeg','openingAreaFt2'].includes(key)) {
      selected.props[key] = Number(target.value) || 0;
    } else {
      selected.props[key] = target.value;
    }
  }

  if (target.dataset.position) {
    const key = target.dataset.position;
    selected.position[key] = Number(target.value) || 0;
  }

  if (target.dataset.override) {
    const key = target.dataset.override;
    selected.overrides[key] = target.value === '' ? null : Number(target.value);
  }

  if (target.dataset.overrideFlag) {
    selected.overrides[target.dataset.overrideFlag] = target.checked;
  }

  calcAndRender();
});

document.getElementById('calculateBtn').addEventListener('click', calcAndRender);
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('settingsBtn').addEventListener('click', () => document.getElementById('settingsPanel').classList.toggle('hidden'));
document.getElementById('toggleAdvancedBtn').addEventListener('click', () => {
  appState.settings.advancedUnlocked = !appState.settings.advancedUnlocked;
  document.getElementById('toggleAdvancedBtn').textContent = `Advanced: ${appState.settings.advancedUnlocked ? 'Unlocked' : 'Locked'}`;
  renderPropertyPanel();
  calcAndRender();
});

document.getElementById('densityFactorInput').addEventListener('input', (event) => {
  appState.settings.densityFactor = Number(event.target.value) || 1;
  calcAndRender();
});
document.getElementById('fanModeInput').addEventListener('change', (event) => {
  appState.settings.fanCurveEnabled = event.target.checked;
  calcAndRender();
});

calcAndRender();
renderToolButtons();
