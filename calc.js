(function attachCalc(globalObj) {
  const Standards = {
    straightDuct: {
      materialDefault: 'otherSheetMetalPlastic',
      materials: {
        metalSmooth: { label: 'Aluminum / black iron / stainless steel', a: 0.0425, b: 0.465, c: 0.602, source: 'ACGIH-style correlation' },
        otherSheetMetalPlastic: { label: 'Other sheet metal / plastic duct', a: 0.0307, b: 0.533, c: 0.612, source: 'ACGIH-style correlation' },
        flexibleFabric: { label: 'Flexible duct, fabric wires covered', a: 0.0311, b: 0.604, c: 0.639, source: 'ACGIH-style correlation' }
      }
    },
    elbowRound: {
      stamped: { 0.75: 0.33, 1.0: 0.22, 1.5: 0.15, 2.0: 0.13 },
      fivePiece: { 0.75: 0.46, 1.0: 0.33, 1.5: 0.24, 2.0: 0.19, 2.5: 0.17 },
      fourPiece: { 0.75: 0.5, 1.0: 0.37, 1.5: 0.27, 2.0: 0.24, 2.5: 0.23 },
      threePiece: { 0.75: 0.54, 1.0: 0.42, 1.5: 0.34, 2.0: 0.33, 2.5: 0.33 },
      fixed: { mitered: 1.2, miteredTurningVanes: 0.6, flatback: 0.05 }
    },
    elbowRect: {
      0.0: { 0.25: 1.5, 0.5: 1.32, 1.0: 1.15, 2.0: 1.04, 3.0: 0.92, 4.0: 0.86 },
      0.5: { 0.25: 1.36, 0.5: 1.21, 1.0: 1.05, 2.0: 0.95, 3.0: 0.84, 4.0: 0.79 },
      1.0: { 0.25: 0.45, 0.5: 0.28, 1.0: 0.21, 2.0: 0.21, 3.0: 0.2, 4.0: 0.19 },
      1.5: { 0.25: 0.28, 0.5: 0.18, 1.0: 0.13, 2.0: 0.13, 3.0: 0.12, 4.0: 0.12 },
      2.0: { 0.25: 0.24, 0.5: 0.15, 1.0: 0.11, 2.0: 0.11, 3.0: 0.1, 4.0: 0.1 },
      3.0: { 0.25: 0.24, 0.5: 0.15, 1.0: 0.11, 2.0: 0.11, 3.0: 0.1, 4.0: 0.1 }
    },
    branchEntryAngle: { 10: 0.06, 15: 0.09, 20: 0.12, 25: 0.15, 30: 0.18, 35: 0.21, 40: 0.25, 45: 0.28, 50: 0.32, 60: 0.44, 90: 1.0 },
    hood: {
      types: {
        plainOpening: { fh: 0.78, source: 'Default placeholder, verify project standard' },
        flanged: { fh: 0.42, source: 'Default placeholder, verify project standard' },
        canopy: { fh: 0.9, source: 'Default placeholder, verify project standard' }
      },
      fa: 1
    },
    blastGate: { kDefault: 0.22, source: 'Placeholder standards default' },
    filter: { pressureDropDefault: 0.35, source: 'Placeholder standards default' }
  };

  function n(v, fallback = 0) {
    const val = Number(v);
    return Number.isFinite(val) ? val : fallback;
  }

  function nearestKey(table, value) {
    const keys = Object.keys(table).map(Number);
    if (!keys.length) {
      return null;
    }
    return keys.reduce((best, current) => (Math.abs(current - value) < Math.abs(best - value) ? current : best), keys[0]);
  }

  function areaFromSize(size) {
    if (size.shape === 'rectangular') {
      const w = n(size.widthIn);
      const h = n(size.heightIn);
      return (w * h) / 144;
    }
    const d = n(size.diameterIn);
    return (Math.PI * Math.pow(d / 12, 2)) / 4;
  }

  function equivalentDiameter(size) {
    if (size.shape === 'rectangular') {
      const w = n(size.widthIn);
      const h = n(size.heightIn);
      if (w <= 0 || h <= 0) {
        return 0;
      }
      return 1.3 * Math.pow(w * h, 0.625) / Math.pow(w + h, 0.25);
    }
    return n(size.diameterIn);
  }

  function velocity(cfm, areaFt2) {
    if (areaFt2 <= 0) {
      return 0;
    }
    return n(cfm) / areaFt2;
  }

  function velocityPressure(v, densityFactor) {
    return n(densityFactor, 1) * Math.pow(n(v) / 4005, 2);
  }

  function resolveStandard(defaultValue, overrideValue, isOverrideEnabled) {
    if (isOverrideEnabled && Number.isFinite(Number(overrideValue))) {
      return { value: n(overrideValue), status: 'manual override' };
    }
    return { value: defaultValue, status: 'standards default' };
  }

  function straightDuctLoss(component, context, settings) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const v = velocity(context.flow, area);
    const vp = velocityPressure(v, settings.densityFactor);

    const material = component.props.material || Standards.straightDuct.materialDefault;
    const defaults = Standards.straightDuct.materials[material] || Standards.straightDuct.materials.otherSheetMetalPlastic;

    const aMeta = resolveStandard(defaults.a, component.overrides.a, settings.advancedUnlocked && component.overrides.enableABC);
    const bMeta = resolveStandard(defaults.b, component.overrides.b, settings.advancedUnlocked && component.overrides.enableABC);
    const cMeta = resolveStandard(defaults.c, component.overrides.c, settings.advancedUnlocked && component.overrides.enableABC);

    const fPrime = aMeta.value * Math.pow(v, bMeta.value) / Math.pow(Math.max(context.flow, 1), cMeta.value);
    const fd = fPrime * n(component.props.lengthFt);
    const loss = fd * vp;

    return {
      type: 'straightDuct',
      flow: context.flow,
      area,
      eqD,
      velocity: v,
      vp,
      fdPrime: fPrime,
      fd,
      loss,
      lossCoef: fd,
      status: aMeta.status,
      source: defaults.source,
      details: { material: defaults.label, a: aMeta.value, b: bMeta.value, c: cMeta.value }
    };
  }

  function lookupRoundElbowFel(elbowType, rd) {
    if (Standards.elbowRound.fixed[elbowType] !== undefined) {
      return { fel: Standards.elbowRound.fixed[elbowType], matched: elbowType, source: 'fixed round elbow default' };
    }
    const table = Standards.elbowRound[elbowType] || Standards.elbowRound.stamped;
    const match = nearestKey(table, rd);
    return { fel: table[match], matched: `R/D ${match}`, source: 'nearest round elbow lookup' };
  }

  function lookupRectElbowFel(rd, wd) {
    const rdMatch = nearestKey(Standards.elbowRect, rd);
    const wdTable = Standards.elbowRect[rdMatch] || Standards.elbowRect[1.0];
    const wdMatch = nearestKey(wdTable, wd);
    return {
      fel: wdTable[wdMatch],
      matched: `R/D ${rdMatch}, W/D ${wdMatch}`,
      source: 'nearest rectangular elbow lookup'
    };
  }

  function elbowLoss(component, context, settings) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const v = velocity(context.flow, area);
    const vp = velocityPressure(v, settings.densityFactor);
    const angle = n(component.props.angleDeg, 90);
    const equivalent90 = angle / 90;

    let defaults;
    if (component.props.geometry === 'rectangular') {
      defaults = lookupRectElbowFel(n(component.props.rd, 1), n(component.props.wd, 1));
    } else {
      defaults = lookupRoundElbowFel(component.props.elbowType || 'stamped', n(component.props.rd, 1));
    }

    const felMeta = resolveStandard(defaults.fel, component.overrides.fel, settings.advancedUnlocked && component.overrides.enableFel);
    const loss = equivalent90 * felMeta.value * vp;

    return {
      type: 'elbow',
      flow: context.flow,
      area,
      eqD,
      velocity: v,
      vp,
      equivalent90,
      fel: felMeta.value,
      matched: defaults.matched,
      lossCoef: equivalent90 * felMeta.value,
      loss,
      status: felMeta.status,
      source: defaults.source
    };
  }

  function branchEntryLoss(component, context, settings) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const v = velocity(context.flow, area);
    const vp = velocityPressure(v, settings.densityFactor);
    const angle = n(component.props.branchAngleDeg, 45);
    const matched = nearestKey(Standards.branchEntryAngle, angle);
    const defaultFen = Standards.branchEntryAngle[matched];
    const fenMeta = resolveStandard(defaultFen, component.overrides.fen, settings.advancedUnlocked && component.overrides.enableFen);
    const loss = fenMeta.value * vp;

    return {
      type: 'branchEntry',
      flow: context.flow,
      area,
      eqD,
      velocity: v,
      vp,
      fen: fenMeta.value,
      matchedAngle: matched,
      lossCoef: fenMeta.value,
      loss,
      status: fenMeta.status,
      source: 'nearest branch entry angle lookup'
    };
  }

  function hoodLoss(component, context, settings) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const q = context.flow;
    const vDuct = velocity(q, area);
    const vpD = velocityPressure(vDuct, settings.densityFactor);

    const hoodArea = n(component.props.openingAreaFt2, 4);
    const vFace = velocity(q, hoodArea);
    const hoodType = component.props.hoodType || 'plainOpening';
    const hoodDefaults = Standards.hood.types[hoodType] || Standards.hood.types.plainOpening;

    const fa = Standards.hood.fa;
    const fhMeta = resolveStandard(hoodDefaults.fh, component.overrides.fh, settings.advancedUnlocked && component.overrides.enableFh);

    const hH = fhMeta.value * vpD;
    const spH = -(fa + fhMeta.value) * vpD;

    return {
      type: 'hood',
      flow: q,
      area,
      eqD,
      velocity: vDuct,
      vp: vpD,
      hoodArea,
      faceVelocity: vFace,
      fa,
      fh: fhMeta.value,
      hH,
      spH,
      lossCoef: fhMeta.value,
      loss: Math.abs(spH),
      status: fhMeta.status,
      source: hoodDefaults.source
    };
  }

  function filterLoss(component, context) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const v = velocity(context.flow, area);
    const vp = velocityPressure(v, context.densityFactor);
    const defaultDrop = Standards.filter.pressureDropDefault;
    const drop = n(component.overrides.dropInWg, defaultDrop);
    const status = Number.isFinite(Number(component.overrides.dropInWg)) ? 'manual override' : 'standards default';

    return {
      type: 'filter', flow: context.flow, area, eqD, velocity: v, vp, lossCoef: drop / Math.max(vp, 0.000001), loss: drop, status, source: Standards.filter.source
    };
  }

  function blastGateLoss(component, context, settings) {
    const area = areaFromSize(component.props);
    const eqD = equivalentDiameter(component.props);
    const v = velocity(context.flow, area);
    const vp = velocityPressure(v, settings.densityFactor);
    const gateMeta = resolveStandard(Standards.blastGate.kDefault, component.overrides.k, settings.advancedUnlocked && component.overrides.enableK);
    return {
      type: 'blastGate', flow: context.flow, area, eqD, velocity: v, vp, lossCoef: gateMeta.value, loss: gateMeta.value * vp, status: gateMeta.status, source: Standards.blastGate.source
    };
  }

  function fanPlaceholder(component, context) {
    return {
      type: 'fan', flow: context.flow, area: 0, eqD: 0, velocity: 0, vp: 0, lossCoef: 0, loss: 0, status: 'calculated', source: 'fan device'
    };
  }

  function calcComponent(component, context, settings) {
    if (component.type === 'straightDuct') {
      return straightDuctLoss(component, context, settings);
    }
    if (component.type === 'elbow') {
      return elbowLoss(component, context, settings);
    }
    if (component.type === 'junction') {
      return branchEntryLoss(component, context, settings);
    }
    if (component.type === 'hood') {
      return hoodLoss(component, context, settings);
    }
    if (component.type === 'filter') {
      return filterLoss(component, { flow: context.flow, densityFactor: settings.densityFactor });
    }
    if (component.type === 'blastGate') {
      return blastGateLoss(component, context, settings);
    }
    if (component.type === 'fan') {
      return fanPlaceholder(component, context);
    }
    return { type: component.type, flow: context.flow, area: 0, eqD: 0, velocity: 0, vp: 0, lossCoef: 0, loss: 0, status: 'calculated', source: 'n/a' };
  }

  function groupByBranch(model) {
    const branches = {};
    model.components.forEach((component) => {
      const branchId = component.branchId || 'MAIN';
      if (!branches[branchId]) {
        branches[branchId] = [];
      }
      branches[branchId].push(component);
    });

    Object.keys(branches).forEach((branchId) => {
      branches[branchId].sort((a, b) => n(a.order) - n(b.order));
    });

    return branches;
  }

  function interpolateFanSp(points, flow) {
    if (!points || points.length < 2) {
      return null;
    }
    const sorted = [...points].sort((a, b) => a.q - b.q);
    if (flow <= sorted[0].q) {
      return sorted[0].sp;
    }
    if (flow >= sorted[sorted.length - 1].q) {
      return sorted[sorted.length - 1].sp;
    }

    for (let i = 0; i < sorted.length - 1; i += 1) {
      const p1 = sorted[i];
      const p2 = sorted[i + 1];
      if (flow >= p1.q && flow <= p2.q) {
        const t = (flow - p1.q) / (p2.q - p1.q);
        return p1.sp + t * (p2.sp - p1.sp);
      }
    }
    return sorted[sorted.length - 1].sp;
  }

  function solveOperatingPoint(fanPoints, systemK) {
    if (!fanPoints || fanPoints.length < 2 || systemK <= 0) {
      return null;
    }
    const sorted = [...fanPoints].sort((a, b) => a.q - b.q);
    let lo = sorted[0].q;
    let hi = sorted[sorted.length - 1].q;

    for (let i = 0; i < 50; i += 1) {
      const mid = (lo + hi) / 2;
      const fanSp = interpolateFanSp(sorted, mid);
      const reqSp = systemK * Math.pow(mid, 2);
      if (fanSp === null) {
        return null;
      }
      const error = fanSp - reqSp;
      if (Math.abs(error) < 0.0001) {
        return { q: mid, sp: fanSp, systemK };
      }
      if (error > 0) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const q = (lo + hi) / 2;
    const sp = interpolateFanSp(sorted, q);
    return { q, sp, systemK };
  }

  function computeSystem(model, settings) {
    const branches = groupByBranch(model);
    const branchResults = [];
    const worksheetRows = [];

    Object.keys(branches).forEach((branchId) => {
      const branchComponents = branches[branchId];
      let cumulativeSp = 0;
      const branchFlow = n(branchComponents.find((c) => c.props && c.props.cfm)?.props.cfm, 1000);
      const componentRows = [];

      branchComponents.forEach((component) => {
        const result = calcComponent(component, { flow: branchFlow }, settings);
        cumulativeSp += result.loss;
        componentRows.push({ component, result, cumulativeSp });

        worksheetRows.push({
          id: component.id,
          branchId,
          componentName: component.label || component.type,
          type: component.type,
          flow: result.flow,
          size: component.props.shape === 'rectangular' ? `${n(component.props.widthIn)}x${n(component.props.heightIn)}` : `${n(component.props.diameterIn)} Ø`,
          eqD: result.eqD,
          velocity: result.velocity,
          vp: result.vp,
          coef: result.lossCoef,
          loss: result.loss,
          cumulativeSp,
          status: result.status,
          details: result
        });
      });

      branchResults.push({ branchId, flow: branchFlow, cumulativeSp, components: componentRows });
    });

    branchResults.sort((a, b) => b.cumulativeSp - a.cumulativeSp);
    const governing = branchResults[0] || { branchId: '—', cumulativeSp: 0, flow: 0 };
    const lowest = branchResults[branchResults.length - 1] || governing;
    const pressureRatio = lowest.cumulativeSp > 0 ? governing.cumulativeSp / lowest.cumulativeSp : 1;

    const totalFlowDesign = branchResults.reduce((sum, b) => sum + b.flow, 0);
    const correctedFlows = branchResults.map((branch) => ({
      branchId: branch.branchId,
      spDuct: branch.cumulativeSp,
      qCorrected: branch.flow * Math.sqrt(Math.max(governing.cumulativeSp, 0.000001) / Math.max(branch.cumulativeSp, 0.000001))
    }));

    const fanComponent = model.components.find((component) => component.type === 'fan');
    let operatingPoint = null;
    if (settings.fanCurveEnabled && fanComponent && Array.isArray(fanComponent.props.curvePoints)) {
      const systemK = governing.cumulativeSp / Math.max(Math.pow(totalFlowDesign, 2), 1);
      operatingPoint = solveOperatingPoint(fanComponent.props.curvePoints, systemK);
    }

    if (operatingPoint) {
      const ratio = operatingPoint.q / Math.max(totalFlowDesign, 1);
      correctedFlows.forEach((item) => {
        item.qOperating = item.qCorrected * ratio;
      });
    }

    return {
      worksheetRows,
      branchResults,
      governingLegId: governing.branchId,
      governingSp: governing.cumulativeSp,
      totalFlowDesign,
      pressureRatio,
      redesign: pressureRatio > 1.2,
      correctedFlows,
      operatingPoint
    };
  }

  function componentTypeLabel(type) {
    const labels = {
      hood: 'Hood',
      straightDuct: 'Straight Duct',
      elbow: 'Elbow',
      junction: 'Branch Entry/Junction',
      blastGate: 'Blast Gate',
      fan: 'Fan',
      filter: 'Filter'
    };
    return labels[type] || type;
  }

  function formatChartRows(systemResults) {
    const rows = [];
    let activeBranch = null;

    systemResults.worksheetRows.forEach((row) => {
      if (row.branchId !== activeBranch) {
        activeBranch = row.branchId;
        rows.push(`<tr class="section"><td colspan="13">Branch ${row.branchId}</td></tr>`);
      }

      rows.push(`<tr>
        <td>${row.id}</td>
        <td>${row.branchId}</td>
        <td>${row.componentName}</td>
        <td>${componentTypeLabel(row.type)}</td>
        <td>${row.flow.toFixed(1)}</td>
        <td>${row.size}</td>
        <td>${row.eqD.toFixed(2)}</td>
        <td>${row.velocity.toFixed(1)}</td>
        <td>${row.vp.toFixed(4)}</td>
        <td>${row.coef.toFixed(4)}</td>
        <td>${row.loss.toFixed(4)}</td>
        <td>${row.cumulativeSp.toFixed(4)}</td>
        <td>${row.status}</td>
      </tr>`);
    });

    return rows.join('');
  }

  globalObj.Calc = {
    Standards,
    n,
    areaFromSize,
    equivalentDiameter,
    velocity,
    velocityPressure,
    straightDuctLoss,
    elbowLoss,
    branchEntryLoss,
    hoodLoss,
    computeSystem,
    formatChartRows,
    componentTypeLabel,
    solveOperatingPoint,
    interpolateFanSp
  };
})(window);
