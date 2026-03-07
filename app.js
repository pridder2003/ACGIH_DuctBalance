const appState = {
  settings: {
    densityFactor: 1,
    advancedUnlocked: false,
    fanCurveEnabled: false
  },
  ui: {
    tool: 'select',
    selected: null,
    panX: 0,
    panY: 0,
    zoom: 1,
    isPanning: false,
    dragRef: null,
    dragOffset: { x: 0, y: 0 },
    drawStartNodeId: null,
    previewPoint: null
  },
  model: {
    nodes: [
      { id: 'N-H1', type: 'hood', label: 'Hood 1', branchId: 'B1', position: { x: 100, y: 120, z: 0 }, props: { hoodType: 'plainOpening', openingAreaFt2: 4, shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800 }, overrides: { enableFh: false, fh: null } },
      { id: 'N-E1', type: 'elbow', label: 'Elbow 1', branchId: 'B1', position: { x: 260, y: 200, z: 0 }, props: { geometry: 'round', elbowType: 'stamped', angleDeg: 90, rd: 1.5, wd: 1, shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800 }, overrides: { enableFel: false, fel: null } },
      { id: 'N-J1', type: 'junction', label: 'Junction 1', branchId: 'B1', position: { x: 460, y: 290, z: 0 }, props: { branchAngleDeg: 45, shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800 }, overrides: { enableFen: false, fen: null } },
      { id: 'N-H2', type: 'hood', label: 'Hood 2', branchId: 'B2', position: { x: 130, y: 290, z: 20 }, props: { hoodType: 'flanged', openingAreaFt2: 3.5, shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400 }, overrides: { enableFh: false, fh: null } },
      { id: 'N-BG1', type: 'blastGate', label: 'Blast Gate', branchId: 'B2', position: { x: 330, y: 365, z: 20 }, props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400 }, overrides: { enableK: false, k: null } },
      { id: 'N-J2', type: 'junction', label: 'Junction 2', branchId: 'B2', position: { x: 460, y: 290, z: 0 }, props: { branchAngleDeg: 35, shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400 }, overrides: { enableFen: false, fen: null } },
      { id: 'N-F1', type: 'filter', label: 'Filter', branchId: 'MAIN', position: { x: 580, y: 340, z: 0 }, props: { shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200 }, overrides: { dropInWg: null } },
      { id: 'N-FN1', type: 'fan', label: 'Fan', branchId: 'MAIN', position: { x: 740, y: 370, z: 0 }, props: { shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200, curvePoints: [{ q: 2500, sp: 7.2 }, { q: 3200, sp: 6.1 }, { q: 4000, sp: 4.8 }] }, overrides: {} }
    ],
    edges: [
      { id: 'D-B1-1', type: 'straightDuct', label: 'B1-Run1', branchId: 'B1', order: 2, from: 'N-H1', to: 'N-E1', props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, material: 'otherSheetMetalPlastic', lengthFt: 45, startElevation: 0, endElevation: 0 }, overrides: { enableABC: false, a: null, b: null, c: null } },
      { id: 'D-B1-2', type: 'straightDuct', label: 'B1-Run2', branchId: 'B1', order: 3, from: 'N-E1', to: 'N-J1', props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1800, material: 'otherSheetMetalPlastic', lengthFt: 52, startElevation: 0, endElevation: 0 }, overrides: { enableABC: false, a: null, b: null, c: null } },
      { id: 'D-B2-1', type: 'straightDuct', label: 'B2-Run1', branchId: 'B2', order: 2, from: 'N-H2', to: 'N-BG1', props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400, material: 'otherSheetMetalPlastic', lengthFt: 42, startElevation: 20, endElevation: 20 }, overrides: { enableABC: false, a: null, b: null, c: null } },
      { id: 'D-B2-2', type: 'straightDuct', label: 'B2-Run2', branchId: 'B2', order: 3, from: 'N-BG1', to: 'N-J2', props: { shape: 'rectangular', diameterIn: 10, widthIn: 20, heightIn: 12, cfm: 1400, material: 'otherSheetMetalPlastic', lengthFt: 38, startElevation: 20, endElevation: 0 }, overrides: { enableABC: false, a: null, b: null, c: null } },
      { id: 'D-M1', type: 'straightDuct', label: 'Main-1', branchId: 'MAIN', order: 1, from: 'N-J1', to: 'N-F1', props: { shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200, material: 'otherSheetMetalPlastic', lengthFt: 30, startElevation: 0, endElevation: 0 }, overrides: { enableABC: false, a: null, b: null, c: null } },
      { id: 'D-M2', type: 'straightDuct', label: 'Main-2', branchId: 'MAIN', order: 2, from: 'N-F1', to: 'N-FN1', props: { shape: 'round', diameterIn: 16, widthIn: 20, heightIn: 12, cfm: 3200, material: 'otherSheetMetalPlastic', lengthFt: 28, startElevation: 0, endElevation: 0 }, overrides: { enableABC: false, a: null, b: null, c: null } }
    ]
  },
  results: null
};

const svg = document.getElementById('isoCanvas');
const viewportGroup = document.getElementById('viewportGroup');

function idFor(prefix, list) {
  const index = list.length + 1;
  return `${prefix}${index}`;
}

function n(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isoToScreen(position) {
  return {
    x: position.x - position.y,
    y: (position.x + position.y) * 0.5 - position.z
  };
}

function screenToIso(x, y, z = 0) {
  return { x: y + x / 2, y: y - x / 2, z };
}

function dist2(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function format(value, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function screenPtFromEvent(event) {
  const rect = svg.getBoundingClientRect();
  const sx = ((event.clientX - rect.left) / rect.width) * 1200;
  const sy = ((event.clientY - rect.top) / rect.height) * 760;
  const x = (sx - 600 - appState.ui.panX) / appState.ui.zoom;
  const y = (sy - 190 - appState.ui.panY) / appState.ui.zoom;
  return { x, y };
}

function nearestNode(screenPt, maxRadius = 18) {
  let best = null;
  let bestD2 = Infinity;
  appState.model.nodes.forEach((node) => {
    const p = isoToScreen(node.position);
    const d = dist2(screenPt, p);
    if (d < bestD2) {
      bestD2 = d;
      best = node;
    }
  });
  return bestD2 <= maxRadius * maxRadius ? best : null;
}

function allowedDirections() {
  const cos60 = Math.cos(Math.PI / 3);
  const sin60 = Math.sin(Math.PI / 3);
  return [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: cos60, y: sin60 },
    { x: -cos60, y: -sin60 },
    { x: cos60, y: -sin60 },
    { x: -cos60, y: sin60 }
  ];
}

function constrainToCadDirections(startScreen, currentScreen) {
  const v = { x: currentScreen.x - startScreen.x, y: currentScreen.y - startScreen.y };
  const dirs = allowedDirections();
  let best = dirs[0];
  let bestProj = -Infinity;
  dirs.forEach((dir) => {
    const proj = v.x * dir.x + v.y * dir.y;
    if (proj > bestProj) {
      bestProj = proj;
      best = dir;
    }
  });

  const length = Math.max(0, bestProj);
  return { x: startScreen.x + best.x * length, y: startScreen.y + best.y * length };
}

function updateViewportTransform() {
  viewportGroup.setAttribute('transform', `translate(${appState.ui.panX} ${appState.ui.panY}) scale(${appState.ui.zoom}) translate(600 190)`);
}

function drawGrid() {
  const layer = document.getElementById('gridLayer');
  layer.innerHTML = '';
  const pathData = [];
  for (let i = -900; i <= 900; i += 50) {
    pathData.push(`M ${i} -680 L ${i + 1300} -30`);
    pathData.push(`M ${i} 680 L ${i - 1300} 30`);
  }
  for (let j = -680; j <= 680; j += 50) {
    pathData.push(`M -1300 ${j} L 1300 ${j}`);
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData.join(' '));
  path.setAttribute('stroke', '#edf2f7');
  path.setAttribute('stroke-width', '0.9');
  path.setAttribute('fill', 'none');
  layer.appendChild(path);
}

function nodeSymbol(node, connectedVector) {
  if (node.type === 'hood') {
    return '<polygon points="-18,9 18,9 10,-9 -10,-9" class="hood-shape" />';
  }
  if (node.type === 'elbow') {
    return '<circle r="4.5" class="node-dot" />';
  }
  if (node.type === 'junction') {
    return '<circle r="4" class="node-dot" /><path d="M 0 0 L 12 0 M 0 0 L -8 -7 M 0 0 L -8 7" class="junction-y" />';
  }
  if (node.type === 'fan') {
    return '<circle r="9" class="fan-ring" /><path d="M -2 -1 L 7 1 L -1 6 z" class="fan-blade" />';
  }
  if (node.type === 'filter') {
    const rot = connectedVector ? Math.atan2(connectedVector.y, connectedVector.x) * 180 / Math.PI : 0;
    return `<g transform="rotate(${rot})"><rect x="-8" y="-6" width="16" height="12" class="inline-symbol"/><path d="M -6 -6 L -3 6 M 0 -6 L 3 6 M 6 -6 L 8 6" class="filter-hatch"/></g>`;
  }
  if (node.type === 'blastGate') {
    const rot = connectedVector ? Math.atan2(connectedVector.y, connectedVector.x) * 180 / Math.PI : 0;
    return `<g transform="rotate(${rot})"><rect x="-7" y="-4" width="14" height="8" class="inline-symbol"/><path d="M -6 -5 L 6 5" class="gate-line"/></g>`;
  }
  return '<circle r="3.5" class="node-dot secondary" />';
}

function connectedVectorForNode(nodeId) {
  const edge = appState.model.edges.find((item) => item.from === nodeId || item.to === nodeId);
  if (!edge) {
    return { x: 1, y: 0 };
  }
  const otherId = edge.from === nodeId ? edge.to : edge.from;
  const node = appState.model.nodes.find((item) => item.id === nodeId);
  const other = appState.model.nodes.find((item) => item.id === otherId);
  if (!node || !other) {
    return { x: 1, y: 0 };
  }
  const a = isoToScreen(node.position);
  const b = isoToScreen(other.position);
  return { x: b.x - a.x, y: b.y - a.y };
}

function drawEdges() {
  const edgeLayer = document.getElementById('edgeLayer');
  const labelLayer = document.getElementById('labelLayer');
  edgeLayer.innerHTML = '';
  labelLayer.innerHTML = '';

  appState.model.edges.forEach((edge) => {
    const fromNode = appState.model.nodes.find((node) => node.id === edge.from);
    const toNode = appState.model.nodes.find((node) => node.id === edge.to);
    if (!fromNode || !toNode) {
      return;
    }
    const a = isoToScreen(fromNode.position);
    const b = isoToScreen(toNode.position);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
    line.setAttribute('class', `duct-line ${appState.ui.selected?.kind === 'edge' && appState.ui.selected.id === edge.id ? 'selected' : ''}`);
    line.dataset.edgeId = edge.id;
    edgeLayer.appendChild(line);

    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', `${mid.x + 5}`);
    txt.setAttribute('y', `${mid.y - 6}`);
    txt.setAttribute('class', 'edge-label');
    txt.textContent = `${edge.label} (${format(edge.props.cfm, 0)} cfm)`;
    labelLayer.appendChild(txt);
  });
}

function drawNodes() {
  const nodeLayer = document.getElementById('nodeLayer');
  const labelLayer = document.getElementById('labelLayer');
  nodeLayer.innerHTML = '';

  appState.model.nodes.forEach((node) => {
    const p = isoToScreen(node.position);
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${p.x} ${p.y})`);
    group.setAttribute('class', `node ${appState.ui.selected?.kind === 'node' && appState.ui.selected.id === node.id ? 'selected' : ''}`);
    group.dataset.nodeId = node.id;
    group.innerHTML = nodeSymbol(node, connectedVectorForNode(node.id));
    nodeLayer.appendChild(group);

    if (node.type !== 'elbow' && node.type !== 'junction') {
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', `${p.x + 8}`);
      txt.setAttribute('y', `${p.y + 16}`);
      txt.setAttribute('class', 'node-label');
      txt.textContent = node.label;
      labelLayer.appendChild(txt);
    }
  });
}

function drawPreview() {
  const layer = document.getElementById('previewLayer');
  layer.innerHTML = '';
  if (appState.ui.tool !== 'straightDuct' || !appState.ui.drawStartNodeId || !appState.ui.previewPoint) {
    return;
  }
  const startNode = appState.model.nodes.find((node) => node.id === appState.ui.drawStartNodeId);
  if (!startNode) {
    return;
  }
  const startScreen = isoToScreen(startNode.position);
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', `M ${startScreen.x} ${startScreen.y} L ${appState.ui.previewPoint.x} ${appState.ui.previewPoint.y}`);
  p.setAttribute('class', 'duct-preview');
  layer.appendChild(p);
}

function renderCanvas() {
  drawGrid();
  drawEdges();
  drawNodes();
  drawPreview();
  updateViewportTransform();
}

function renderToolButtons() {
  document.querySelectorAll('.tool').forEach((button) => button.classList.toggle('active', button.dataset.tool === appState.ui.tool));
}

function edgeLengthFromGeometry(edge) {
  const fromNode = appState.model.nodes.find((node) => node.id === edge.from);
  const toNode = appState.model.nodes.find((node) => node.id === edge.to);
  if (!fromNode || !toNode) {
    return 0;
  }
  const dx = toNode.position.x - fromNode.position.x;
  const dy = toNode.position.y - fromNode.position.y;
  const dz = (edge.props.endElevation ?? toNode.position.z) - (edge.props.startElevation ?? fromNode.position.z);
  return Math.sqrt(dx * dx + dy * dy + dz * dz) / 12;
}

function ensureEdgeEngineering(edge) {
  const computedLen = edgeLengthFromGeometry(edge);
  if (!edge.props.lengthFt || edge.props.lengthMode !== 'manual') {
    edge.props.lengthFt = computedLen;
    edge.props.lengthMode = 'geometry';
  }
}

function calcModelFromGraph() {
  const list = [];

  const byBranchEdges = {};
  appState.model.edges.forEach((edge) => {
    if (!byBranchEdges[edge.branchId]) {
      byBranchEdges[edge.branchId] = [];
    }
    byBranchEdges[edge.branchId].push(edge);
  });

  Object.keys(byBranchEdges).forEach((branchId) => {
    const edges = byBranchEdges[branchId].sort((a, b) => n(a.order) - n(b.order));
    const emittedNodes = new Set();

    edges.forEach((edge, idx) => {
      ensureEdgeEngineering(edge);
      const fromNode = appState.model.nodes.find((node) => node.id === edge.from);
      const toNode = appState.model.nodes.find((node) => node.id === edge.to);

      if (fromNode && fromNode.type !== 'node' && !emittedNodes.has(fromNode.id)) {
        list.push({
          id: fromNode.id,
          type: fromNode.type,
          label: fromNode.label,
          branchId,
          order: idx * 3 + 1,
          props: { ...fromNode.props },
          overrides: { ...(fromNode.overrides || {}) }
        });
        emittedNodes.add(fromNode.id);
      }

      list.push({
        id: edge.id,
        type: 'straightDuct',
        label: edge.label,
        branchId,
        order: idx * 3 + 2,
        props: { ...edge.props },
        overrides: { ...(edge.overrides || {}) }
      });

      if (toNode && toNode.type !== 'node' && !emittedNodes.has(toNode.id)) {
        list.push({
          id: toNode.id,
          type: toNode.type,
          label: toNode.label,
          branchId,
          order: idx * 3 + 3,
          props: { ...toNode.props },
          overrides: { ...(toNode.overrides || {}) }
        });
        emittedNodes.add(toNode.id);
      }
    });
  });

  return { components: list };
}

function calcAndRender() {
  const calcModel = calcModelFromGraph();
  appState.results = window.Calc.computeSystem(calcModel, appState.settings);
  document.getElementById('chartBody').innerHTML = window.Calc.formatChartRows(appState.results);

  document.getElementById('resultSummary').innerHTML = `
    <div class="result-card"><h4>Governing Leg</h4><p>${appState.results.governingLegId}</p></div>
    <div class="result-card"><h4>Governing SP</h4><p>${format(appState.results.governingSp)} in.wg</p></div>
    <div class="result-card"><h4>Pressure Ratio</h4><p>${format(appState.results.pressureRatio)} ${appState.results.redesign ? '⚠️' : '✅'}</p></div>
    <div class="result-card"><h4>Total Design Flow</h4><p>${format(appState.results.totalFlowDesign, 1)} cfm</p></div>
  `;

  if (appState.results.operatingPoint) {
    document.getElementById('fanSummary').textContent = `Fan OP ${format(appState.results.operatingPoint.q, 1)} cfm @ ${format(appState.results.operatingPoint.sp, 3)} in.wg`;
  } else {
    document.getElementById('fanSummary').textContent = `Fan summary: Governing SP ${format(appState.results.governingSp)} in.wg`;
  }

  renderPropertyPanel();
  renderCanvas();
}

function statusBadge(status) {
  const css = status === 'manual override' ? 'override' : status === 'calculated' ? 'calc' : 'default';
  return `<span class="badge ${css}">${status}</span>`;
}

function selectedEntity() {
  if (!appState.ui.selected) {
    return null;
  }
  if (appState.ui.selected.kind === 'node') {
    return appState.model.nodes.find((node) => node.id === appState.ui.selected.id) || null;
  }
  return appState.model.edges.find((edge) => edge.id === appState.ui.selected.id) || null;
}

function renderPropertyPanel() {
  const meta = document.getElementById('selectionMeta');
  const form = document.getElementById('propertyForm');
  const selected = selectedEntity();

  if (!selected) {
    meta.textContent = 'No item selected.';
    form.innerHTML = '<p>Select a duct line or node to edit engineering properties.</p>';
    return;
  }

  if (appState.ui.selected.kind === 'edge') {
    const result = appState.results?.worksheetRows.find((row) => row.id === selected.id)?.details;
    const lock = !appState.settings.advancedUnlocked;
    meta.innerHTML = `<strong>${selected.label}</strong><br/>Duct run • Branch ${selected.branchId}`;
    form.innerHTML = `
      <div class="property-grid" data-kind="edge" data-id="${selected.id}">
        <label>Label<input data-field="label" value="${selected.label}" /></label>
        <label>Branch ID<input data-field="branchId" value="${selected.branchId}" /></label>
        <label>Order<input type="number" data-field="order" value="${selected.order}" /></label>
        <label>Flow (cfm)<input type="number" data-field="cfm" value="${selected.props.cfm}" /></label>
        <label>Shape
          <select data-field="shape">
            <option value="round" ${selected.props.shape === 'round' ? 'selected' : ''}>Round</option>
            <option value="rectangular" ${selected.props.shape === 'rectangular' ? 'selected' : ''}>Rectangular</option>
          </select>
        </label>
        <label>Diameter (in)<input type="number" data-field="diameterIn" value="${selected.props.diameterIn}" /></label>
        <label>Width (in)<input type="number" data-field="widthIn" value="${selected.props.widthIn}" /></label>
        <label>Height (in)<input type="number" data-field="heightIn" value="${selected.props.heightIn}" /></label>
        <label>Length (ft)<input type="number" step="0.01" data-field="lengthFt" value="${format(selected.props.lengthFt, 2)}" /></label>
        <label>Start Elevation<input type="number" step="1" data-field="startElevation" value="${selected.props.startElevation ?? 0}" /></label>
        <label>End Elevation<input type="number" step="1" data-field="endElevation" value="${selected.props.endElevation ?? 0}" /></label>
        <label>Material
          <select data-field="material">
            ${Object.entries(window.Calc.Standards.straightDuct.materials).map(([k,v])=>`<option value="${k}" ${selected.props.material===k?'selected':''}>${v.label}</option>`).join('')}
          </select>
        </label>
        <label>Enable a/b/c Override<input type="checkbox" data-field="enableABC" ${selected.overrides.enableABC ? 'checked' : ''} ${lock ? 'disabled' : ''} /></label>
        <label>a<input type="number" step="0.0001" data-field="a" value="${selected.overrides.a ?? ''}" ${lock ? 'disabled' : ''}/></label>
        <label>b<input type="number" step="0.001" data-field="b" value="${selected.overrides.b ?? ''}" ${lock ? 'disabled' : ''}/></label>
        <label>c<input type="number" step="0.001" data-field="c" value="${selected.overrides.c ?? ''}" ${lock ? 'disabled' : ''}/></label>
      </div>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `V=${format(result.velocity,1)} VP=${format(result.vp,4)} F'=${format(result.fdPrime,6)} F=${format(result.fd,4)} h_d=${format(result.loss,4)}` : ''}</div>
    `;
    return;
  }

  const node = selected;
  const result = appState.results?.worksheetRows.find((row) => row.id === node.id)?.details;
  const lock = !appState.settings.advancedUnlocked;
  meta.innerHTML = `<strong>${node.label}</strong><br/>${window.Calc.componentTypeLabel(node.type)} • Branch ${node.branchId}`;

  let specific = '';
  if (node.type === 'hood') {
    specific = `
      <label>Hood Type
        <select data-field="hoodType">${Object.keys(window.Calc.Standards.hood.types).map((k)=>`<option value="${k}" ${node.props.hoodType===k?'selected':''}>${k}</option>`).join('')}</select>
      </label>
      <label>Opening Area (ft²)<input type="number" step="0.01" data-field="openingAreaFt2" value="${node.props.openingAreaFt2}" /></label>
      <label>Hood Elevation<input type="number" step="1" data-field="z" value="${node.position.z}" /></label>
      <label>Enable F_h Override<input type="checkbox" data-field="enableFh" ${node.overrides.enableFh ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_h override<input type="number" step="0.01" data-field="fh" value="${node.overrides.fh ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `V_face=${format(result.faceVelocity,1)} VP_d=${format(result.vp,4)} h_h=${format(result.hH,4)} SP_h=${format(result.spH,4)}` : ''}</div>
    `;
  } else if (node.type === 'elbow') {
    specific = `
      <label>Angle (deg)<input type="number" data-field="angleDeg" value="${node.props.angleDeg}" /></label>
      <label>R/D<input type="number" step="0.01" data-field="rd" value="${node.props.rd}" /></label>
      <label>Elbow Type
        <select data-field="elbowType">${['stamped','fivePiece','fourPiece','threePiece','mitered','miteredTurningVanes','flatback'].map((k)=>`<option value="${k}" ${node.props.elbowType===k?'selected':''}>${k}</option>`).join('')}</select>
      </label>
      <label>Enable F_el Override<input type="checkbox" data-field="enableFel" ${node.overrides.enableFel ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_el override<input type="number" step="0.01" data-field="fel" value="${node.overrides.fel ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `eq90=${format(result.equivalent90,3)} h_el=${format(result.loss,4)} matched=${result.matched || '-'}` : ''}</div>
    `;
  } else if (node.type === 'junction') {
    specific = `
      <label>Branch Angle (deg)<input type="number" data-field="branchAngleDeg" value="${node.props.branchAngleDeg}" /></label>
      <label>Enable F_en Override<input type="checkbox" data-field="enableFen" ${node.overrides.enableFen ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>F_en override<input type="number" step="0.01" data-field="fen" value="${node.overrides.fen ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `h_en=${format(result.loss,4)} matched angle=${result.matchedAngle || '-'}` : ''}</div>
    `;
  } else if (node.type === 'fan') {
    const points = (node.props.curvePoints || []).map((p) => `${p.q}:${p.sp}`).join(', ');
    specific = `
      <label>Fan Curve Points (q:sp)<textarea rows="3" data-field="curvePointsText">${points}</textarea></label>
      <div class="selection-meta">Operating point: ${appState.results?.operatingPoint ? `${format(appState.results.operatingPoint.q,1)} cfm @ ${format(appState.results.operatingPoint.sp,3)} in.wg` : 'Not solved'}</div>
    `;
  } else if (node.type === 'filter') {
    specific = `
      <label>Filter ΔSP override<input type="number" step="0.01" data-field="dropInWg" value="${node.overrides.dropInWg ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `h_filter=${format(result.loss,4)}` : ''}</div>
    `;
  } else if (node.type === 'blastGate') {
    specific = `
      <label>Enable K Override<input type="checkbox" data-field="enableK" ${node.overrides.enableK ? 'checked' : ''} ${lock ? 'disabled' : ''}/></label>
      <label>K override<input type="number" step="0.01" data-field="k" value="${node.overrides.k ?? ''}" ${lock ? 'disabled' : ''}/></label>
      <div class="selection-meta">${statusBadge(result?.status || 'standards default')} ${result ? `h_gate=${format(result.loss,4)}` : ''}</div>
    `;
  }

  form.innerHTML = `
    <div class="property-grid" data-kind="node" data-id="${node.id}">
      <label>Label<input data-field="label" value="${node.label}" /></label>
      <label>Branch ID<input data-field="branchId" value="${node.branchId}" /></label>
      <label>Flow (cfm)<input type="number" data-field="cfm" value="${node.props.cfm || 0}" /></label>
      <label>Shape
        <select data-field="shape">
          <option value="round" ${node.props.shape === 'round' ? 'selected' : ''}>Round</option>
          <option value="rectangular" ${node.props.shape === 'rectangular' ? 'selected' : ''}>Rectangular</option>
        </select>
      </label>
      <label>Diameter (in)<input type="number" data-field="diameterIn" value="${node.props.diameterIn || 0}" /></label>
      <label>Width (in)<input type="number" data-field="widthIn" value="${node.props.widthIn || 0}" /></label>
      <label>Height (in)<input type="number" data-field="heightIn" value="${node.props.heightIn || 0}" /></label>
      ${specific}
    </div>
  `;
}

function syncEdgeElevations(edge) {
  const fromNode = appState.model.nodes.find((node) => node.id === edge.from);
  const toNode = appState.model.nodes.find((node) => node.id === edge.to);
  if (fromNode) {
    fromNode.position.z = n(edge.props.startElevation, fromNode.position.z);
  }
  if (toNode) {
    toNode.position.z = n(edge.props.endElevation, toNode.position.z);
  }
}

function applyPropertyEdit(target) {
  const selected = appState.ui.selected;
  if (!selected) {
    return;
  }

  if (selected.kind === 'edge') {
    const edge = appState.model.edges.find((item) => item.id === selected.id);
    if (!edge) {
      return;
    }
    const field = target.dataset.field;
    if (!field) {
      return;
    }
    if (field === 'label') {
      edge.label = target.value;
    } else if (field === 'branchId') {
      edge.branchId = target.value || 'MAIN';
    } else if (field === 'order') {
      edge.order = n(target.value, 1);
    } else if (field === 'shape' || field === 'material') {
      edge.props[field] = target.value;
    } else if (['enableABC'].includes(field)) {
      edge.overrides[field] = target.checked;
    } else if (['a', 'b', 'c'].includes(field)) {
      edge.overrides[field] = target.value === '' ? null : n(target.value);
    } else if (field === 'lengthFt') {
      edge.props.lengthFt = n(target.value, edge.props.lengthFt);
      edge.props.lengthMode = 'manual';
    } else if (['startElevation', 'endElevation'].includes(field)) {
      edge.props[field] = n(target.value, 0);
      syncEdgeElevations(edge);
    } else if (['cfm', 'diameterIn', 'widthIn', 'heightIn'].includes(field)) {
      edge.props[field] = n(target.value, 0);
    }
  } else {
    const node = appState.model.nodes.find((item) => item.id === selected.id);
    if (!node) {
      return;
    }
    const field = target.dataset.field;
    if (!field) {
      return;
    }
    if (field === 'label') {
      node.label = target.value;
    } else if (field === 'branchId') {
      node.branchId = target.value || 'MAIN';
    } else if (field === 'shape' || field === 'hoodType' || field === 'elbowType') {
      node.props[field] = target.value;
    } else if (field === 'curvePointsText') {
      node.props.curvePoints = target.value.split(',').map((pair) => {
        const [q, sp] = pair.split(':').map((item) => Number(item.trim()));
        return { q, sp };
      }).filter((item) => Number.isFinite(item.q) && Number.isFinite(item.sp));
    } else if (['enableFh', 'enableFel', 'enableFen', 'enableK'].includes(field)) {
      node.overrides[field] = target.checked;
    } else if (['fh', 'fel', 'fen', 'k', 'dropInWg'].includes(field)) {
      node.overrides[field] = target.value === '' ? null : n(target.value);
    } else if (field === 'z') {
      node.position.z = n(target.value, node.position.z);
      appState.model.edges.forEach((edge) => {
        if (edge.from === node.id) {
          edge.props.startElevation = node.position.z;
        }
        if (edge.to === node.id) {
          edge.props.endElevation = node.position.z;
        }
      });
    } else if (['cfm', 'diameterIn', 'widthIn', 'heightIn', 'openingAreaFt2', 'angleDeg', 'rd', 'wd', 'branchAngleDeg'].includes(field)) {
      node.props[field] = n(target.value, 0);
    }
  }

  calcAndRender();
}

function createNode(type, isoPos) {
  const node = {
    id: idFor('N', appState.model.nodes),
    type,
    label: `${window.Calc.componentTypeLabel(type)} ${appState.model.nodes.length + 1}`,
    branchId: 'B1',
    position: { ...isoPos },
    props: { shape: 'round', diameterIn: 12, widthIn: 18, heightIn: 10, cfm: 1200, hoodType: 'plainOpening', openingAreaFt2: 4, geometry: 'round', elbowType: 'stamped', angleDeg: 90, rd: 1, wd: 1, branchAngleDeg: 45, curvePoints: [{ q: 2400, sp: 6.6 }, { q: 3200, sp: 5.3 }] },
    overrides: { enableFh: false, enableFel: false, enableFen: false, enableK: false, fh: null, fel: null, fen: null, k: null, dropInWg: null }
  };
  appState.model.nodes.push(node);
  return node;
}

function createDuctEdge(fromNodeId, toNodeId) {
  const fromNode = appState.model.nodes.find((node) => node.id === fromNodeId);
  const toNode = appState.model.nodes.find((node) => node.id === toNodeId);
  if (!fromNode || !toNode) {
    return;
  }
  const edge = {
    id: idFor('D', appState.model.edges),
    type: 'straightDuct',
    label: `Run ${appState.model.edges.length + 1}`,
    branchId: fromNode.branchId || 'B1',
    order: appState.model.edges.filter((item) => item.branchId === (fromNode.branchId || 'B1')).length + 1,
    from: fromNodeId,
    to: toNodeId,
    props: {
      shape: 'round',
      diameterIn: 12,
      widthIn: 18,
      heightIn: 10,
      cfm: fromNode.props.cfm || 1200,
      material: 'otherSheetMetalPlastic',
      startElevation: fromNode.position.z,
      endElevation: toNode.position.z,
      lengthFt: 0,
      lengthMode: 'geometry'
    },
    overrides: { enableABC: false, a: null, b: null, c: null }
  };
  ensureEdgeEngineering(edge);
  appState.model.edges.push(edge);
  return edge;
}

function startOrFinishDuctDraw(event) {
  const point = screenPtFromEvent(event);
  const nodeHit = nearestNode(point, 14);

  if (!appState.ui.drawStartNodeId) {
    const node = nodeHit || createNode('elbow', screenToIso(point.x, point.y, 0));
    appState.ui.drawStartNodeId = node.id;
    appState.ui.selected = { kind: 'node', id: node.id };
    return;
  }

  const startNode = appState.model.nodes.find((node) => node.id === appState.ui.drawStartNodeId);
  if (!startNode) {
    appState.ui.drawStartNodeId = null;
    return;
  }

  const startScreen = isoToScreen(startNode.position);
  const snappedScreen = constrainToCadDirections(startScreen, point);
  let endNode = nodeHit;

  if (!endNode || endNode.id === startNode.id) {
    endNode = createNode('elbow', screenToIso(snappedScreen.x, snappedScreen.y, startNode.position.z));
  }

  const edge = createDuctEdge(startNode.id, endNode.id);
  appState.ui.selected = edge ? { kind: 'edge', id: edge.id } : appState.ui.selected;
  appState.ui.drawStartNodeId = endNode.id;
}

function onCanvasClick(event) {
  const edgeHit = event.target.closest('.duct-line');
  if (edgeHit) {
    appState.ui.selected = { kind: 'edge', id: edgeHit.dataset.edgeId };
    calcAndRender();
    return;
  }

  const nodeHit = event.target.closest('.node');
  if (nodeHit) {
    appState.ui.selected = { kind: 'node', id: nodeHit.dataset.nodeId };
    if (appState.ui.tool === 'straightDuct') {
      appState.ui.drawStartNodeId = nodeHit.dataset.nodeId;
    }
    calcAndRender();
    return;
  }

  const point = screenPtFromEvent(event);
  const iso = screenToIso(point.x, point.y, 0);

  if (appState.ui.tool === 'straightDuct') {
    startOrFinishDuctDraw(event);
  } else if (appState.ui.tool !== 'select') {
    const node = createNode(appState.ui.tool, iso);
    appState.ui.selected = { kind: 'node', id: node.id };
    appState.ui.drawStartNodeId = null;
  } else {
    appState.ui.selected = null;
  }

  calcAndRender();
}

function exportDxf() {
  const lines = [];
  lines.push('0','SECTION','2','HEADER','0','ENDSEC');
  lines.push('0','SECTION','2','ENTITIES');

  appState.model.edges.forEach((edge) => {
    const aNode = appState.model.nodes.find((node) => node.id === edge.from);
    const bNode = appState.model.nodes.find((node) => node.id === edge.to);
    if (!aNode || !bNode) {
      return;
    }
    lines.push('0','LINE','8','DUCT_CENTERLINE',
      '10', String(aNode.position.x), '20', String(aNode.position.y), '30', String(aNode.position.z),
      '11', String(bNode.position.x), '21', String(bNode.position.y), '31', String(bNode.position.z));

    const midX = (aNode.position.x + bNode.position.x) / 2;
    const midY = (aNode.position.y + bNode.position.y) / 2;
    const midZ = (aNode.position.z + bNode.position.z) / 2;
    lines.push('0','TEXT','8','LABELS','10',String(midX),'20',String(midY),'30',String(midZ),'40','2.5','1',edge.label);
  });

  appState.model.nodes.forEach((node) => {
    if (node.type === 'hood') {
      const p = node.position;
      const points = [
        [p.x - 10, p.y - 3, p.z], [p.x + 10, p.y - 3, p.z], [p.x + 6, p.y + 5, p.z], [p.x - 6, p.y + 5, p.z], [p.x - 10, p.y - 3, p.z]
      ];
      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i];
        const b = points[i + 1];
        lines.push('0','LINE','8','HOODS','10',String(a[0]),'20',String(a[1]),'30',String(a[2]),'11',String(b[0]),'21',String(b[1]),'31',String(b[2]));
      }
    }

    if (['fan','filter','blastGate','elbow','junction'].includes(node.type)) {
      lines.push('0','POINT','8',`NODE_${node.type.toUpperCase()}`,'10',String(node.position.x),'20',String(node.position.y),'30',String(node.position.z));
    }
  });

  lines.push('0','ENDSEC','0','EOF');

  const blob = new Blob([`${lines.join('\n')}\n`], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'duct-layout.dxf';
  a.click();
  URL.revokeObjectURL(url);
}

svg.addEventListener('click', onCanvasClick);

svg.addEventListener('mousedown', (event) => {
  if (event.shiftKey) {
    appState.ui.isPanning = true;
    appState.ui.dragOffset = { x: event.clientX - appState.ui.panX, y: event.clientY - appState.ui.panY };
    return;
  }

  if (appState.ui.tool !== 'select') {
    return;
  }

  const nodeEl = event.target.closest('.node');
  const edgeEl = event.target.closest('.duct-line');
  if (nodeEl) {
    appState.ui.dragRef = { kind: 'node', id: nodeEl.dataset.nodeId };
  } else if (edgeEl) {
    appState.ui.dragRef = { kind: 'edge', id: edgeEl.dataset.edgeId };
  }

  if (appState.ui.dragRef) {
    const pt = screenPtFromEvent(event);
    if (appState.ui.dragRef.kind === 'node') {
      const node = appState.model.nodes.find((item) => item.id === appState.ui.dragRef.id);
      if (!node) {
        return;
      }
      const p = isoToScreen(node.position);
      appState.ui.dragOffset = { x: p.x - pt.x, y: p.y - pt.y };
    } else {
      appState.ui.dragOffset = { x: pt.x, y: pt.y };
    }
  }
});

window.addEventListener('mousemove', (event) => {
  const pt = screenPtFromEvent(event);

  if (appState.ui.tool === 'straightDuct' && appState.ui.drawStartNodeId) {
    const start = appState.model.nodes.find((node) => node.id === appState.ui.drawStartNodeId);
    if (start) {
      const startScreen = isoToScreen(start.position);
      appState.ui.previewPoint = constrainToCadDirections(startScreen, pt);
      drawPreview();
    }
  }

  if (appState.ui.isPanning) {
    appState.ui.panX = event.clientX - appState.ui.dragOffset.x;
    appState.ui.panY = event.clientY - appState.ui.dragOffset.y;
    updateViewportTransform();
    return;
  }

  if (!appState.ui.dragRef) {
    return;
  }

  if (appState.ui.dragRef.kind === 'node') {
    const node = appState.model.nodes.find((item) => item.id === appState.ui.dragRef.id);
    if (!node) {
      return;
    }
    const targetScreen = { x: pt.x + appState.ui.dragOffset.x, y: pt.y + appState.ui.dragOffset.y };
    const iso = screenToIso(targetScreen.x, targetScreen.y, node.position.z);
    node.position.x = Math.round(iso.x / 20) * 20;
    node.position.y = Math.round(iso.y / 20) * 20;

    appState.model.edges.forEach((edge) => {
      if (edge.from === node.id) {
        edge.props.startElevation = node.position.z;
        if (edge.props.lengthMode !== 'manual') {
          ensureEdgeEngineering(edge);
        }
      }
      if (edge.to === node.id) {
        edge.props.endElevation = node.position.z;
        if (edge.props.lengthMode !== 'manual') {
          ensureEdgeEngineering(edge);
        }
      }
    });

    renderCanvas();
  }
});

window.addEventListener('mouseup', () => {
  appState.ui.dragRef = null;
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
  appState.ui.drawStartNodeId = null;
  appState.ui.previewPoint = null;
  renderToolButtons();
  drawPreview();
});

document.getElementById('propertyForm').addEventListener('input', (event) => applyPropertyEdit(event.target));
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
  appState.settings.densityFactor = n(event.target.value, 1);
  calcAndRender();
});
document.getElementById('fanModeInput').addEventListener('change', (event) => {
  appState.settings.fanCurveEnabled = event.target.checked;
  calcAndRender();
});
document.getElementById('exportDxfBtn').addEventListener('click', exportDxf);

renderToolButtons();
calcAndRender();
