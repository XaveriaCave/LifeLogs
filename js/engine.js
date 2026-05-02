// LifeLogs — Core Life Plan Calculation Engine
// Pure calculation functions. No DOM manipulation.

const ENGINE = {

  // ─── Projection Engine ───────────────────────────────────────────────────

  calculateProjection(profile, scenarioId) {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return null;

    const archetype = ARCHETYPES[profile.archetype] || ARCHETYPES.custom;
    const currentSalary = profile.currentSalary || 350000;
    const monthlySavings = profile.monthlySavings || 5000;
    const bankBalance = profile.bankBalance || 0;
    const investments = profile.investments || 0;
    const monthlyEMI = profile.monthlyEMI || 0;

    const netMonthlySavings = monthlySavings - (monthlyEMI * 0.3); // EMI impact
    const annualSavings = Math.max(netMonthlySavings * 12, 0);

    const years = [1, 2, 3, 5, 7, 10];
    const projection = { salary: [], savings: [], netWorth: [], milestones: [] };

    let cumulativeSavings = bankBalance + investments;
    const SIP_RETURN = 0.12; // 12% annual return assumption

    years.forEach(yr => {
      const modifier = this._getModifier(scenario, yr);
      const projectedSalary = Math.round(currentSalary * modifier.salaryMultiplier);
      const projectedAnnualSavings = Math.round(annualSavings * modifier.savingsMultiplier);
      
      // Compound the savings with SIP return
      cumulativeSavings = cumulativeSavings * Math.pow(1 + SIP_RETURN, yr === 1 ? 1 : 1) + projectedAnnualSavings;
      
      projection.salary.push({ year: yr, value: projectedSalary, note: modifier.note });
      projection.savings.push({ year: yr, value: Math.round(projectedAnnualSavings) });
      projection.netWorth.push({ year: yr, value: Math.round(cumulativeSavings) });
    });

    projection.goalWindows = this.calculateGoalWindows(profile, scenario, projection);
    projection.clarityScore = this.calculateClarityScore(profile);
    projection.riskLevel = scenario.riskScore;

    return projection;
  },

  _getModifier(scenario, year) {
    const mods = scenario.yearlyModifiers;
    let closest = mods[0];
    for (const mod of mods) {
      if (mod.year <= year) closest = mod;
      else break;
    }
    return closest;
  },

  // ─── All 3 Scenarios Projection ─────────────────────────────────────────

  calculateAllScenarios(profile) {
    const results = {};
    Object.keys(SCENARIOS).forEach(id => {
      results[id] = this.calculateProjection(profile, id);
    });
    return results;
  },

  // ─── Goal Windows ────────────────────────────────────────────────────────

  calculateGoalWindows(profile, scenario, projection) {
    const goals = profile.goals || [];
    const windows = [];

    goals.forEach(goalId => {
      const goal = GOALS.find(g => g.id === goalId);
      if (!goal) return;

      // Find when cumulative savings crosses goal cost
      const targetCost = goal.cost;
      const netWorthData = projection.netWorth;

      let achievableYear = null;
      for (const pt of netWorthData) {
        if (pt.value >= targetCost && !achievableYear) {
          achievableYear = pt.year;
        }
      }

      const minYear = goal.minYears;
      const maxYear = goal.maxYears;

      windows.push({
        goalId,
        label: goal.label,
        icon: goal.icon,
        targetCost,
        achievableYear: achievableYear || maxYear + 2,
        window: achievableYear
          ? `Year ${Math.max(minYear, achievableYear - 1)}–${achievableYear}`
          : `Beyond ${maxYear} years`,
        feasible: achievableYear !== null && achievableYear <= maxYear + 2,
        likelihood: achievableYear
          ? Math.max(30, Math.min(95, 100 - (achievableYear - minYear) * 8))
          : 15
      });
    });

    return windows;
  },

  // ─── Life Clarity Score ──────────────────────────────────────────────────

  calculateClarityScore(profile) {
    let score = 0;
    const checks = [
      { key: 'name', weight: 5 },
      { key: 'age', weight: 5 },
      { key: 'city', weight: 5 },
      { key: 'archetype', weight: 10 },
      { key: 'currentSalary', weight: 15 },
      { key: 'experience', weight: 5 },
      { key: 'bankBalance', weight: 10 },
      { key: 'monthlySavings', weight: 10 },
      { key: 'goals', weight: 15 },
      { key: 'riskProfile', weight: 10 },
      { key: 'selectedScenario', weight: 10 }
    ];

    checks.forEach(c => {
      const val = profile[c.key];
      if (val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
        score += c.weight;
      }
    });

    return Math.min(100, score);
  },

  // ─── Action Plan Generator ───────────────────────────────────────────────

  generateActionPlan(profile, scenarioId) {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return [];

    const months = [];
    const salary = profile.currentSalary || 350000;
    const monthlySavings = profile.monthlySavings || 5000;

    const plans = {
      upskill_switch: [
        { month: '1–2', tasks: ['Identify top 3 target roles', 'Research required skills', 'Enroll in course / certification', 'Set aside ₹2000/month learning budget'] },
        { month: '3–5', tasks: ['Complete primary certification', 'Build portfolio project #1', 'Connect with 10 people in target field', 'Update LinkedIn profile'] },
        { month: '6–8', tasks: ['Launch portfolio project #2', 'Apply for 5 roles/month', 'Mock interviews weekly', 'Negotiate aggressively — target 40%+ hike'] },
        { month: '9–12', tasks: ['Land offer or evaluate freelance route', 'Rebuild emergency fund', 'Start SIP ₹3000/month minimum', 'Plan Year 2 goals'] }
      ],
      stay_current: [
        { month: '1–3', tasks: ['Request performance review', 'Document all achievements', 'Identify promotion path', 'Start SIP ₹5000/month'] },
        { month: '4–6', tasks: ['Take on one high-visibility project', 'Build relationship with 2 senior mentors', 'Complete internal certification'] },
        { month: '7–9', tasks: ['Review increment cycle timing', 'Negotiate based on documented impact', 'Cross-skill in adjacent area'] },
        { month: '10–12', tasks: ['Evaluate year impact', 'Set next promotion target', 'Increase SIP by ₹2000', 'Build 6-month emergency fund'] }
      ],
      start_business: [
        { month: '1–2', tasks: ['Identify problem + target customer', 'Talk to 20 potential customers', 'Build MVP in 30 days', 'Keep current job — DO NOT QUIT YET'] },
        { month: '3–5', tasks: ['Get first 3 paying customers', 'Track MRR (monthly recurring revenue)', 'Build 6-month personal runway', 'Test pricing aggressively'] },
        { month: '6–9', tasks: ['Revenue target: cover 50% of expenses', 'Decide go full-time checkpoint', 'Build waiting list / pre-orders', 'Cut personal expenses to save runway'] },
        { month: '10–12', tasks: ['Go full-time only if MRR > ₹30,000', 'Hire first VA or contractor if needed', 'Set 12-month revenue target', 'Apply for startup funding if applicable'] }
      ],
      relocate: [
        { month: '1–3', tasks: ['Research target city / country job market', 'Build ₹1.5L relocation fund', 'Update resume for target market', 'Apply to 10 roles remotely'] },
        { month: '4–6', tasks: ['Secure offer (must have before moving)', 'Research visa/permit requirements', 'Lock accommodation remotely', 'Notify current employer 2 months early'] },
        { month: '7–9', tasks: ['Relocate + settle', 'Rebuild local network aggressively', 'Track expenses vs budget closely', 'Identify 3 local professional communities'] },
        { month: '10–12', tasks: ['Request first review', 'Evaluate cost of living vs income delta', 'Set up local SIP / investments', 'Plan first home visit'] }
      ],
      passive_income: [
        { month: '1–2', tasks: ['Start SIP ₹5000–10,000/month', 'Open index fund account', 'Identify 1 digital income stream (content / course / affiliate)', 'Track all expenses — cut 15%'] },
        { month: '3–6', tasks: ['Publish first content piece / product', 'Increase SIP by ₹1000 each month', 'Track passive income (even ₹100 counts)', 'Reinvest 100% of passive earnings'] },
        { month: '7–9', tasks: ['Optimize income stream #1 (SEO, distribution)', 'Launch income stream #2 if stream 1 > ₹5K/month', 'Portfolio rebalance check', 'Tax optimization review'] },
        { month: '10–12', tasks: ['Review: passive income vs target', 'Total portfolio value check', 'Set Year 2 passive income goal', 'Increase SIP to match 20% of income'] }
      ],
      freelance: [
        { month: '1–2', tasks: ['Package skills into clear service offering', 'Build minimal portfolio (3 case studies)', 'Sign up on 2 platforms (Toptal, Upwork, LinkedIn)', 'Set rate 30% higher than you feel comfortable'] },
        { month: '3–5', tasks: ['Reach out to 5 warm contacts for intro projects', 'Deliver first 2 projects at 150% of expectation', 'Ask for testimonials and referrals', 'Build 3-month financial runway'] },
        { month: '6–9', tasks: ['Target first retainer client (recurring ₹20K+/month)', 'Raise rates after 3 successful projects', 'Build inbound pipeline (content / referrals)', 'Decide: stay freelance or build agency'] },
        { month: '10–12', tasks: ['Review: MRR from freelance vs salary', 'Decide full-time vs part-time freelance', 'Optimize tax structure', 'Set Year 2 income target'] }
      ]
    };

    return plans[scenarioId] || plans.stay_current;
  },

  // ─── Smart Recommendations ───────────────────────────────────────────────

  generateRecommendations(profile, allProjections) {
    const recs = [];
    const salary = profile.currentSalary || 350000;
    const savings = profile.monthlySavings || 0;
    const experience = profile.experience || 0;
    const age = profile.age || 25;
    const riskProfile = profile.riskProfile || 'moderate';

    // Savings rate check
    const savingsRate = (savings * 12) / salary;
    if (savingsRate < 0.15) {
      recs.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Low Savings Rate',
        desc: `You\'re saving ${Math.round(savingsRate * 100)}% of income. Target minimum 20%. Even ₹2000/month more changes your 5-year picture significantly.`,
        action: `Increase monthly savings by ₹${Math.round(salary * 0.05 / 12)}`
      });
    }

    // Emergency fund check
    const emergencyFund = profile.bankBalance || 0;
    const monthlyExpenses = (salary / 12) - savings;
    if (emergencyFund < monthlyExpenses * 3) {
      recs.push({
        type: 'critical',
        icon: '🔴',
        title: 'Emergency Fund Too Low',
        desc: 'You need minimum 3–6 months of expenses as liquid savings before taking any major career risk.',
        action: `Build ₹${Math.round(monthlyExpenses * 6)} emergency fund first`
      });
    }

    // Job switch timing
    if (experience >= 2 && experience <= 5 && riskProfile !== 'conservative') {
      recs.push({
        type: 'opportunity',
        icon: '🎯',
        title: 'Prime Switching Window',
        desc: `You\'re in the 2–5 year experience sweet spot — highest salary jump potential with lowest risk. This window closes by year 7.`,
        action: 'Consider upskill + switch path in next 12 months'
      });
    }

    // Age-based recommendation
    if (age < 28 && riskProfile === 'conservative') {
      recs.push({
        type: 'nudge',
        icon: '💡',
        title: 'Risk Capacity Is High',
        desc: 'At your age, time is your biggest asset. Conservative now means missing the highest compounding years. Consider moderate risk.',
        action: 'Re-evaluate risk profile — you have time on your side'
      });
    }

    // Business timing
    if (experience >= 3 && savings >= 10000 && profile.goals?.includes('business')) {
      recs.push({
        type: 'opportunity',
        icon: '🚀',
        title: 'Business Launch Window Approaching',
        desc: 'Your experience and savings rate make a side-business viable in the next 18–24 months. Start building while employed.',
        action: 'Launch validation project in next 3 months'
      });
    }

    return recs;
  },

  // ─── Utility Formatters ──────────────────────────────────────────────────

  formatINR(value) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  },

  formatLPA(annualValue) {
    return `₹${(annualValue / 100000).toFixed(1)} LPA`;
  }
};

window.ENGINE = ENGINE;
