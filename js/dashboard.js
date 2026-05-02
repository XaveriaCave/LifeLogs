// LifeLogs — Dashboard JS

let profile = {};
let allProjections = {};
let activeScenario = 'upskill_switch';
let activeView = 'timeline';

// ─── INIT ───────────────────────────────────────────────────────────────────

window.addEventListener('load', () => {
  new ParticleSystem('particle-canvas');

  const stored = localStorage.getItem('lifelogs_profile');
  if (stored) {
    try { profile = JSON.parse(stored); } catch(e) { profile = getDefaultProfile(); }
  } else {
    profile = getDefaultProfile();
  }

  activeScenario = profile.selectedScenario || 'upskill_switch';
  allProjections = ENGINE.calculateAllScenarios(profile);

  initSidebar();
  renderTimeline();
  renderScenarios();
  renderFinancials();
  renderActionPlan();
  renderCompare();
  // page-wipe is already hidden off-screen via CSS (translateX(-100%)) — no reveal needed here
});

function getDefaultProfile() {
  return {
    name: 'OPERATIVE', age: 25, city: 'BANGALORE', archetype: 'engineer',
    currentSalary: 350000, experience: 2, monthlySavings: 5000,
    bankBalance: 50000, investments: 0, monthlyEMI: 0,
    goals: ['bike', 'travel', 'car'], riskProfile: 'moderate',
    selectedScenario: 'upskill_switch', clarityScore: 55
  };
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

function initSidebar() {
  const arch = ARCHETYPES[profile.archetype] || ARCHETYPES.engineer;
  document.getElementById('cp-frame').textContent = arch.icon;
  document.getElementById('cp-name').textContent = (profile.name || 'OPERATIVE').toUpperCase();
  document.getElementById('cp-class').textContent = '// ' + arch.class;

  const age = profile.age || 25;
  const lvl = Math.floor((age - 16) / 3) + 1;
  document.getElementById('cp-badge').textContent = `LVL ${lvl}`;

  const score = profile.clarityScore || 55;
  setTimeout(() => {
    document.getElementById('clarity-fill').style.width = score + '%';
    document.getElementById('clarity-pct').textContent = score + '%';
  }, 300);

  document.getElementById('sb-salary').textContent = ENGINE.formatLPA(profile.currentSalary || 350000);
  document.getElementById('sb-savings').textContent = ENGINE.formatINR(profile.monthlySavings || 5000);

  const proj = allProjections[activeScenario];
  const netWorth = proj?.netWorth.find(n => n.year === 5);
  document.getElementById('sb-networth').textContent = netWorth ? ENGINE.formatINR(netWorth.value) : '—';
  document.getElementById('sb-risk').textContent = (profile.riskProfile || 'MODERATE').toUpperCase().slice(0,3);

  // Active scenario badge
  const sc = SCENARIOS[activeScenario];
  if (sc) document.getElementById('active-scenario-badge').textContent = `${sc.code} · ${sc.title.toUpperCase()}`;
}

// ─── VIEW SWITCHING ──────────────────────────────────────────────────────────

function switchView(view, btn) {
  document.querySelectorAll('.db-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sb-nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  if (btn) btn.classList.add('active');
  activeView = view;

  const titles = {
    timeline: '// TIMELINE_ROADMAP',
    scenarios: '// SCENARIO_EXPLORER',
    financials: '// FINANCIAL_PROJECTIONS',
    action: '// ACTION_PLAN',
    compare: '// COMPARE_PATHS'
  };
  document.getElementById('db-view-title').textContent = titles[view] || '// DASHBOARD';

  // Lazy render charts when switching to financials/compare
  if (view === 'financials') setTimeout(renderCharts, 100);
  if (view === 'compare') setTimeout(renderCompare, 100);
}

// ─── TIMELINE ───────────────────────────────────────────────────────────────

function renderTimeline() {
  const proj = allProjections[activeScenario];
  const sc = SCENARIOS[activeScenario];
  if (!proj || !sc) return;

  const milestones = sc.milestones;

  function buildMilestone(text, type, color, likelihood) {
    return `
      <div class="tl-milestone" style="--milestone-color:${color}">
        <div class="tl-m-type">${type}</div>
        <div class="tl-m-text">${text}</div>
        <div class="tl-m-likelihood">
          <div class="tl-m-bar"><div class="tl-m-fill" style="width:${likelihood}%;background:${color}"></div></div>
          <div class="tl-m-pct">${likelihood}%</div>
        </div>
      </div>`;
  }

  // 3-Year milestones
  const threeYr = document.getElementById('tl-3yr');
  const salary3 = proj.salary.find(s => s.year === 3);
  const savings3 = proj.netWorth.find(n => n.year === 3);
  threeYr.innerHTML =
    (milestones.career.slice(0, 2).map(m => buildMilestone(m, '⚔️ CAREER', 'var(--green)', 78)).join('')) +
    buildMilestone(`Projected salary: ${ENGINE.formatLPA(salary3?.value || 0)}`, '💰 FINANCIAL', 'var(--gold)', 71) +
    buildMilestone(`Net worth: ${ENGINE.formatINR(savings3?.value || 0)}`, '📈 SAVINGS', 'var(--teal)', 68) +
    (milestones.lifestyle.slice(0, 1).map(m => buildMilestone(m, '🌟 LIFESTYLE', 'var(--purple)', 65)).join(''));

  // 5-Year milestones
  const fiveYr = document.getElementById('tl-5yr');
  const salary5 = proj.salary.find(s => s.year === 5);
  const savings5 = proj.netWorth.find(n => n.year === 5);
  fiveYr.innerHTML =
    (milestones.career.slice(2, 4).map(m => buildMilestone(m, '⚔️ CAREER', 'var(--green)', 65)).join('')) +
    buildMilestone(`Projected salary: ${ENGINE.formatLPA(salary5?.value || 0)}`, '💰 FINANCIAL', 'var(--gold)', 60) +
    buildMilestone(`Savings corpus: ${ENGINE.formatINR(savings5?.value || 0)}`, '📈 SAVINGS', 'var(--teal)', 58) +
    (milestones.lifestyle.slice(1, 3).map(m => buildMilestone(m, '🌟 LIFESTYLE', 'var(--purple)', 55)).join(''));

  // 10-Year milestones
  const tenYr = document.getElementById('tl-10yr');
  const salary10 = proj.salary.find(s => s.year === 10);
  const savings10 = proj.netWorth.find(n => n.year === 10);
  tenYr.innerHTML =
    (milestones.career.slice(-2).map(m => buildMilestone(m, '⚔️ CAREER', 'var(--green)', 50)).join('')) +
    buildMilestone(`Projected salary: ${ENGINE.formatLPA(salary10?.value || 0)}`, '💰 FINANCIAL', 'var(--gold)', 45) +
    buildMilestone(`Net worth: ${ENGINE.formatINR(savings10?.value || 0)}`, '📈 SAVINGS', 'var(--teal)', 42) +
    (milestones.financial.slice(-2).map(m => buildMilestone(m, '🎯 MILESTONE', 'var(--purple)', 40)).join(''));

  // Goal windows
  renderGoalWindows(proj);
}

function renderGoalWindows(proj) {
  const gwGrid = document.getElementById('gw-grid');
  if (!proj.goalWindows || proj.goalWindows.length === 0) {
    gwGrid.innerHTML = `<div style="grid-column:1/-1;font-family:var(--mono);font-size:0.65rem;color:var(--muted);letter-spacing:1px;">
      // NO GOALS SELECTED · GO TO PROFILE TO ADD GOALS
    </div>`;
    return;
  }
  gwGrid.innerHTML = proj.goalWindows.map(gw => {
    const cls = gw.likelihood > 65 ? 'feasible' : gw.likelihood > 40 ? 'stretch' : 'hard';
    return `
      <div class="gw-card ${cls}">
        <span class="gw-icon">${GOALS.find(g => g.id === gw.goalId)?.icon || '🎯'}</span>
        <div class="gw-label">${gw.label}</div>
        <div class="gw-window">${gw.window}</div>
        <div class="gw-likelihood">~${gw.likelihood}% LIKELY</div>
      </div>`;
  }).join('');
}

// ─── SCENARIOS ──────────────────────────────────────────────────────────────

function renderScenarios() {
  const grid = document.getElementById('sc-grid');
  grid.innerHTML = Object.values(SCENARIOS).map(sc => `
    <div class="sc-card ${sc.id === activeScenario ? 'active' : ''}"
      style="--sc-color:${sc.color}"
      id="sc-card-${sc.id}"
      onclick="activateScenario('${sc.id}')">
      <div class="sc-code">${sc.code}</div>
      <span class="sc-icon">${sc.icon}</span>
      <div class="sc-title">${sc.title}</div>
      <div class="sc-subtitle">${sc.subtitle}</div>
      <div class="sc-risk ${sc.risk.toLowerCase()}">${sc.risk} RISK</div>
      <div class="sc-viability">
        <div class="sc-v-bar"><div class="sc-v-fill" style="width:${sc.viability}%;background:${sc.color}"></div></div>
        <div class="sc-v-pct">${sc.viability}% VIABLE</div>
      </div>
    </div>
  `).join('');

  showScenarioDetail(activeScenario);
}

function activateScenario(id) {
  activeScenario = id;
  profile.selectedScenario = id;
  localStorage.setItem('lifelogs_profile', JSON.stringify(profile));

  document.querySelectorAll('.sc-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`sc-card-${id}`)?.classList.add('active');

  const sc = SCENARIOS[id];
  if (sc) document.getElementById('active-scenario-badge').textContent = `${sc.code} · ${sc.title.toUpperCase()}`;

  showScenarioDetail(id);
  renderTimeline();
  if (activeView === 'financials') renderCharts();
  if (activeView === 'action') renderActionPlan();
}

function showScenarioDetail(id) {
  const sc = SCENARIOS[id];
  const proj = allProjections[id];
  if (!sc || !proj) return;

  const detail = document.getElementById('sc-detail');
  detail.style.display = 'block';
  detail.style.setProperty('--sc-color', sc.color);

  const salary5 = proj.salary.find(s => s.year === 5);
  const savings5 = proj.netWorth.find(n => n.year === 5);

  detail.innerHTML = `
    <div class="sc-detail-header">
      <div class="sc-detail-title" style="color:${sc.color}">${sc.icon} ${sc.code} — ${sc.title.toUpperCase()}</div>
      <div class="sc-risk ${sc.risk.toLowerCase()}">${sc.risk} RISK · ${sc.viability}% VIABLE</div>
    </div>
    <div class="sc-timeline">
      ${sc.yearlyModifiers.map(m => `
        <div class="sc-tl-item">
          <div class="sc-tl-year">YEAR ${m.year}</div>
          <div class="sc-tl-text">${m.note}</div>
        </div>
      `).join('')}
    </div>
    <div class="sc-stats-row">
      <div class="stat-box">
        <div class="stat-label">5-YR SALARY</div>
        <div class="stat-val" style="color:${sc.color}">${ENGINE.formatLPA(salary5?.value || 0)}</div>
        <div class="stat-sub">projected range</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">5-YR SAVINGS</div>
        <div class="stat-val" style="color:${sc.color}">${ENGINE.formatINR(savings5?.value || 0)}</div>
        <div class="stat-sub">corpus estimate</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">CONFIDENCE</div>
        <div class="stat-val" style="color:${sc.color}">${sc.confidence}</div>
        <div class="stat-sub">based on patterns</div>
      </div>
    </div>
    <div style="padding:12px;background:rgba(255,68,68,0.04);border:1px solid rgba(255,68,68,0.15);margin-top:4px;">
      <div style="font-family:var(--mono);font-size:0.55rem;letter-spacing:2px;color:var(--red);margin-bottom:8px;">⚠️ RISK FACTORS</div>
      ${sc.warnings.map(w => `<div style="font-size:0.75rem;color:var(--muted);margin-bottom:4px;">· ${w}</div>`).join('')}
    </div>
    <div style="padding:12px;background:rgba(0,255,157,0.03);border:1px solid var(--border);margin-top:8px;">
      <div style="font-family:var(--mono);font-size:0.55rem;letter-spacing:2px;color:var(--green);margin-bottom:8px;">💡 WINNING MOVES</div>
      ${sc.tips.map(t => `<div style="font-size:0.75rem;color:var(--muted);margin-bottom:4px;">· ${t}</div>`).join('')}
    </div>
    <button class="btn-primary" onclick="activateAndGo('${id}')" style="width:100%;margin-top:16px;">
      SELECT THIS PATH →
    </button>
  `;
}

function activateAndGo(id) {
  activateScenario(id);
  switchView('timeline', document.getElementById('nav-timeline'));
}

// ─── FINANCIALS ──────────────────────────────────────────────────────────────

function renderFinancials() {
  const colors = ['#00ff9d', '#ffd700', '#a29bfe', '#fd79a8', '#4ecdc4', '#e17055'];
  const legend = document.getElementById('fin-legend');
  legend.innerHTML = Object.values(SCENARIOS).map((sc, i) => `
    <div class="fl-item">
      <div class="fl-dot" style="background:${sc.color}"></div>
      ${sc.code} · ${sc.title}
    </div>
  `).join('');

  setTimeout(renderCharts, 200);
}

function renderCharts() {
  const years = [1, 2, 3, 5, 7, 10];
  const datasets = Object.values(SCENARIOS).map(sc => ({
    label: sc.title,
    color: sc.color,
    data: years.map(yr => {
      const proj = allProjections[sc.id];
      const found = proj?.netWorth.find(n => n.year === yr);
      return { year: yr, value: found?.value || 0 };
    })
  }));

  CHARTS.drawLineChart('fin-chart', datasets, { legend: false });

  // Savings bar chart (year 5 comparison)
  const barData = Object.values(SCENARIOS).map(sc => {
    const proj = allProjections[sc.id];
    const found = proj?.netWorth.find(n => n.year === 5);
    return { label: sc.code, value: found?.value || 0, color: sc.color };
  });
  CHARTS.drawBarChart('savings-chart', barData);
}

function updateFinControl(type, val) {
  if (type === 'savings') {
    profile.monthlySavings = parseInt(val);
    document.getElementById('fc-savings-val').textContent = ENGINE.formatINR(parseInt(val));
  } else if (type === 'growth') {
    document.getElementById('fc-growth-val').textContent = val + '%';
  } else if (type === 'return') {
    document.getElementById('fc-return-val').textContent = val + '%';
  }
  allProjections = ENGINE.calculateAllScenarios(profile);
  renderCharts();
}

// ─── ACTION PLAN ─────────────────────────────────────────────────────────────

function renderActionPlan() {
  const sc = SCENARIOS[activeScenario];
  const plan = ENGINE.generateActionPlan(profile, activeScenario);

  // Scenario selector buttons
  const sel = document.getElementById('ap-selector');
  sel.innerHTML = Object.values(SCENARIOS).map(s => `
    <button class="ap-sel-btn ${s.id === activeScenario ? 'active' : ''}"
      onclick="switchActionPlan('${s.id}', this)">
      ${s.icon} ${s.code}
    </button>
  `).join('');

  renderActionMonths(plan);
  renderRecommendations();
}

function switchActionPlan(id, btn) {
  document.querySelectorAll('.ap-sel-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const plan = ENGINE.generateActionPlan(profile, id);
  renderActionMonths(plan);
}

function renderActionMonths(plan) {
  const container = document.getElementById('ap-months');
  container.innerHTML = plan.map((block, bi) => `
    <div class="ap-month-block">
      <div class="ap-month-header">
        <div class="ap-month-label">// MONTH ${block.month}</div>
      </div>
      <div class="ap-tasks">
        ${block.tasks.map((t, ti) => `
          <div class="ap-task" id="apt-${bi}-${ti}">
            <div class="ap-task-check" onclick="toggleTask(this, 'apt-${bi}-${ti}')"></div>
            <div class="ap-task-text">${t}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleTask(checkEl, taskId) {
  checkEl.classList.toggle('done');
  document.getElementById(taskId)?.classList.toggle('done-task');
}

function renderRecommendations() {
  const recs = ENGINE.generateRecommendations(profile, allProjections);
  const grid = document.getElementById('recs-grid');
  if (!recs.length) {
    grid.innerHTML = '<div style="font-family:var(--mono);font-size:0.65rem;color:var(--green);letter-spacing:1px;">// PROFILE LOOKS STRONG · NO CRITICAL ISSUES DETECTED</div>';
    return;
  }
  grid.innerHTML = recs.map(r => `
    <div class="rec-card ${r.type}">
      <div class="rec-icon">${r.icon}</div>
      <div class="rec-title">${r.title}</div>
      <div class="rec-desc">${r.desc}</div>
      <div class="rec-action">→ ${r.action}</div>
    </div>
  `).join('');
}

// ─── COMPARE ────────────────────────────────────────────────────────────────

function renderCompare() {
  const aId = document.getElementById('cmp-a')?.value || 'upskill_switch';
  const bId = document.getElementById('cmp-b')?.value || 'stay_current';
  const scA = SCENARIOS[aId];
  const scB = SCENARIOS[bId];
  const projA = allProjections[aId];
  const projB = allProjections[bId];
  if (!scA || !scB || !projA || !projB) return;

  const salary5A = projA.salary.find(s => s.year === 5)?.value || 0;
  const salary5B = projB.salary.find(s => s.year === 5)?.value || 0;
  const nw5A = projA.netWorth.find(n => n.year === 5)?.value || 0;
  const nw5B = projB.netWorth.find(n => n.year === 5)?.value || 0;
  const nw10A = projA.netWorth.find(n => n.year === 10)?.value || 0;
  const nw10B = projB.netWorth.find(n => n.year === 10)?.value || 0;

  const area = document.getElementById('cmp-stats-area');
  area.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div class="cmp-col-header" style="border-left:3px solid ${scA.color}">
        <div class="cmp-col-name" style="color:${scA.color}">${scA.icon} ${scA.title}</div>
        <div class="sc-risk ${scA.risk.toLowerCase()}">${scA.risk}</div>
      </div>
      <div class="cmp-col-header" style="border-left:3px solid ${scB.color}">
        <div class="cmp-col-name" style="color:${scB.color}">${scB.icon} ${scB.title}</div>
        <div class="sc-risk ${scB.risk.toLowerCase()}">${scB.risk}</div>
      </div>
    </div>
    ${buildCmpRow('5-YR SALARY', ENGINE.formatLPA(salary5A), ENGINE.formatLPA(salary5B), salary5A > salary5B, scA.color, scB.color)}
    ${buildCmpRow('5-YR NET WORTH', ENGINE.formatINR(nw5A), ENGINE.formatINR(nw5B), nw5A > nw5B, scA.color, scB.color)}
    ${buildCmpRow('10-YR NET WORTH', ENGINE.formatINR(nw10A), ENGINE.formatINR(nw10B), nw10A > nw10B, scA.color, scB.color)}
    ${buildCmpRow('VIABILITY', scA.viability + '%', scB.viability + '%', scA.viability > scB.viability, scA.color, scB.color)}
    ${buildCmpRow('RISK SCORE', scA.riskScore, scB.riskScore, scA.riskScore < scB.riskScore, scA.color, scB.color)}
    ${buildCmpRow('CONFIDENCE', scA.confidence, scB.confidence, false, scA.color, scB.color)}
  `;

  // Radar chart
  const archA = ARCHETYPES[profile.archetype] || ARCHETYPES.engineer;
  CHARTS.drawRadarChart('radar-chart',
    [
      { values: [scA.riskScore, projA.salary[4]?.value ? 80 : 50, nw5A / 500000, scA.viability, 100 - scA.riskScore, 60], color: scA.color },
      { values: [scB.riskScore, projB.salary[4]?.value ? 75 : 45, nw5B / 500000, scB.viability, 100 - scB.riskScore, 70], color: scB.color }
    ],
    ['RISK', 'INCOME', 'WEALTH', 'VIABILITY', 'STABILITY', 'FREEDOM']
  );
}

function buildCmpRow(label, valA, valB, aWins, colorA, colorB) {
  return `
    <div class="cmp-row">
      <div class="cmp-stat ${aWins ? 'cmp-winner' : ''}">
        <div class="cmp-stat-label">${label}</div>
        <div class="cmp-stat-val" style="color:${aWins ? colorA : 'var(--muted)'}">${valA} ${aWins ? '▲' : ''}</div>
      </div>
      <div class="cmp-stat ${!aWins && valA !== valB ? 'cmp-winner' : ''}">
        <div class="cmp-stat-label">${label}</div>
        <div class="cmp-stat-val" style="color:${!aWins && valA !== valB ? colorB : 'var(--muted)'}">${valB} ${!aWins && valA !== valB ? '▲' : ''}</div>
      </div>
    </div>`;
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function backToMenu() {
  const wipe = document.getElementById('page-wipe');
  wipe.style.background = 'var(--bg)';
  wipe.style.border = '1px solid var(--green)';
  wipe.classList.add('wipe-in');
  setTimeout(() => { window.location.href = 'index.html'; }, 450);
}

function editProfile() {
  const wipe = document.getElementById('page-wipe');
  wipe.style.background = 'var(--green)';
  wipe.classList.add('wipe-in');
  setTimeout(() => {
    localStorage.setItem('lifelogs_edit_mode', '1');
    window.location.href = 'index.html';
  }, 450);
}
