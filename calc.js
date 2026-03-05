(function attachCalc(globalObj) {
  function safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function roundAreaFt2(diameterIn) {
    const diameter = safeNumber(diameterIn);
    return (Math.PI * Math.pow(diameter / 12, 2)) / 4;
  }

  function rectangularAreaFt2(widthIn, heightIn) {
    return (safeNumber(widthIn) * safeNumber(heightIn)) / 144;
  }

  function equivalentDiameterRect(widthIn, heightIn) {
    const width = safeNumber(widthIn);
    const height = safeNumber(heightIn);
    if (width <= 0 || height <= 0) {
      return 0;
    }
    return 1.3 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.25);
  }

  function segmentGeometry(segment) {
    const shape = segment.shape || 'round';
    if (shape === 'rectangular') {
      const areaFt2 = rectangularAreaFt2(segment.widthIn, segment.heightIn);
      const eqDiameterIn = equivalentDiameterRect(segment.widthIn, segment.heightIn);
      return {
        shape,
        areaFt2,
        eqDiameterIn,
        geometryLabel: `${safeNumber(segment.widthIn)}×${safeNumber(segment.heightIn)} in`
      };
    }

    const diameterIn = safeNumber(segment.diameterIn);
    return {
      shape: 'round',
      areaFt2: roundAreaFt2(diameterIn),
      eqDiameterIn: diameterIn,
      geometryLabel: `${diameterIn} in Ø`
    };
  }

  function velocityFpm(cfm, areaFt2) {
    if (areaFt2 <= 0) {
      return 0;
    }
    return safeNumber(cfm) / areaFt2;
  }

  function velocityPressureInWg(velocity, densityFactor) {
    return safeNumber(densityFactor, 1) * Math.pow(safeNumber(velocity) / 4005, 2);
  }

  function hoodStaticPressure(hood, ductVp) {
    const slotVp = safeNumber(hood.slotVp);
    const fs = safeNumber(hood.fs);
    const fd = safeNumber(hood.fd);
    const slotLoss = fs * slotVp;
    const ductLoss = fd * ductVp;
    const accelMode = Number(hood.accelMode) === 1;
    const vpAccel = accelMode ? Math.max(slotVp, ductVp) : ductVp;
    return {
      slotVp,
      ductVp,
      fs,
      fd,
      slotLoss,
      ductLoss,
      vpAccel,
      hoodSp: slotLoss + ductLoss + vpAccel
    };
  }

  function frictionLossPerVp(segment, eqDiameterIn) {
    const mode = segment.frictionMode || 'direct';
    if (mode === 'darcy') {
      const f = safeNumber(segment.frictionFactor, 0.02);
      const lengthFt = safeNumber(segment.lengthFt);
      const diameterFt = eqDiameterIn / 12;
      if (diameterFt <= 0) {
        return 0;
      }
      return f * (lengthFt / diameterFt);
    }
    return safeNumber(segment.frictionLossPerVp);
  }

  function fittingKTotal(segment) {
    const elbowCount = safeNumber(segment.elbowCount);
    const elbowK = safeNumber(segment.elbowK);
    const elbowTotal = elbowCount * elbowK;
    const branchEntry = segment.hasBranchEntry ? safeNumber(segment.branchEntryK) : 0;
    const fittings = Array.isArray(segment.fittings) ? segment.fittings : [];
    const specialTotal = fittings.reduce((sum, fitting) => sum + safeNumber(fitting.k), 0);

    return {
      elbowTotal,
      branchEntry,
      specialTotal,
      total: elbowTotal + branchEntry + specialTotal
    };
  }

  function computeSegment(segment, densityFactor, upstreamSp) {
    const geom = segmentGeometry(segment);
    const flow = safeNumber(segment.cfm);
    const velocity = velocityFpm(flow, geom.areaFt2);
    const vp = velocityPressureInWg(velocity, densityFactor);
    const frictionPerVp = frictionLossPerVp(segment, geom.eqDiameterIn);
    const k = fittingKTotal(segment);
    const ductLossPerVp = frictionPerVp + k.total;
    const ductLoss = ductLossPerVp * vp;
    const otherLoss = safeNumber(segment.otherLossInWg);
    const segmentLoss = ductLoss + otherLoss;
    const cumulativeSp = upstreamSp + segmentLoss;

    return {
      id: segment.id,
      description: segment.description || '',
      flow,
      geometry: geom,
      velocity,
      vp,
      lengthFt: safeNumber(segment.lengthFt),
      frictionMode: segment.frictionMode || 'direct',
      frictionPerVp,
      elbowCount: safeNumber(segment.elbowCount),
      elbowK: safeNumber(segment.elbowK),
      elbowLossPerVp: k.elbowTotal,
      hasBranchEntry: !!segment.hasBranchEntry,
      branchEntryK: safeNumber(segment.branchEntryK),
      branchEntryLossPerVp: k.branchEntry,
      fittings: Array.isArray(segment.fittings) ? segment.fittings : [],
      fittingsLossPerVp: k.specialTotal,
      ductLossPerVp,
      ductLoss,
      otherLoss,
      segmentLoss,
      upstreamSp,
      cumulativeSp
    };
  }

  function computeBranch(branch, densityFactor) {
    const segments = Array.isArray(branch.segments) ? branch.segments : [];
    const firstSegment = segments[0] || { cfm: 0, shape: 'round', diameterIn: 0 };
    const firstGeom = segmentGeometry(firstSegment);
    const ductVelocity = velocityFpm(firstSegment.cfm, firstGeom.areaFt2);
    const ductVp = velocityPressureInWg(ductVelocity, densityFactor);
    const hood = hoodStaticPressure(branch.hood || {}, ductVp);

    let runningSp = hood.hoodSp;
    const computedSegments = segments.map((segment) => {
      const computed = computeSegment(segment, densityFactor, runningSp);
      runningSp = computed.cumulativeSp;
      return computed;
    });

    return {
      id: branch.id,
      name: branch.name,
      description: branch.description || '',
      hood,
      segments: computedSegments,
      totalSp: runningSp,
      totalFlow: safeNumber(branch.designCfm)
    };
  }

  function computeSystem(input) {
    const densityFactor = safeNumber(input.densityFactor, 1);
    const branches = (input.branches || []).map((branch) => computeBranch(branch, densityFactor));
    const totalFlow = branches.reduce((sum, branch) => sum + safeNumber(branch.totalFlow), 0);

    const sorted = [...branches].sort((a, b) => b.totalSp - a.totalSp);
    const governing = sorted[0] || null;
    const lowest = sorted[sorted.length - 1] || null;
    const pressureRatio = governing && lowest && lowest.totalSp > 0 ? governing.totalSp / lowest.totalSp : 1;

    const junction = {
      id: 'J-FAN',
      governingSp: governing ? governing.totalSp : 0,
      pressureRatio,
      redesignRecommended: pressureRatio > 1.2,
      paths: branches.map((branch) => ({
        branchId: branch.id,
        branchName: branch.name,
        spDuct: branch.totalSp,
        correctedFlow: branch.totalFlow * Math.sqrt((governing ? governing.totalSp : 0) / Math.max(branch.totalSp, 0.000001)),
        isGoverning: governing ? branch.id === governing.id : false
      }))
    };

    return {
      densityFactor,
      branches,
      totalFlow,
      governingLegId: governing ? governing.id : '—',
      fanSpTarget: governing ? governing.totalSp : 0,
      junctions: [junction]
    };
  }

  globalObj.Calc = {
    safeNumber,
    roundAreaFt2,
    rectangularAreaFt2,
    equivalentDiameterRect,
    segmentGeometry,
    velocityFpm,
    velocityPressureInWg,
    hoodStaticPressure,
    frictionLossPerVp,
    fittingKTotal,
    computeSegment,
    computeBranch,
    computeSystem
  };
})(window);
