/* =========================================================================
   PABLO - chart engine (no Recharts dependency)
   Hand-built SVG charts for full control over PABLO's visual language.

   Each chart:
     1. Generates synthetic-but-plausible half-hourly data for a UK
        commercial building
     2. Renders into a target <svg> element
     3. Animates in when its host section enters the viewport

   No external deps. Plays nicely with the IntersectionObserver pattern.
   ========================================================================= */

(() => {
  'use strict';

  // ----------------------------------------------------------------
  // Palette mirrors the CSS tokens (so JS can paint matching strokes)
  // ----------------------------------------------------------------
  const C = {
    cream:    '#F2F2E6',
    fg2:      '#C8C5D9',
    fg3:      '#8E8CA8',
    rule:     'rgba(242, 242, 230, 0.10)',
    ruleSoft: 'rgba(242, 242, 230, 0.06)',
    coral:    '#FF5A7D',
    amber:    '#FF9A3C',
    violet:   '#806BFF',
    violetSoft:'rgba(128, 107, 255, 0.18)',
    solar:    '#FFB347',
    grid:     'rgba(178, 188, 210, 0.45)',
    charge:   '#6FE0A8',
    discharge:'#FFB17A',
    indigo:   '#6A5CFF',
    duos:     '#806BFF',
    tnuos:    '#A18AFF',
    bsuos:    '#FF9A3C',
    cfd:      '#FFC36B',
    ccl:      '#FF5A7D',
    margin:   '#FF8FAA',
    wholesale:'rgba(178, 188, 210, 0.55)',
  };

  const ns = 'http://www.w3.org/2000/svg';
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs={}) => {
    const n = document.createElementNS(ns, tag);
    for (const k in attrs) {
      if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    }
    return n;
  };

  // ============================================================
  //  REVEAL - IntersectionObserver across all .p-reveal
  // ============================================================
  const reveals = document.querySelectorAll('.p-reveal');
  const sections = document.querySelectorAll('.p-section');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.dataset.fired) return;
        entry.target.dataset.fired = '1';
        // Also fire any per-section chart hook
        const id = entry.target.id;
        if (id && CHART_HOOKS[id]) CHART_HOOKS[id]();
      }
    });
  }, { threshold: 0.15 });

  // observe both individual reveal layers AND sections (for chart hooks)
  reveals.forEach((r) => io.observe(r));
  sections.forEach((s) => io.observe(s));

  // ============================================================
  //  HERO - bill explosion animation
  //  A simple two-component bill bar at left → fractures into 7
  //  stacked components → forward-projects to the right with each
  //  component growing at its own escalation rate.
  // ============================================================
  const heroSvg = $('bill-explosion');
  function buildHero() {
    if (!heroSvg) return;
    while (heroSvg.firstChild) heroSvg.removeChild(heroSvg.firstChild);
    // Layout: bar on left (x=80, y=80, w=80), exploded stack centre (x=240, w=80),
    // forward projection right (x=360..640) drawn as 8 stacked layers across 7 years.

    const VB_W = 700, VB_H = 500;
    const baseY = 380;          // baseline
    const topY  = 100;          // top of the chart area
    const totalH = baseY - topY; // 280

    // Components, top-to-bottom in the stack (most volatile first)
    const comps = [
      { name: 'DUoS',           share: 0.18, esc: 0.055, color: C.duos },
      { name: 'TNUoS',          share: 0.10, esc: 0.045, color: C.tnuos },
      { name: 'BSUoS / CM',     share: 0.07, esc: 0.040, color: C.bsuos },
      { name: 'CfD · RO · FIT', share: 0.10, esc: 0.030, color: C.cfd },
      { name: 'CCL',            share: 0.06, esc: 0.025, color: C.ccl },
      { name: 'Supplier margin',share: 0.08, esc: 0.020, color: C.margin },
      { name: 'Wholesale',      share: 0.41, esc: 0.012, color: C.wholesale },
    ];

    // Stage 1 - naive 2-component bar (unit-rate + standing-charge)
    const naiveX = 80, naiveW = 70;
    const naiveBar = el('g', { id: 'naiveBar', opacity: 1 });
    const unitH = totalH * 0.85;
    const stdH  = totalH * 0.15;
    naiveBar.appendChild(el('rect', {
      x: naiveX, y: baseY - unitH, width: naiveW, height: unitH,
      fill: C.violet, opacity: 0.85,
    }));
    naiveBar.appendChild(el('rect', {
      x: naiveX, y: baseY - unitH - stdH, width: naiveW, height: stdH,
      fill: C.amber, opacity: 0.85,
    }));
    const lblNaive = el('text', {
      x: naiveX + naiveW/2, y: baseY + 22,
      'text-anchor': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.fg3,
      'letter-spacing': 0.5,
    });
    lblNaive.textContent = 'WHAT YOU SEE';
    naiveBar.appendChild(lblNaive);
    heroSvg.appendChild(naiveBar);

    // Stage 2 - exploded stack (decomposed)
    const explodeX = 200, explodeW = 70;
    const explodedBar = el('g', { id: 'explodedBar', opacity: 0 });
    let cy = baseY;
    comps.forEach((c, i) => {
      const h = totalH * c.share;
      cy -= h;
      const seg = el('rect', {
        x: explodeX, y: cy, width: explodeW, height: h - 1,
        fill: c.color,
        opacity: 0.92,
      });
      seg.dataset.comp = i;
      explodedBar.appendChild(seg);
    });
    const lblExp = el('text', {
      x: explodeX + explodeW/2, y: baseY + 22,
      'text-anchor': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.fg3,
      'letter-spacing': 0.5,
    });
    lblExp.textContent = 'WHAT YOU PAY';
    explodedBar.appendChild(lblExp);
    heroSvg.appendChild(explodedBar);

    // Stage 3 - forward projection: 7 yearly bars at increasing total
    const projStartX = 320, projEndX = 640;
    const projBarW = 28;
    const years = 8;
    const projGap = (projEndX - projStartX - projBarW) / (years - 1);
    const projGroup = el('g', { id: 'projection', opacity: 0 });

    // Compute year-by-year height multiplier (sum of component shares × esc^year)
    const yearStacks = [];
    for (let y = 0; y < years; y++) {
      const stack = [];
      let total = 0;
      comps.forEach(c => {
        const v = c.share * Math.pow(1 + c.esc, y);
        total += v;
        stack.push({ ...c, value: v });
      });
      yearStacks.push({ stack, total });
    }
    const maxTotal = yearStacks[years-1].total;
    // scale so year-0 stack ≈ totalH * 1.0  (and year-N grows from there, capped)
    const yScale = (totalH * 0.92) / yearStacks[0].total;

    yearStacks.forEach((ys, yi) => {
      const x = projStartX + yi * projGap;
      let y = baseY;
      ys.stack.forEach((c, ci) => {
        const h = c.value * yScale;
        y -= h;
        const seg = el('rect', {
          x, y, width: projBarW, height: h - 0.6,
          fill: c.color,
          opacity: 0.9,
        });
        projGroup.appendChild(seg);
      });

      // Year label every other bar to avoid clutter
      if (yi % 2 === 0) {
        const t = el('text', {
          x: x + projBarW/2, y: baseY + 16,
          'text-anchor': 'middle',
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 9, fill: C.fg3,
        });
        t.textContent = 'Y' + (yi * 2);  // Y0 Y2 Y4 Y6 Y8 (visual sketch - not literal)
        projGroup.appendChild(t);
      }
    });
    heroSvg.appendChild(projGroup);

    // Stage 4 - wedge annotation (the gap between naive and real)
    const wedge = el('g', { id: 'wedge', opacity: 0 });
    const wedgeY1 = baseY - totalH * 0.85; // top of naive
    const wedgeY2 = baseY - yearStacks[years-1].total * yScale; // top of last projected
    const wedgePath = el('path', {
      d: `M ${naiveX + naiveW + 8} ${wedgeY1}
          L ${projEndX + projBarW + 8} ${wedgeY2}
          L ${projEndX + projBarW + 8} ${wedgeY1}
          Z`,
      fill: C.coral,
      opacity: 0.10,
    });
    wedge.appendChild(wedgePath);
    const wedgeLabel = el('text', {
      x: 480, y: wedgeY1 - 16,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.coral,
      'letter-spacing': 1.2,
    });
    wedgeLabel.textContent = 'THE WIDENING WEDGE';
    wedge.appendChild(wedgeLabel);

    // Connecting hairline - top of naive to top of last projection
    const wedgeLine = el('line', {
      x1: naiveX + naiveW + 8, y1: wedgeY1,
      x2: projEndX + projBarW + 8, y2: wedgeY2,
      stroke: C.coral, 'stroke-width': 1, 'stroke-dasharray': '3 3',
    });
    wedge.appendChild(wedgeLine);

    heroSvg.appendChild(wedge);

    // Hairline baseline
    heroSvg.insertBefore(el('line', {
      x1: 60, y1: baseY, x2: VB_W - 40, y2: baseY,
      stroke: C.rule, 'stroke-width': 1,
    }), heroSvg.firstChild);

    // ====== ANIMATION ======
    function animate() {
      // Reset
      naiveBar.setAttribute('opacity', 1);
      explodedBar.setAttribute('opacity', 0);
      projGroup.setAttribute('opacity', 0);
      wedge.setAttribute('opacity', 0);

      const segs = explodedBar.querySelectorAll('rect');
      segs.forEach((s) => {
        s.setAttribute('opacity', 0);
        s.setAttribute('transform', 'translate(0, 30)');
      });

      const projBars = projGroup.querySelectorAll('rect');
      projBars.forEach((s) => {
        s.setAttribute('opacity', 0);
        s.setAttribute('transform', 'scale(1, 0)');
        s.style.transformOrigin = '50% ' + baseY + 'px';
      });

      const t0 = performance.now();
      function tick(t) {
        const elapsed = t - t0;

        // 0–800ms: hold on naive bar
        // 800–2200ms: cross-fade to exploded bar (fragments rise into place)
        if (elapsed > 800 && elapsed < 2400) {
          const p = Math.min(1, (elapsed - 800) / 1400);
          const eased = 1 - Math.pow(1-p, 3);
          naiveBar.setAttribute('opacity', String(1 - eased));
          explodedBar.setAttribute('opacity', String(eased));
          segs.forEach((s, i) => {
            const segP = Math.min(1, Math.max(0, (elapsed - 800 - i * 80) / 700));
            const segE = 1 - Math.pow(1-segP, 3);
            s.setAttribute('opacity', String(segE));
            s.setAttribute('transform', 'translate(0, ' + (30 * (1 - segE)) + ')');
          });
        } else if (elapsed >= 2400) {
          naiveBar.setAttribute('opacity', 0);
          explodedBar.setAttribute('opacity', 1);
          segs.forEach(s => { s.setAttribute('opacity', 1); s.setAttribute('transform', 'translate(0,0)'); });
        }

        // 2400–4400ms: forward projection extends left-to-right
        if (elapsed > 2400) {
          const p = Math.min(1, (elapsed - 2400) / 2000);
          projGroup.setAttribute('opacity', String(p));
          projBars.forEach((s, i) => {
            const yearIdx = Math.floor(i / comps.length);
            const start = yearIdx / years;
            const end   = (yearIdx + 1) / years;
            const segP = Math.min(1, Math.max(0, (p - start) / (end - start + 0.0001)));
            const segE = 1 - Math.pow(1-segP, 2);
            s.setAttribute('opacity', String(segE));
            s.setAttribute('transform', 'scale(1, ' + segE + ')');
          });
        }

        // 4400–5500ms: wedge annotation
        if (elapsed > 4400) {
          const p = Math.min(1, (elapsed - 4400) / 1100);
          wedge.setAttribute('opacity', String(p));
        }

        if (elapsed < 5800) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    heroSvg.parentElement.addEventListener('mouseenter', () => animate());
    return animate;
  }
  const heroAnimate = buildHero();

  // ============================================================
  //  SECTION 1 - DECOMPOSITION CHART
  //  Three columns: contracted bar (naive) · reconstructed bar
  //  (exploded) · forward-projection 25-year ribbon
  // ============================================================
  function buildDecompChart() {
    const svg = $('decompChart');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 1100, H = 400;
    const baseY = 350, topY = 30;
    const chartH = baseY - topY;

    const comps = [
      { name: 'DUoS',           share: 0.18, esc: 0.055, color: C.duos },
      { name: 'TNUoS',          share: 0.10, esc: 0.045, color: C.tnuos },
      { name: 'BSUoS / CM',     share: 0.07, esc: 0.040, color: C.bsuos },
      { name: 'CfD · RO · FIT', share: 0.10, esc: 0.030, color: C.cfd },
      { name: 'CCL',            share: 0.06, esc: 0.025, color: C.ccl },
      { name: 'Supplier margin',share: 0.08, esc: 0.020, color: C.margin },
      { name: 'Wholesale',      share: 0.41, esc: 0.012, color: C.wholesale },
    ];

    // ----- Column A - naive (2 components) -----
    const colW = 60;
    const xA = 80;
    const naiveTotal = 1.0;
    const segs = [
      { name: 'Unit rate', value: 0.85, color: C.violet },
      { name: 'Standing charge', value: 0.15, color: C.amber },
    ];
    let y = baseY;
    segs.forEach(s => {
      const h = chartH * s.value * 0.55;  // make naive shorter than reconstructed
      y -= h;
      svg.appendChild(el('rect', {
        x: xA, y, width: colW, height: h - 1,
        fill: s.color, opacity: 0.85,
        class: 'p-decomp-segment-naive',
        'data-label': s.name, 'data-rate': '',
      }));
    });
    const lA = el('text', {
      x: xA + colW/2, y: baseY + 22,
      'text-anchor': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.fg3, 'letter-spacing': 0.8,
    });
    lA.textContent = 'CONTRACTED';
    svg.appendChild(lA);
    const lA2 = el('text', {
      x: xA + colW/2, y: baseY + 38,
      'text-anchor': 'middle',
      'font-family': 'Inter Tight, system-ui, sans-serif',
      'font-size': 11, fill: C.fg3, 'font-style': 'italic',
    });
    lA2.textContent = 'two components';
    svg.appendChild(lA2);

    // ----- Column B - reconstructed -----
    const xB = 200;
    let yB = baseY;
    const compRates = ['p-band 12.4', 'res 4.1', 'BSUoS 0.8', '1.6', '0.7', '4%', 'mkt'];
    comps.forEach((c, i) => {
      const h = chartH * c.share;
      yB -= h;
      const seg = el('rect', {
        x: xB, y: yB, width: colW, height: h - 1,
        fill: c.color, opacity: 0.92,
      });
      seg.dataset.comp = i;
      seg.dataset.label = c.name;
      seg.dataset.rate = compRates[i] + ' p/kWh';
      svg.appendChild(seg);
    });
    const lB = el('text', {
      x: xB + colW/2, y: baseY + 22,
      'text-anchor': 'middle',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.fg3, 'letter-spacing': 0.8,
    });
    lB.textContent = 'RECONSTRUCTED';
    svg.appendChild(lB);
    const lB2 = el('text', {
      x: xB + colW/2, y: baseY + 38,
      'text-anchor': 'middle',
      'font-family': 'Inter Tight, system-ui, sans-serif',
      'font-size': 11, fill: C.fg3, 'font-style': 'italic',
    });
    lB2.textContent = 'sixteen components';
    svg.appendChild(lB2);

    // ----- Column C - 25-year forward projection -----
    const projX0 = 340, projX1 = 1040;
    const years = 25;
    const yearW = (projX1 - projX0) / years;
    // For each year, build a stacked path (filled area for each component)
    const yearTotals = [];
    const compSeries = comps.map(() => []);
    for (let yr = 0; yr <= years; yr++) {
      let runningTotal = 0;
      comps.forEach((c, ci) => {
        const v = c.share * Math.pow(1 + c.esc, yr);
        runningTotal += v;
        compSeries[ci].push({ yr, top: runningTotal, value: v });
      });
      yearTotals.push(runningTotal);
    }
    const projMax = yearTotals[years];
    const projScale = (chartH * 0.92) / projMax;

    // Render stacked areas (bottom-up, each filled to the layer below)
    let prevTops = new Array(years + 1).fill(0);
    comps.forEach((c, ci) => {
      const series = compSeries[ci];
      let path = '';
      for (let i = 0; i <= years; i++) {
        const x = projX0 + i * yearW;
        const yTop = baseY - series[i].top * projScale;
        path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + yTop.toFixed(2) + ' ';
      }
      for (let i = years; i >= 0; i--) {
        const x = projX0 + i * yearW;
        const yBottom = baseY - prevTops[i] * projScale;
        path += 'L' + x.toFixed(2) + ' ' + yBottom.toFixed(2) + ' ';
      }
      path += 'Z';
      const area = el('path', {
        d: path,
        fill: c.color,
        opacity: 0.85,
        class: 'p-decomp-area',
      });
      area.dataset.comp = ci;
      svg.appendChild(area);
      // update prevTops
      prevTops = series.map(s => s.top);
    });

    // X-axis years
    [0, 5, 10, 15, 20, 25].forEach((yr) => {
      const x = projX0 + yr * yearW;
      const t = el('text', {
        x, y: baseY + 22,
        'text-anchor': 'middle',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 10, fill: C.fg3,
      });
      t.textContent = 'Y' + yr;
      svg.appendChild(t);
    });

    // Connecting hairline bracket from B to C top
    const yBtop = baseY - chartH * 1.0;  // top of reconstructed column
    const yCtop0 = baseY - yearTotals[0] * projScale;
    const yCtopN = baseY - yearTotals[years] * projScale;
    svg.appendChild(el('line', {
      x1: xB + colW + 4, y1: yBtop, x2: projX0, y2: yCtop0,
      stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '2 3',
    }));
    // Coral wedge marker for the widening
    svg.appendChild(el('line', {
      x1: projX0, y1: yCtop0, x2: projX1, y2: yCtopN,
      stroke: C.coral, 'stroke-width': 1, 'stroke-dasharray': '4 4',
      opacity: 0.7,
    }));
    const wlabel = el('text', {
      x: projX1 + 4, y: yCtopN + 4,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 10, fill: C.coral, 'letter-spacing': 1.2,
    });
    wlabel.textContent = '+47%';
    svg.appendChild(wlabel);

    // Baseline
    svg.insertBefore(el('line', {
      x1: 60, y1: baseY, x2: W - 40, y2: baseY,
      stroke: C.rule, 'stroke-width': 1,
    }), svg.firstChild);

    // Animate on first reveal: bars rise from zero, projection sweeps
    const naiveSegs = svg.querySelectorAll('.p-decomp-segment-naive');
    naiveSegs.forEach(s => { s.style.transformOrigin = `50% ${baseY}px`; s.style.transform = 'scaleY(0)'; });
    // segments in column B
    Array.from(svg.querySelectorAll('rect[data-comp]')).forEach((s, i) => {
      s.style.transformOrigin = `50% ${baseY}px`;
      s.style.transform = 'scaleY(0)';
      s.style.transition = `transform 700ms cubic-bezier(0.16,1,0.3,1) ${250 + i * 80}ms`;
    });
    naiveSegs.forEach((s, i) => {
      s.style.transition = `transform 700ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`;
    });
    // areas
    const areas = svg.querySelectorAll('.p-decomp-area');
    areas.forEach((a, i) => {
      a.style.opacity = 0;
      a.style.clipPath = 'inset(0 100% 0 0)';
      a.style.transition = `opacity 600ms ease ${1000 + i * 60}ms, clip-path 1400ms cubic-bezier(0.16,1,0.3,1) ${1000 + i * 60}ms`;
    });

    return function animate() {
      naiveSegs.forEach(s => s.style.transform = 'scaleY(1)');
      svg.querySelectorAll('rect[data-comp]').forEach(s => s.style.transform = 'scaleY(1)');
      areas.forEach(a => { a.style.opacity = 0.85; a.style.clipPath = 'inset(0 0% 0 0)'; });
    };
  }
  const decompAnimate = buildDecompChart();

  // ============================================================
  //  SECTION 3 - TEST AN INTERVENTION (interactive)
  // ============================================================
  // Build 14 days × 48 half-hours = 672 points
  const HALF_HOURS = 48;
  const DAYS = 14;
  const N = HALF_HOURS * DAYS;

  // Synthesised demand: weekday 9-5 high, weekend lower, overnight base ~100kW
  function genDemand() {
    const arr = new Array(N);
    for (let i = 0; i < N; i++) {
      const day = Math.floor(i / HALF_HOURS);
      const hh = i % HALF_HOURS;
      const hour = hh / 2;
      const isWeekend = (day % 7 === 5 || day % 7 === 6);
      let base = 110;
      // workday shape: ramp up 6, peak 10–17, ramp down by 19
      let work = 0;
      if (!isWeekend) {
        if (hour >= 6 && hour < 10) work = ((hour - 6) / 4) * 280;
        else if (hour >= 10 && hour < 17) work = 280 + Math.sin((hour-10)/7*Math.PI)*30;
        else if (hour >= 17 && hour < 20) work = ((20 - hour) / 3) * 240;
      } else {
        work = 40 + Math.max(0, Math.sin((hour-9)/12*Math.PI)) * 70;
      }
      // small noise
      const noise = (Math.sin(i * 0.7) * 6) + (Math.cos(i * 1.3) * 4);
      arr[i] = Math.max(60, base + work + noise);
    }
    return arr;
  }
  // Solar generation profile: gaussian around midday, scaled by day-cloud factor
  function genSolar(capacityKW) {
    const arr = new Array(N).fill(0);
    for (let i = 0; i < N; i++) {
      const day = Math.floor(i / HALF_HOURS);
      const hh = i % HALF_HOURS;
      const hour = hh / 2;
      // cloudiness varies by day (deterministic)
      const cloud = 0.6 + 0.4 * Math.sin(day * 0.85);
      let g = 0;
      if (hour >= 6 && hour <= 19) {
        const t = (hour - 6) / 13; // 0-1 across daylight
        g = Math.sin(t * Math.PI);  // bell
        g = g * g; // sharper
      }
      arr[i] = capacityKW * g * cloud;
    }
    return arr;
  }

  const demand = genDemand();
  const solarGen = genSolar(250);  // 250kWp

  // Battery dispatch - simplified rules:
  //  - charge when surplus solar OR off-peak grid (00-05)
  //  - discharge when high-tariff (16-20) OR (peak-shave) when demand > limit
  function simulate({ solar, battery, peakShave, peakLimit }) {
    const out = {
      demand: demand.slice(),
      solarToLoad: new Array(N).fill(0),
      gridImport: new Array(N).fill(0),
      exportArr:  new Array(N).fill(0),
      soc: new Array(N).fill(0),
      charge: new Array(N).fill(0),
      discharge: new Array(N).fill(0),
    };
    const BATT_KWH = 500;       // half-hour energy capacity
    const BATT_KW  = 250;       // power
    const STEP_H = 0.5;
    const STEP_KWH = BATT_KW * STEP_H; // 125 kWh per half-hour at full power
    let soc = BATT_KWH * 0.4;   // start mid

    let totalImport = 0, totalCost = 0, dailyPeak = 0;

    for (let i = 0; i < N; i++) {
      const d = demand[i];
      const s = solar ? solarGen[i] : 0;
      // Solar offsets demand first
      const solarToLoad = Math.min(d, s);
      const surplus = s - solarToLoad;
      let netDemand = d - solarToLoad;

      // Battery decision
      let charge = 0, discharge = 0;
      const hour = (i % HALF_HOURS) / 2;
      const isHighTariff = hour >= 16 && hour < 20;
      const isLowTariff  = hour < 5;

      if (battery) {
        // 1. Charge from surplus solar
        if (surplus > 0 && soc < BATT_KWH) {
          charge = Math.min(surplus, STEP_KWH, BATT_KWH - soc);
        }
        // 2. Charge off-peak from grid
        if (charge === 0 && isLowTariff && soc < BATT_KWH * 0.95) {
          charge = Math.min(STEP_KWH, BATT_KWH - soc);
        }
        // 3. Discharge: peak-shave first
        if (peakShave && netDemand > peakLimit && soc > 0) {
          discharge = Math.min(netDemand - peakLimit, STEP_KWH, soc);
        }
        // 4. Discharge for tariff arbitrage
        if (discharge === 0 && isHighTariff && soc > BATT_KWH * 0.2) {
          discharge = Math.min(STEP_KWH * 0.6, soc - BATT_KWH * 0.2, netDemand);
        }
      }

      soc += charge - discharge;
      soc = Math.max(0, Math.min(BATT_KWH, soc));

      const finalNet = netDemand - discharge + charge - (battery && surplus > 0 && charge > 0 ? Math.min(charge, surplus) : 0);
      const gridImport = Math.max(0, finalNet);
      const exported = Math.max(0, surplus - charge);

      out.solarToLoad[i] = solarToLoad;
      out.gridImport[i] = gridImport;
      out.exportArr[i] = exported;
      out.soc[i] = soc;
      out.charge[i] = charge;
      out.discharge[i] = discharge;

      // metrics from day 0 only
      if (i < HALF_HOURS) {
        totalImport += gridImport * STEP_H;
        // simple tariff: 0.21 p/kWh peak, 0.10 off-peak, 0.18 mid
        const rate = isHighTariff ? 0.28 : isLowTariff ? 0.12 : 0.21;
        totalCost  += gridImport * STEP_H * rate;
        const peakNet = gridImport;
        if (peakNet > dailyPeak) dailyPeak = peakNet;
      }
    }
    out.dailyPeak = dailyPeak;
    out.dailyImport = totalImport;
    out.dailyCost = totalCost;
    return out;
  }

  // Render the load + battery charts based on a state.
  // x positions: span 60..1080 across N samples
  const TX0 = 60, TX1 = 1080;
  const xAt = (i) => TX0 + (i / (N - 1)) * (TX1 - TX0);

  function renderLoadChart(state) {
    const svg = $('loadChart');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const H = 240;
    const TY0 = 20, TY1 = 200;
    // y-scale: max around 500 kW
    const yMax = 520;
    const yAt = (kw) => TY1 - (kw / yMax) * (TY1 - TY0);

    // grid lines
    [100, 200, 300, 400, 500].forEach(kw => {
      svg.appendChild(el('line', {
        x1: TX0, y1: yAt(kw), x2: TX1, y2: yAt(kw),
        stroke: C.ruleSoft, 'stroke-width': 1,
      }));
      const t = el('text', {
        x: TX0 - 8, y: yAt(kw) + 3,
        'text-anchor': 'end',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.fg3,
      });
      t.textContent = kw + 'kW';
      svg.appendChild(t);
    });
    // day separators (every 48 samples)
    for (let d = 1; d < DAYS; d++) {
      const x = xAt(d * HALF_HOURS);
      svg.appendChild(el('line', {
        x1: x, y1: TY0, x2: x, y2: TY1,
        stroke: C.ruleSoft, 'stroke-width': 1,
        'stroke-dasharray': '1 4',
      }));
    }

    // 1) grey area = grid import (from 0 up to grid import value over time)
    let pGrid = '';
    for (let i = 0; i < N; i++) {
      const x = xAt(i), y = yAt(state.gridImport[i]);
      pGrid += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    pGrid += `L ${xAt(N-1)} ${TY1} L ${xAt(0)} ${TY1} Z`;
    svg.appendChild(el('path', {
      d: pGrid, fill: C.grid, opacity: 0.35,
    }));

    // 2) yellow area = solar-to-load (from 0 up to solar)
    const solarOn = state.solarToLoad.some(v => v > 0);
    if (solarOn) {
      let pSolar = '';
      for (let i = 0; i < N; i++) {
        const x = xAt(i), y = yAt(state.solarToLoad[i]);
        pSolar += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      }
      pSolar += `L ${xAt(N-1)} ${TY1} L ${xAt(0)} ${TY1} Z`;
      svg.appendChild(el('path', {
        d: pSolar, fill: C.solar, opacity: 0.45,
      }));
    }

    // 3) export area below baseline (when surplus > 0) - rendered as small downward fills
    const exportOn = state.exportArr.some(v => v > 0);
    if (exportOn) {
      let pExport = '';
      for (let i = 0; i < N; i++) {
        const x = xAt(i);
        const y = TY1 + Math.min((state.exportArr[i] / 200) * 28, 28);
        pExport += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      }
      pExport += `L ${xAt(N-1)} ${TY1} L ${xAt(0)} ${TY1} Z`;
      svg.appendChild(el('path', {
        d: pExport, fill: C.coral, opacity: 0.5,
      }));
    }

    // 4) demand line (cream)
    let pDemand = '';
    for (let i = 0; i < N; i++) {
      const x = xAt(i), y = yAt(state.demand[i]);
      pDemand += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    svg.appendChild(el('path', {
      d: pDemand, fill: 'none', stroke: C.cream,
      'stroke-width': 1.4, 'stroke-linejoin': 'round',
    }));

    // 5) peak-shave dashed line
    if (state.peakShave) {
      svg.appendChild(el('line', {
        x1: TX0, y1: yAt(state.peakLimit), x2: TX1, y2: yAt(state.peakLimit),
        stroke: C.coral, 'stroke-width': 1, 'stroke-dasharray': '5 4',
      }));
      const t = el('text', {
        x: TX1 - 4, y: yAt(state.peakLimit) - 6,
        'text-anchor': 'end',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.coral, 'letter-spacing': 1,
      });
      t.textContent = 'PEAK-SHAVE 200kW';
      svg.appendChild(t);
    }

    // 6) day labels along bottom
    for (let d = 0; d < DAYS; d++) {
      if (d % 2 === 0) {
        const x = xAt(d * HALF_HOURS + HALF_HOURS/2);
        const t = el('text', {
          x, y: TY1 + 28,
          'text-anchor': 'middle',
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 9, fill: C.fg3,
        });
        t.textContent = 'D' + (d + 1);
        svg.appendChild(t);
      }
    }
  }

  function renderBatteryChart(state) {
    const svg = $('batteryChart');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const TY0 = 20, TY1 = 130;
    const yMax = 500;
    const yAt = (kwh) => TY1 - (kwh / yMax) * (TY1 - TY0);

    // grid
    [0, 250, 500].forEach(v => {
      svg.appendChild(el('line', {
        x1: TX0, y1: yAt(v), x2: TX1, y2: yAt(v),
        stroke: C.ruleSoft, 'stroke-width': 1,
      }));
      const t = el('text', {
        x: TX0 - 8, y: yAt(v) + 3,
        'text-anchor': 'end',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.fg3,
      });
      t.textContent = v + 'kWh';
      svg.appendChild(t);
    });

    const batteryOn = state.battery;
    if (batteryOn) {
      // SOC line
      let pSoc = '';
      for (let i = 0; i < N; i++) {
        const x = xAt(i), y = yAt(state.soc[i]);
        pSoc += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      }
      svg.appendChild(el('path', {
        d: pSoc, fill: 'none', stroke: C.violet,
        'stroke-width': 1.4, 'stroke-linejoin': 'round',
      }));

      // charge bars (below baseline)
      const baseY = TY1 + 6;
      for (let i = 0; i < N; i++) {
        if (state.charge[i] > 1) {
          const h = (state.charge[i] / 125) * 16;
          svg.appendChild(el('rect', {
            x: xAt(i) - 0.6, y: baseY,
            width: 1.4, height: h,
            fill: C.charge, opacity: 0.85,
          }));
        }
        if (state.discharge[i] > 1) {
          const h = (state.discharge[i] / 125) * 16;
          svg.appendChild(el('rect', {
            x: xAt(i) - 0.6, y: baseY,
            width: 1.4, height: h,
            fill: C.discharge, opacity: 0.85,
          }));
        }
      }
    } else {
      const t = el('text', {
        x: (TX0 + TX1) / 2, y: (TY0 + TY1) / 2,
        'text-anchor': 'middle',
        'font-family': 'Inter Tight, system-ui, sans-serif',
        'font-style': 'italic',
        'font-size': 12, fill: C.fg3,
      });
      t.textContent = 'Battery off - no dispatch';
      svg.appendChild(t);
    }

    // labels
    const lblL = el('text', {
      x: TX0, y: TY0 - 6,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 9, fill: C.fg3,
      'letter-spacing': 1,
    });
    lblL.textContent = 'BATTERY STATE-OF-CHARGE';
    svg.appendChild(lblL);
  }

  // Test-section wiring
  const testState = {
    solar: false, battery: false, peakShave: false, peakLimit: 200
  };
  const baseSim = simulate(testState);
  const baseDailyPeak = baseSim.dailyPeak;
  const baseDailyImport = baseSim.dailyImport;
  const baseDailyCost = baseSim.dailyCost;

  function updateTest() {
    const sim = simulate(testState);
    renderLoadChart({ ...sim, peakShave: testState.peakShave, peakLimit: testState.peakLimit });
    renderBatteryChart({ ...sim, battery: testState.battery });

    // derived
    const derived = $('testDerived');
    const idle = !testState.solar && !testState.battery && !testState.peakShave;
    derived.classList.toggle('idle', idle);
    const items = derived.querySelectorAll('.p-test-derived-vals');
    items[0].querySelector('.p-test-derived-from').textContent = Math.round(baseDailyPeak) + ' kW';
    items[0].querySelector('.p-test-derived-to').textContent   = Math.round(sim.dailyPeak) + ' kW';
    items[1].querySelector('.p-test-derived-from').textContent = Math.round(baseDailyImport).toLocaleString() + ' kWh';
    items[1].querySelector('.p-test-derived-to').textContent   = Math.round(sim.dailyImport).toLocaleString() + ' kWh';
    items[2].querySelector('.p-test-derived-from').textContent = '£' + Math.round(baseDailyCost);
    items[2].querySelector('.p-test-derived-to').textContent   = '£' + Math.round(sim.dailyCost);
  }
  updateTest(); // initial render

  // Toggles
  document.querySelectorAll('.p-test-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      cancelTestAutoplay();
      const tog = btn.dataset.tog;
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      if (tog === 'solar') testState.solar = !pressed;
      if (tog === 'battery') testState.battery = !pressed;
      if (tog === 'peak') testState.peakShave = !pressed;
      updateTest();
    });
  });

  // Auto-play sequence on first scroll-in
  let testAutoplayTimer = null;
  let testAutoplayCancelled = false;
  function cancelTestAutoplay() {
    testAutoplayCancelled = true;
    if (testAutoplayTimer) { clearTimeout(testAutoplayTimer); testAutoplayTimer = null; }
  }
  function pressToggle(name) {
    if (testAutoplayCancelled) return;
    const btn = document.querySelector(`.p-test-toggle[data-tog="${name}"]`);
    if (!btn) return;
    if (btn.getAttribute('aria-pressed') === 'true') return;
    btn.setAttribute('aria-pressed', 'true');
    if (name === 'solar') testState.solar = true;
    if (name === 'battery') testState.battery = true;
    if (name === 'peak') testState.peakShave = true;
    updateTest();
  }
  function runTestAutoplay() {
    testAutoplayCancelled = false;
    testAutoplayTimer = setTimeout(() => pressToggle('solar'), 600);
    testAutoplayTimer = setTimeout(() => pressToggle('battery'), 2600);
    testAutoplayTimer = setTimeout(() => pressToggle('peak'), 4600);
  }
  // Hover anywhere on canvas pauses
  const testCanvas = $('testCanvas');
  if (testCanvas) testCanvas.addEventListener('mouseenter', cancelTestAutoplay);

  // ============================================================
  //  SECTION 4 - LIFECYCLE PICTURE
  // ============================================================
  function buildLifecycleChart() {
    const svg = $('lifecycleChart');
    if (!svg) return null;

    // Read current params
    const state = {
      horizon: 25,
      discount: 0.05,
      networkEsc: 0.045,
      wholesaleEsc: 0.025,
    };

    function render() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const W = 900, H = 380;
      const padL = 60, padR = 40, padT = 30, padB = 60;
      const X0 = padL, X1 = W - padR;
      const Y0 = padT, Y1 = H - padB;

      const yrs = state.horizon;

      // BAU and With-Intervention cumulative cashflows
      // BAU: pay rising bill every year (network + wholesale + others)
      // Intervention: capex year 0, then reduced bill, then replacement at y10/y15
      const BAU_CASHFLOW = [];
      const INT_CASHFLOW = [];
      const REPLACEMENT_YEARS = [10, 20];   // battery replacement
      const annualBAU0 = 100;  // £k base year
      const annualINT0 = 50;   // 50% reduction after intervention
      let cumBAU = 0, cumINT = 0;
      INT_CASHFLOW.push({ y: 0, c: -250 }); // capex
      cumINT = -250;
      BAU_CASHFLOW.push({ y: 0, c: 0 });

      for (let y = 1; y <= yrs; y++) {
        const escFactor = Math.pow(1 + (state.networkEsc * 0.6 + state.wholesaleEsc * 0.4), y);
        const discFactor = Math.pow(1 + state.discount, y);
        const bau = annualBAU0 * escFactor / discFactor;
        let intCost = annualINT0 * escFactor / discFactor;
        if (REPLACEMENT_YEARS.includes(y)) intCost += 60; // replacement capex
        cumBAU -= bau;
        cumINT -= intCost;
        BAU_CASHFLOW.push({ y, c: cumBAU });
        INT_CASHFLOW.push({ y, c: cumINT });
      }

      // Compute payback year - where INT cumulative > BAU cumulative
      let paybackY = null;
      for (let i = 1; i <= yrs; i++) {
        if (INT_CASHFLOW[i].c > BAU_CASHFLOW[i].c) { paybackY = i; break; }
      }

      // Y range: include both cumulative + bar stacks
      const allValues = [...BAU_CASHFLOW.map(d => d.c), ...INT_CASHFLOW.map(d => d.c)];
      const yMin = Math.min(...allValues, -annualBAU0 * 0.2);
      const yMax = Math.max(0, annualBAU0 * 0.6);
      const yScale = (Y1 - Y0) / (yMax - yMin);
      const yAt = (v) => Y0 + (yMax - v) * yScale;

      const xAtY = (y) => X0 + (y / yrs) * (X1 - X0);

      // Y-axis grid
      const yTicks = [0, -annualBAU0 * yrs * 0.5, -annualBAU0 * yrs, -annualBAU0 * yrs * 1.5];
      yTicks.forEach(v => {
        if (v < yMin || v > yMax) return;
        svg.appendChild(el('line', {
          x1: X0, y1: yAt(v), x2: X1, y2: yAt(v),
          stroke: v === 0 ? C.rule : C.ruleSoft,
          'stroke-width': v === 0 ? 1 : 1,
        }));
        const t = el('text', {
          x: X0 - 8, y: yAt(v) + 3,
          'text-anchor': 'end',
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 9, fill: C.fg3,
        });
        t.textContent = (v >= 0 ? '£' : '−£') + Math.abs(Math.round(v)) + 'k';
        svg.appendChild(t);
      });
      // X axis years
      const xTickEvery = yrs <= 15 ? 5 : 5;
      for (let yr = 0; yr <= yrs; yr += xTickEvery) {
        const x = xAtY(yr);
        const t = el('text', {
          x, y: Y1 + 20,
          'text-anchor': 'middle',
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 9, fill: C.fg3,
        });
        t.textContent = 'Y' + yr;
        svg.appendChild(t);
      }

      // BAU cumulative line (grey/dimmed)
      let pBAU = '';
      BAU_CASHFLOW.forEach((d, i) => {
        const x = xAtY(d.y), y = yAt(d.c);
        pBAU += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      });
      svg.appendChild(el('path', {
        d: pBAU, fill: 'none', stroke: C.fg3,
        'stroke-width': 1.4, 'stroke-dasharray': '5 4',
      }));
      // BAU label
      const lastBAU = BAU_CASHFLOW[BAU_CASHFLOW.length - 1];
      const tBAU = el('text', {
        x: xAtY(lastBAU.y) - 4,
        y: yAt(lastBAU.c) - 6,
        'text-anchor': 'end',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.fg3, 'letter-spacing': 0.8,
      });
      tBAU.textContent = 'BAU';
      svg.appendChild(tBAU);

      // INT cumulative line (violet)
      let pINT = '';
      INT_CASHFLOW.forEach((d, i) => {
        const x = xAtY(d.y), y = yAt(d.c);
        pINT += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      });
      svg.appendChild(el('path', {
        d: pINT, fill: 'none', stroke: C.violet,
        'stroke-width': 1.8,
      }));
      const tINT = el('text', {
        x: xAtY(INT_CASHFLOW[INT_CASHFLOW.length-1].y) - 4,
        y: yAt(INT_CASHFLOW[INT_CASHFLOW.length-1].c) - 6,
        'text-anchor': 'end',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.violet, 'letter-spacing': 0.8,
      });
      tINT.textContent = 'WITH INTERVENTION';
      svg.appendChild(tINT);

      // Wedge fill between the two
      let pWedge = '';
      BAU_CASHFLOW.forEach((d, i) => {
        const x = xAtY(d.y), y = yAt(d.c);
        pWedge += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      });
      for (let i = INT_CASHFLOW.length - 1; i >= 0; i--) {
        const d = INT_CASHFLOW[i];
        const x = xAtY(d.y), y = yAt(d.c);
        pWedge += 'L' + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
      }
      pWedge += 'Z';
      svg.insertBefore(el('path', {
        d: pWedge, fill: C.violet, opacity: 0.10,
      }), svg.lastChild);

      // Replacement event markers
      REPLACEMENT_YEARS.forEach(y => {
        if (y > yrs) return;
        const x = xAtY(y);
        const yPos = yAt(INT_CASHFLOW[y].c);
        svg.appendChild(el('circle', {
          cx: x, cy: yPos, r: 4,
          fill: C.amber, stroke: 'white', 'stroke-width': 1,
        }));
        const t = el('text', {
          x: x + 6, y: yPos - 6,
          'font-family': 'JetBrains Mono, monospace',
          'font-size': 8, fill: C.amber, 'letter-spacing': 0.5,
        });
        t.textContent = 'REPLACE Y' + y;
        svg.appendChild(t);
      });

      // Payback marker
      if (paybackY !== null) {
        const x = xAtY(paybackY);
        svg.appendChild(el('line', {
          x1: x, y1: Y0, x2: x, y2: Y1,
          stroke: C.coral, 'stroke-width': 1, 'stroke-dasharray': '4 3',
        }));
        const marker = $('paybackMarker');
        if (marker) {
          marker.style.display = 'block';
          marker.textContent = 'Payback · Y' + paybackY;
          // Position: parent canvas-relative
          const canvas = svg.parentElement;
          const pct = (paybackY / yrs);
          marker.style.left = (28 + pct * (canvas.clientWidth - 56) - 30) + 'px';
          marker.style.top = '8px';
        }
      } else {
        const marker = $('paybackMarker');
        if (marker) marker.style.display = 'none';
      }

      // Title bands
      const tH = el('text', {
        x: X0, y: 18,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 9, fill: C.fg3, 'letter-spacing': 1.2,
      });
      tH.textContent = 'CUMULATIVE LIFECYCLE CASHFLOW · £k';
      svg.appendChild(tH);
    }
    render();
    return { render, state };
  }
  const lifecycle = buildLifecycleChart();

  // Wire lifecycle params
  if (lifecycle) {
    function fmtPct(v) { return (v * 100).toFixed(1) + '%'; }
    function bind(rangeId, valId, key, mapper, fmt) {
      const range = $(rangeId), label = $(valId);
      if (!range) return;
      range.addEventListener('input', () => {
        const v = mapper(+range.value);
        lifecycle.state[key] = v;
        label.textContent = fmt(v);
        lifecycle.render();
      });
    }
    bind('paramHorizon',  'paramHorizonVal',  'horizon',     v => v,           v => v + ' yr');
    bind('paramDiscount', 'paramDiscountVal', 'discount',    v => v / 1000,    fmtPct);
    bind('paramNetwork',  'paramNetworkVal',  'networkEsc',  v => v / 1000,    fmtPct);
    bind('paramWholesale','paramWholesaleVal','wholesaleEsc',v => v / 1000,    fmtPct);
  }

  // ============================================================
  //  SECTION 5 - BREADTH CANVAS
  //  Six modules cycled at 9s each. Each has its own renderer.
  // ============================================================
  const BREADTH_MODULES = [
    {
      name: 'Network connection',
      tagline: 'Drop the supply capacity band. The 25-year saving appears.',
      readouts: [['Supply capacity', '600 kVA → 400 kVA', 'violet'], ['25-yr saving', '£412k', 'coral']],
      render: renderModuleNetwork,
    },
    {
      name: 'Peak shaving',
      tagline: 'Lower the threshold. The battery dispatches harder.',
      readouts: [['Peak demand', '412 → 198 kW', 'coral'], ['Cycles / yr', '+22', 'amber']],
      render: renderModulePeak,
    },
    {
      name: 'Lifecycle trajectory',
      tagline: 'Switch from 15 to 25 years. The case redraws.',
      readouts: [['Horizon', '25 yr', 'violet'], ['NPV', '£+780k', 'coral']],
      render: renderModuleLifecycle,
    },
    {
      name: 'Load profile',
      tagline: 'Zoom from year to week to half-hour. The granularity is the point.',
      readouts: [['Annual demand', '1.42 GWh', 'violet'], ['Resolution', '30 min', 'amber']],
      render: renderModuleLoad,
    },
    {
      name: 'Tariff pattern',
      tagline: 'Half-hourly bill components, week view. Hover any band.',
      readouts: [['Components', '16', 'violet'], ['Period', 'Mon–Sun', 'amber']],
      render: renderModuleTariff,
    },
    {
      name: 'Scenario comparison',
      tagline: 'BAU vs intervention, side-by-side, lifecycle horizon.',
      readouts: [['Wedge', '£+1.2M', 'coral'], ['Payback', 'Y7', 'violet']],
      render: renderModuleScenario,
    },
  ];

  function makeModuleSVG() {
    return el('svg', {
      viewBox: '0 0 800 380',
      preserveAspectRatio: 'none',
      style: 'width:100%;height:100%;display:block;'
    });
  }

  function renderModuleNetwork(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // Two horizontal bands representing supply capacity bracket - animation drops the bracket
    const W = 800, H = 380, X0 = 40, X1 = 760, Y0 = 60, Y1 = 320;
    // demand line (same as test demand but smoothed)
    let pd = '';
    for (let i = 0; i < HALF_HOURS * 7; i++) {
      const x = X0 + (i / (HALF_HOURS * 7 - 1)) * (X1 - X0);
      const v = demand[i];
      const y = Y1 - (v / 600) * (Y1 - Y0);
      pd += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    svg.appendChild(el('path', {
      d: pd, fill: 'none', stroke: C.cream, 'stroke-width': 1.4,
    }));
    // capacity band - drops from 600 to 400 over t (interaction at 3-6s of 9s)
    const bandStart = 600;
    const bandEnd = 400;
    const reduceP = Math.min(1, Math.max(0, (t - 3) / 3));
    const bandKW = bandStart - (bandStart - bandEnd) * reduceP;
    const bandY = Y1 - (bandKW / 600) * (Y1 - Y0);
    svg.appendChild(el('line', {
      x1: X0, y1: bandY, x2: X1, y2: bandY,
      stroke: C.violet, 'stroke-width': 1.5, 'stroke-dasharray': '6 4',
    }));
    const t2 = el('text', {
      x: X1 - 4, y: bandY - 8,
      'text-anchor': 'end',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': 11, fill: C.violet, 'letter-spacing': 1.2,
    });
    t2.textContent = `SUPPLY CAPACITY ${Math.round(bandKW)} KVA`;
    svg.appendChild(t2);
    // shaded over-band region
    if (reduceP > 0.5) {
      svg.appendChild(el('rect', {
        x: X0, y: bandY, width: X1 - X0, height: 4,
        fill: C.coral, opacity: 0.4,
      }));
    }

    // y axis
    [0, 200, 400, 600].forEach(v => {
      const y = Y1 - (v / 600) * (Y1 - Y0);
      svg.appendChild(el('line', { x1: X0, y1: y, x2: X1, y2: y, stroke: C.ruleSoft }));
      const t = el('text', { x: X0 - 8, y: y + 3, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3 });
      t.textContent = v + 'kW'; svg.appendChild(t);
    });
  }

  function renderModulePeak(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 800, H = 380, X0 = 40, X1 = 760, Y0 = 50, Y1 = 320;
    const reduceP = Math.min(1, Math.max(0, (t - 3) / 3));
    const limit = 350 - reduceP * 150; // 350 → 200

    // demand line
    let pd = '';
    for (let i = 0; i < HALF_HOURS * 5; i++) {
      const x = X0 + (i / (HALF_HOURS * 5 - 1)) * (X1 - X0);
      const v = demand[i];
      const y = Y1 - (v / 500) * (Y1 - Y0);
      pd += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    svg.appendChild(el('path', { d: pd, fill: 'none', stroke: C.cream, 'stroke-width': 1.2 }));
    // post-shave demand
    let pps = '';
    for (let i = 0; i < HALF_HOURS * 5; i++) {
      const x = X0 + (i / (HALF_HOURS * 5 - 1)) * (X1 - X0);
      const v = Math.min(demand[i], limit);
      const y = Y1 - (v / 500) * (Y1 - Y0);
      pps += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    }
    svg.appendChild(el('path', { d: pps, fill: 'none', stroke: C.violet, 'stroke-width': 1.6 }));

    // limit dashed
    const limitY = Y1 - (limit / 500) * (Y1 - Y0);
    svg.appendChild(el('line', { x1: X0, y1: limitY, x2: X1, y2: limitY, stroke: C.coral, 'stroke-width': 1, 'stroke-dasharray': '5 4' }));
    const lt = el('text', { x: X1 - 4, y: limitY - 6, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 11, fill: C.coral, 'letter-spacing': 1.2 });
    lt.textContent = `LIMIT ${Math.round(limit)} KW`;
    svg.appendChild(lt);

    // shaded discharge events
    for (let i = 0; i < HALF_HOURS * 5; i++) {
      const v = demand[i];
      if (v > limit) {
        const x = X0 + (i / (HALF_HOURS * 5 - 1)) * (X1 - X0);
        const y = Y1 - (v / 500) * (Y1 - Y0);
        svg.appendChild(el('rect', {
          x: x - 1, y, width: 2, height: limitY - y, fill: C.discharge, opacity: 0.6,
        }));
      }
    }

    [0, 200, 400].forEach(v => {
      const y = Y1 - (v / 500) * (Y1 - Y0);
      svg.appendChild(el('line', { x1: X0, y1: y, x2: X1, y2: y, stroke: C.ruleSoft }));
      const t = el('text', { x: X0 - 8, y: y + 3, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3 });
      t.textContent = v + 'kW'; svg.appendChild(t);
    });
  }

  function renderModuleLifecycle(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 800, H = 380, X0 = 60, X1 = 760, Y0 = 50, Y1 = 320;
    const horizon = t < 4 ? 15 : (t < 5 ? 15 + Math.round((t - 4) * 10) : 25);
    // BAU/INT cumulative
    const bau = []; const int_ = [];
    let cb = 0, ci = -250;
    bau.push(0); int_.push(-250);
    for (let y = 1; y <= horizon; y++) {
      cb -= 100 * Math.pow(1.04, y);
      ci -= 50 * Math.pow(1.04, y);
      if (y === 10 || y === 20) ci -= 60;
      bau.push(cb);
      int_.push(ci);
    }
    const allV = [...bau, ...int_];
    const yMin = Math.min(...allV) * 1.05;
    const yMax = 100;
    const yAt = (v) => Y0 + (yMax - v) / (yMax - yMin) * (Y1 - Y0);
    const xAt = (yr) => X0 + (yr / horizon) * (X1 - X0);
    // BAU
    let pBAU = '';
    bau.forEach((c, i) => { pBAU += (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(c).toFixed(2) + ' '; });
    svg.appendChild(el('path', { d: pBAU, fill: 'none', stroke: C.fg3, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }));
    let pINT = '';
    int_.forEach((c, i) => { pINT += (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(c).toFixed(2) + ' '; });
    svg.appendChild(el('path', { d: pINT, fill: 'none', stroke: C.violet, 'stroke-width': 1.8 }));
    // zero baseline
    svg.appendChild(el('line', { x1: X0, y1: yAt(0), x2: X1, y2: yAt(0), stroke: C.rule }));
    // x ticks
    [0, Math.round(horizon/2), horizon].forEach(yr => {
      const t = el('text', { x: xAt(yr), y: Y1 + 20, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3 });
      t.textContent = 'Y' + yr; svg.appendChild(t);
    });
    const ht = el('text', { x: X0, y: Y0 - 16, 'font-family': 'JetBrains Mono, monospace', 'font-size': 11, fill: C.violet, 'letter-spacing': 1.2 });
    ht.textContent = `HORIZON ${horizon} YEARS`; svg.appendChild(ht);
  }

  function renderModuleLoad(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 800, X0 = 40, X1 = 760, Y0 = 50, Y1 = 320;
    const phase = t < 3 ? 'year' : t < 6 ? 'week' : 'half';
    let pts;
    if (phase === 'year') {
      pts = new Array(52).fill(0).map((_, w) => 220 + Math.sin(w / 52 * Math.PI * 2) * 80 + Math.sin(w * 1.7) * 12);
    } else if (phase === 'week') {
      pts = new Array(7 * 24).fill(0).map((_, h) => {
        const day = Math.floor(h / 24);
        const hour = h % 24;
        const isWk = day >= 5;
        let v = 110;
        if (!isWk && hour >= 7 && hour <= 18) v += 200 + Math.sin((hour-7)/11*Math.PI) * 30;
        return v;
      });
    } else {
      pts = demand.slice(0, HALF_HOURS).map(v => v);
    }
    let p = '';
    pts.forEach((v, i) => {
      const x = X0 + (i / (pts.length - 1)) * (X1 - X0);
      const y = Y1 - (v / 500) * (Y1 - Y0);
      p += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
    });
    svg.appendChild(el('path', { d: p, fill: 'none', stroke: C.cream, 'stroke-width': 1.4 }));

    // light area underneath
    let pa = p + `L ${X1} ${Y1} L ${X0} ${Y1} Z`;
    svg.appendChild(el('path', { d: pa, fill: C.violet, opacity: 0.10 }));

    [0, 200, 400].forEach(v => {
      const y = Y1 - (v / 500) * (Y1 - Y0);
      svg.appendChild(el('line', { x1: X0, y1: y, x2: X1, y2: y, stroke: C.ruleSoft }));
      const t = el('text', { x: X0 - 8, y: y + 3, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3 });
      t.textContent = v + 'kW'; svg.appendChild(t);
    });
    const lt = el('text', { x: X0, y: Y0 - 16, 'font-family': 'JetBrains Mono, monospace', 'font-size': 11, fill: C.violet, 'letter-spacing': 1.2 });
    lt.textContent = phase === 'year' ? 'ANNUAL · WEEKLY MEAN' : phase === 'week' ? 'ONE WEEK · HOURLY' : 'ONE DAY · HALF-HOURLY';
    svg.appendChild(lt);
  }

  function renderModuleTariff(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 800, X0 = 40, X1 = 760, Y0 = 50, Y1 = 320;
    const days = 7, hh = 48;
    const total = days * hh;
    const colW = (X1 - X0) / total;
    // Stacked columns: show DUoS RAG bands, TNUoS, BSUoS, wholesale
    for (let i = 0; i < total; i++) {
      const x = X0 + i * colW;
      const hour = (i % hh) / 2;
      // RAG band: red 16-19, amber 7-16 + 19-23, green 23-7
      let duos = 0.10;
      if (hour >= 16 && hour < 19) duos = 0.25;
      else if (hour >= 7 && hour < 23) duos = 0.16;
      const tnuos = 0.05;
      const bsuos = 0.03;
      const wholesale = 0.10 + Math.sin(i * 0.13) * 0.03;
      const total = duos + tnuos + bsuos + wholesale;
      const scale = (Y1 - Y0) / 0.5;
      let yCur = Y1;
      [
        { v: duos, color: hour >= 16 && hour < 19 ? C.coral : (hour >= 7 && hour < 23 ? C.amber : '#5BD89F') },
        { v: tnuos, color: C.tnuos },
        { v: bsuos, color: C.bsuos },
        { v: wholesale, color: C.grid },
      ].forEach(s => {
        const h = s.v * scale;
        yCur -= h;
        svg.appendChild(el('rect', {
          x, y: yCur, width: colW + 0.3, height: h,
          fill: s.color, opacity: 0.85,
        }));
      });
    }
    // day labels
    for (let d = 0; d < days; d++) {
      const x = X0 + (d + 0.5) * hh * colW;
      const tt = el('text', { x, y: Y1 + 18, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3 });
      tt.textContent = ['MON','TUE','WED','THU','FRI','SAT','SUN'][d];
      svg.appendChild(tt);
    }
    const lt = el('text', { x: X0, y: Y0 - 16, 'font-family': 'JetBrains Mono, monospace', 'font-size': 11, fill: C.violet, 'letter-spacing': 1.2 });
    lt.textContent = 'HALF-HOURLY · ALL COMPONENTS';
    svg.appendChild(lt);
  }

  function renderModuleScenario(svg, t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 800, X0 = 60, X1 = 760, Y0 = 60, Y1 = 320;
    const yrs = 25;
    const bau = []; const int_ = [];
    let cb = 0, ci = -250;
    bau.push(0); int_.push(-250);
    for (let y = 1; y <= yrs; y++) {
      cb -= 100 * Math.pow(1.04, y);
      ci -= 50 * Math.pow(1.04, y);
      if (y === 10 || y === 20) ci -= 60;
      bau.push(cb);
      int_.push(ci);
    }
    const allV = [...bau, ...int_];
    const yMin = Math.min(...allV) * 1.05;
    const yMax = 100;
    const yAt = (v) => Y0 + (yMax - v) / (yMax - yMin) * (Y1 - Y0);
    const xAt = (yr) => X0 + (yr / yrs) * (X1 - X0);

    // wedge area
    let pW = '';
    bau.forEach((c, i) => { pW += (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(c).toFixed(2) + ' '; });
    for (let i = int_.length - 1; i >= 0; i--) {
      pW += 'L' + xAt(i).toFixed(2) + ' ' + yAt(int_[i]).toFixed(2) + ' ';
    }
    pW += 'Z';
    const reveal = Math.min(1, Math.max(0, t / 5));
    svg.appendChild(el('path', { d: pW, fill: C.violet, opacity: 0.12 * reveal }));

    let pBAU = '';
    bau.forEach((c, i) => { pBAU += (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(c).toFixed(2) + ' '; });
    svg.appendChild(el('path', { d: pBAU, fill: 'none', stroke: C.fg3, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }));
    let pINT = '';
    int_.forEach((c, i) => { pINT += (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(c).toFixed(2) + ' '; });
    svg.appendChild(el('path', { d: pINT, fill: 'none', stroke: C.violet, 'stroke-width': 1.8 }));
    svg.appendChild(el('line', { x1: X0, y1: yAt(0), x2: X1, y2: yAt(0), stroke: C.rule }));

    // labels
    const tBAU = el('text', { x: X1 - 4, y: yAt(bau[bau.length-1]) - 6, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.fg3, 'letter-spacing': 0.8 });
    tBAU.textContent = 'BAU'; svg.appendChild(tBAU);
    const tINT = el('text', { x: X1 - 4, y: yAt(int_[int_.length-1]) - 6, 'text-anchor': 'end', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, fill: C.violet, 'letter-spacing': 0.8 });
    tINT.textContent = 'INTERVENTION'; svg.appendChild(tINT);
  }

  // Build module DOMs
  const stage = $('breadthStage');
  const dotsHost = $('breadthDots');
  let moduleSVGs = [];
  if (stage && dotsHost) {
    BREADTH_MODULES.forEach((m, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'p-breadth-module' + (i === 0 ? ' active' : '');
      const chartDiv = document.createElement('div');
      chartDiv.className = 'p-breadth-module-chart';
      const svg = makeModuleSVG();
      chartDiv.appendChild(svg);
      wrap.appendChild(chartDiv);
      const aside = document.createElement('div');
      aside.className = 'p-breadth-module-aside';
      m.readouts.forEach(([label, val, color]) => {
        const r = document.createElement('div');
        r.className = 'p-breadth-module-readout';
        r.innerHTML = `<span class="p-breadth-module-readout-label">${label}</span><span class="p-breadth-module-readout-val ${color}">${val}</span>`;
        aside.appendChild(r);
      });
      wrap.appendChild(aside);
      stage.appendChild(wrap);
      moduleSVGs.push(svg);

      const dot = document.createElement('button');
      dot.className = 'p-breadth-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Module ${i+1}: ${m.name}`);
      dot.dataset.idx = i;
      dot.addEventListener('click', () => goTo(i, true));
      dotsHost.appendChild(dot);
    });
  }

  // Cycle controller
  let breadthIdx = 0;
  let breadthTimer = null;
  let breadthRAF = null;
  let breadthStartT = 0;
  let breadthPaused = false;
  const MODULE_MS = 9000;

  function setBreadthLabel() {
    const m = BREADTH_MODULES[breadthIdx];
    $('breadthLabelName').textContent = m.name.toUpperCase();
    $('breadthLabelText').textContent = m.tagline;
  }
  function updateDots() {
    document.querySelectorAll('.p-breadth-dot').forEach((d, i) => {
      d.classList.toggle('active', i === breadthIdx);
      d.classList.toggle('complete', i < breadthIdx);
    });
  }
  function goTo(i, manual) {
    breadthIdx = i;
    document.querySelectorAll('.p-breadth-module').forEach((m, idx) => {
      m.classList.toggle('active', idx === i);
    });
    updateDots();
    setBreadthLabel();
    breadthStartT = performance.now();
    BREADTH_MODULES[i].render(moduleSVGs[i], 0);
    if (manual && !breadthPaused) {
      schedule();
    }
  }
  function tickRender() {
    if (breadthPaused) return;
    const t = (performance.now() - breadthStartT) / 1000;
    if (BREADTH_MODULES[breadthIdx]) {
      BREADTH_MODULES[breadthIdx].render(moduleSVGs[breadthIdx], t);
    }
    breadthRAF = requestAnimationFrame(tickRender);
  }
  function schedule() {
    if (breadthTimer) clearTimeout(breadthTimer);
    breadthTimer = setTimeout(() => {
      goTo((breadthIdx + 1) % BREADTH_MODULES.length, false);
      schedule();
    }, MODULE_MS);
  }
  function startBreadth() {
    if (breadthRAF) return;
    breadthStartT = performance.now();
    tickRender();
    schedule();
  }
  function pauseBreadth() {
    breadthPaused = true;
    if (breadthTimer) clearTimeout(breadthTimer);
    if (breadthRAF) cancelAnimationFrame(breadthRAF);
    breadthRAF = null;
    document.querySelectorAll('.p-breadth-dot.active').forEach(d => d.style.animationPlayState = 'paused');
  }
  function resumeBreadth() {
    if (!breadthPaused) return;
    breadthPaused = false;
    breadthStartT = performance.now();
    tickRender();
    schedule();
    document.querySelectorAll('.p-breadth-dot.active').forEach(d => d.style.animationPlayState = 'running');
  }

  // Pause button
  const pauseBtn = $('breadthPause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (breadthPaused) {
        resumeBreadth();
        pauseBtn.innerHTML = '<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3" height="12"/><rect x="7" y="0" width="3" height="12"/></svg>';
      } else {
        pauseBeath();
      }
    });
    // alias mistype guard
    function pauseBeath() {
      pauseBreadth();
      pauseBtn.innerHTML = '<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><polygon points="0,0 10,6 0,12"/></svg>';
    }
  }

  // Hover pauses / resumes
  const breadthCanvas = $('breadthCanvas');
  if (breadthCanvas) {
    breadthCanvas.addEventListener('mouseenter', pauseBreadth);
    breadthCanvas.addEventListener('mouseleave', resumeBreadth);
  }

  // ============================================================
  //  CHART HOOKS - fire when their section enters viewport
  // ============================================================
  const CHART_HOOKS = {
    hero: () => { if (heroAnimate) heroAnimate(); },
    decomposition: () => { if (decompAnimate) decompAnimate(); },
    test: () => { runTestAutoplay(); },
    breadth: () => { startBreadth(); },
  };
  // Re-attach (the IO callback above references this)
  Object.assign(window, { CHART_HOOKS });
  // make sure hooks fire from the IO above (it reads CHART_HOOKS from outer scope)

  // Initial render: render the first breadth module so it shows immediately
  if (moduleSVGs[0]) BREADTH_MODULES[0].render(moduleSVGs[0], 0);

})();
