// LifeLogs — Character Select & Wizard JS

let selectedArchetype = null;
let currentStep = 1;
const TOTAL_STEPS = 7;
let profile = {};
let assets = {};
let loans = [];
let selectedGoals = [];
let commitments = [];
let maritalStatus = null;

const WIZARD_STEPS = [
  { num: 1, name: 'PERSONAL BASE', sub: 'Name, age, location' },
  { num: 2, name: 'CAREER PROFILE', sub: 'Role, salary, experience' },
  { num: 3, name: 'FINANCIAL STATUS', sub: 'Bank, savings, investments' },
  { num: 4, name: 'ASSETS & LIABILITIES', sub: 'Owns, loans, EMIs' },
  { num: 5, name: 'DREAMS & GOALS', sub: 'What you want to achieve' },
  { num: 6, name: 'RISK DNA', sub: 'Your risk appetite' },
  { num: 7, name: 'CONSTRAINTS', sub: 'Limits & commitments' }
];

const RISK_PROFILES = [
  {
    id: 'conservative',
    title: 'CONSERVATIVE — STABILITY SEEKER',
    text: 'You prefer predictable outcomes over high upside. Prioritizes security, steady compounding, and minimal disruption. Best scenarios: Stay & Optimize, Passive Income (safe-mode).'
  },
  {
    id: 'moderate',
    title: 'MODERATE — BALANCED OPERATOR',
    text: "You're comfortable with calculated risks. Want growth but won't bet everything on a long shot. Best scenarios: Upskill + Switch, Passive Income, Freelance."
  },
  {
    id: 'aggressive',
    title: 'AGGRESSIVE — HIGH-STAKES PLAYER',
    text: 'You thrive under pressure and accept volatility for asymmetric upside. Willing to sacrifice short-term stability for long-term gain. Best scenarios: Launch Venture, Relocate, Freelance premium.'
  }
];

// ─── BOOT ──────────────────────────────────────────────────────────────────

window.addEventListener('load', () => {
  new ParticleSystem('particle-canvas');
  setTimeout(() => {
    document.getElementById('boot-line2').style.opacity = '1';
  }, 1200);
  setTimeout(() => {
    document.getElementById('boot-cta').style.display = 'block';
  }, 3200);
});

function startCharSelect() {
  const wipe = document.getElementById('page-wipe');
  wipe.classList.add('wipe-in');
  setTimeout(() => {
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('char-select').style.display = 'block';
    wipe.classList.remove('wipe-in');
    wipe.classList.add('wipe-out');
    setTimeout(() => wipe.classList.remove('wipe-out'), 600);
    buildArchetypeGrid();
  }, 450);
}

// ─── CHARACTER SELECT ───────────────────────────────────────────────────────

function buildArchetypeGrid() {
  const grid = document.getElementById('archetype-grid');
  grid.innerHTML = Object.values(ARCHETYPES).map(a => `
    <div class="archetype-card" id="ac-${a.id}"
      style="--card-color:${a.color}"
      onclick="selectArchetype('${a.id}', this)">
      <div class="ac-sweep"></div>
      <div class="ac-check">✓</div>
      <div class="ac-class">${a.class}</div>
      <span class="ac-icon">${a.icon}</span>
      <div class="ac-title">${a.title}</div>
      <div class="ac-subtitle">${a.subtitle}</div>
      <div class="ac-salary" style="color:${a.color}">
        ₹${(a.baseSalaryMin/100000).toFixed(1)}L – ₹${(a.baseSalaryMax/100000).toFixed(0)}L BASE RANGE
      </div>
      <div class="ac-stats">
        ${buildStatBars(a.stats, a.color)}
      </div>
      <div class="ac-ability" style="border-left-color:${a.color}">
        ⚡ ${a.specialAbility}
      </div>
    </div>
  `).join('');
}

function buildStatBars(stats, color) {
  return Object.entries(stats).map(([key, val]) => `
    <div class="ac-stat-row">
      <div class="ac-stat-label">${key.toUpperCase()}</div>
      <div class="ac-stat-bar">
        <div class="ac-stat-fill" style="width:${val}%;background:${color}"></div>
      </div>
      <div class="ac-stat-num">${val}</div>
    </div>
  `).join('');
}

function selectArchetype(id, el) {
  document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedArchetype = id;
  const btn = document.getElementById('cs-proceed');
  btn.style.opacity = '1';
  btn.style.pointerEvents = 'auto';
}

function proceedToWizard() {
  if (!selectedArchetype) return;
  profile.archetype = selectedArchetype;

  // Pre-seed salary from archetype
  const arch = ARCHETYPES[selectedArchetype];
  const midSalary = Math.round((arch.baseSalaryMin + arch.baseSalaryMax) / 2);
  document.getElementById('f-salary').value = Math.min(midSalary, 2000000);
  updateSalaryDisplay(document.getElementById('f-salary').value);

  const wipe = document.getElementById('page-wipe');
  wipe.classList.add('wipe-in');
  setTimeout(() => {
    document.getElementById('char-select').style.display = 'none';
    document.getElementById('wizard-screen').style.display = 'block';
    buildWizardRail();
    buildGoalsGrid();
    wipe.classList.remove('wipe-in');
    wipe.classList.add('wipe-out');
    setTimeout(() => wipe.classList.remove('wipe-out'), 600);
  }, 450);
}

// ─── WIZARD RAIL ────────────────────────────────────────────────────────────

function buildWizardRail() {
  const rail = document.getElementById('wz-steps');
  rail.innerHTML = WIZARD_STEPS.map(s => `
    <div class="wz-step ${s.num === 1 ? 'active' : ''}" id="wz-step-${s.num}">
      <div class="wz-dot" id="wz-dot-${s.num}">${s.num}</div>
      <div class="wz-step-info">
        <div class="wz-step-name">${s.name}</div>
        <div class="wz-step-sub">${s.sub}</div>
      </div>
    </div>
  `).join('');
}

function updateWizardRail(step) {
  WIZARD_STEPS.forEach(s => {
    const el = document.getElementById(`wz-step-${s.num}`);
    const dot = document.getElementById(`wz-dot-${s.num}`);
    el.classList.remove('active', 'done');
    if (s.num < step) { el.classList.add('done'); dot.innerHTML = '✓'; }
    else if (s.num === step) { el.classList.add('active'); dot.innerHTML = s.num; }
    else { dot.innerHTML = s.num; }
  });
}

// ─── WIZARD NAVIGATION ──────────────────────────────────────────────────────

function wizardNext() {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    showWizardStep(currentStep);
  } else {
    startAnalysis();
  }
}

function wizardBack() {
  if (currentStep > 1) {
    currentStep--;
    showWizardStep(currentStep);
  }
}

function showWizardStep(step) {
  document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`wp-${step}`);
  panel.classList.add('active');
  updateWizardRail(step);
  document.getElementById('wz-progress').textContent = `STEP ${step} OF ${TOTAL_STEPS}`;
  document.getElementById('wz-back').style.display = step > 1 ? 'block' : 'none';
  document.getElementById('wz-next').textContent = step === TOTAL_STEPS ? 'GENERATE MY FUTURE →' : 'NEXT →';

  // Business field visibility
  if (step === 4) {
    document.getElementById('at-business').addEventListener('click', checkBusinessField);
  }
}

function checkBusinessField() {
  const el = document.getElementById('business-field');
  el.style.display = document.getElementById('at-business').classList.contains('owned') ? 'flex' : 'none';
  el.style.flexDirection = 'column';
}

// ─── FORM HELPERS ───────────────────────────────────────────────────────────

function updateSalaryDisplay(val) {
  const n = parseInt(val);
  document.getElementById('salary-display').textContent =
    n >= 100000 ? `₹${(n/100000).toFixed(2)} LPA` : `₹${n.toLocaleString('en-IN')}`;
}

function updateRiskDisplay(val) {
  const idx = parseInt(val);
  const r = RISK_PROFILES[idx];
  const labels = ['rl-conservative', 'rl-moderate', 'rl-aggressive'];
  labels.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.toggle('active', i === idx);
  });
  document.getElementById('risk-desc-title').textContent = r.title;
  document.getElementById('risk-desc-text').textContent = r.text;
}

function selectMarital(val, btn) {
  maritalStatus = val;
  document.querySelectorAll('[id^="ms-"]').forEach(b => {
    b.style.borderColor = '';
    b.style.color = '';
  });
  btn.style.borderColor = 'var(--green)';
  btn.style.color = 'var(--green)';
}

function toggleAsset(id, el) {
  el.classList.toggle('owned');
  assets[id] = el.classList.contains('owned') ? 1 : 0;
  if (id === 'business') checkBusinessField();
}

function toggleCommit(id, btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    if (!commitments.includes(id)) commitments.push(id);
  } else {
    btn.style.borderColor = '';
    btn.style.color = '';
    commitments = commitments.filter(c => c !== id);
  }
}

// ─── GOALS GRID ─────────────────────────────────────────────────────────────

function buildGoalsGrid() {
  const grid = document.getElementById('goals-grid');
  grid.innerHTML = GOALS.map(g => `
    <button class="goal-btn" id="gb-${g.id}" onclick="toggleGoal('${g.id}', this)">
      <span class="gb-icon">${g.icon}</span>
      <div class="gb-label">${g.label}</div>
    </button>
  `).join('');
}

function toggleGoal(id, btn) {
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) {
    if (!selectedGoals.includes(id)) selectedGoals.push(id);
  } else {
    selectedGoals = selectedGoals.filter(g => g !== id);
  }
  updatePrimaryGoalSelect();
}

function updatePrimaryGoalSelect() {
  const sel = document.getElementById('f-primary-goal');
  const current = sel.value;
  sel.innerHTML = '<option value="">WHICH GOAL MATTERS MOST?</option>' +
    selectedGoals.map(id => {
      const g = GOALS.find(g => g.id === id);
      return g ? `<option value="${id}" ${id === current ? 'selected' : ''}>${g.icon} ${g.label}</option>` : '';
    }).join('');
}

// ─── PROFILE COLLECTION ─────────────────────────────────────────────────────

function collectProfile() {
  const g = v => document.getElementById(v)?.value || '';
  const gn = v => parseFloat(document.getElementById(v)?.value) || 0;

  const loansList = Array.from(document.querySelectorAll('#loan-types input[type="checkbox"]:checked'))
    .map(el => el.value);

  profile = {
    ...profile,
    name: g('f-name') || 'OPERATIVE',
    age: gn('f-age') || 25,
    city: g('f-city'),
    education: g('f-education'),
    maritalStatus,
    jobTitle: g('f-jobtitle'),
    experience: gn('f-experience'),
    currentSalary: gn('f-salary'),
    industry: g('f-industry'),
    employment: g('f-employment'),
    bankBalance: gn('f-bank'),
    monthlySavings: gn('f-savings'),
    investments: gn('f-mf') + gn('f-fd'),
    monthlyIncome: gn('f-income'),
    monthlyExpenses: gn('f-expenses'),
    assets,
    loans: loansList,
    monthlyEMI: gn('f-emi'),
    totalDebt: gn('f-debt'),
    businessIncome: gn('f-biz-income'),
    goals: selectedGoals,
    primaryGoal: g('f-primary-goal'),
    riskProfile: RISK_PROFILES[parseInt(g('f-risk') || '1')].id,
    lossTolerance: gn('f-loss-tolerance'),
    runway: gn('f-runway'),
    dependents: gn('f-dependents'),
    locationFlexibility: g('f-location-flex'),
    commitments,
    urgency: g('f-urgency'),
    context: g('f-context'),
    selectedScenario: recommendScenario()
  };

  profile.clarityScore = ENGINE.calculateClarityScore(profile);
}

function recommendScenario() {
  const risk = RISK_PROFILES[parseInt(document.getElementById('f-risk')?.value || '1')].id;
  const primaryGoal = document.getElementById('f-primary-goal')?.value;
  const employment = document.getElementById('f-employment')?.value;

  if (employment === 'business_owner') return 'start_business';
  if (primaryGoal === 'fi' || primaryGoal === 'passive') return 'passive_income';
  if (primaryGoal === 'abroad') return 'relocate';
  if (primaryGoal === 'business') return 'start_business';
  if (risk === 'aggressive') return 'upskill_switch';
  if (risk === 'conservative') return 'stay_current';
  return 'upskill_switch';
}

// ─── AI ANALYSIS SEQUENCE ────────────────────────────────────────────────────

function startAnalysis() {
  collectProfile();
  localStorage.setItem('lifelogs_profile', JSON.stringify(profile));

  const wipe = document.getElementById('page-wipe');
  wipe.classList.add('wipe-in');
  setTimeout(() => {
    document.getElementById('wizard-screen').style.display = 'none';
    const as = document.getElementById('analysis-screen');
    as.style.display = 'flex';
    wipe.classList.remove('wipe-in');
    wipe.classList.add('wipe-out');
    setTimeout(() => wipe.classList.remove('wipe-out'), 600);
    runAnalysisAnimation();
  }, 450);
}

function runAnalysisAnimation() {
  const bars = ['ab-1', 'ab-2', 'ab-3', 'ab-4', 'ab-5'];
  const durations = [800, 600, 700, 500, 900];
  const messages = [
    '// CAREER VECTORS MAPPED...',
    '// FINANCIAL RUNWAY CALCULATED...',
    '// GOAL ALIGNMENT SCORED...',
    '// RISK PROFILE APPLIED...',
    '// SCENARIOS GENERATED...',
    '// YOUR FUTURE IS READY.'
  ];

  bars.forEach((id, i) => {
    setTimeout(() => {
      const bar = document.getElementById(id);
      bar.style.transition = `width ${durations[i]}ms ease`;
      bar.style.width = `${Math.random() * 30 + 70}%`;
      if (i < messages.length) {
        document.getElementById('analysis-status').textContent = messages[i];
      }
    }, i * 700);
  });

  setTimeout(() => {
    document.getElementById('analysis-status').textContent = messages[5];
  }, bars.length * 700);

  setTimeout(() => {
    navigateToDashboard();
  }, bars.length * 700 + 800);
}

function navigateToDashboard() {
  const wipe = document.getElementById('page-wipe');
  wipe.style.background = 'var(--green)';
  wipe.classList.add('wipe-in');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 450);
}
