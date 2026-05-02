// LifeLogs — Life Scenarios & Rules Engine Data

const SCENARIOS = {
  upskill_switch: {
    id: 'upskill_switch',
    code: 'PATH_01',
    title: 'Upskill & Career Switch',
    subtitle: 'Learn → Jump → Compound',
    icon: '⚔️',
    risk: 'MEDIUM',
    riskScore: 55,
    color: '#00ff9d',
    description: 'Identify skill gap. Invest in targeted learning. Transition to higher-demand role.',
    requirements: { minSavings: 60000, minExperience: 1 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 1.0, savingsMultiplier: 0.7, note: 'Upskilling phase. Side costs for courses.' },
      { year: 2, salaryMultiplier: 1.4, savingsMultiplier: 1.3, note: 'Job switch. 30–60% salary jump typical.' },
      { year: 3, salaryMultiplier: 1.6, savingsMultiplier: 1.6, note: 'First promotion window. Growth accelerates.' },
      { year: 5, salaryMultiplier: 2.1, savingsMultiplier: 2.2, note: 'High-earning trajectory. Compounding begins.' },
      { year: 10, salaryMultiplier: 4.0, savingsMultiplier: 5.0, note: 'Senior / Leadership role. Asset accumulation.' }
    ],
    milestones: {
      career: ['Identify skill gap', 'Complete certification', 'Build portfolio', 'Land switch role', 'First promotion', 'Senior title'],
      financial: ['Fund upskilling costs', '30–60% salary jump', 'Emergency fund rebuilt', 'Investment portfolio started', 'Passive income seeded'],
      lifestyle: ['Budget constraints (Y1)', 'Comfort phase begins', 'Travel possible', 'Vehicle upgrade', 'Housing consideration']
    },
    viability: 71,
    confidence: '68–74%',
    fiveYearUpside: 'HIGH',
    transitionTime: '8–14 months',
    skillsRequired: ['Domain expertise', 'Portfolio projects', 'Interview prep'],
    warnings: ['Income dip in Year 1', 'Requires 6–12 months of savings buffer'],
    tips: ['Start learning before quitting', 'Build network in new field', 'Target 40%+ salary hike at switch']
  },

  stay_current: {
    id: 'stay_current',
    code: 'PATH_02',
    title: 'Stay & Optimize',
    subtitle: 'Specialize → Promote → Compound',
    icon: '🛡️',
    risk: 'LOW',
    riskScore: 20,
    color: '#4ecdc4',
    description: 'Deep specialization in current role. Incremental growth, stable compounding, internal promotions.',
    requirements: { minSavings: 0, minExperience: 0 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 1.08, savingsMultiplier: 1.08, note: 'Annual increment. Deep specialization.' },
      { year: 2, salaryMultiplier: 1.18, savingsMultiplier: 1.18, note: 'Internal promotion possible.' },
      { year: 3, salaryMultiplier: 1.28, savingsMultiplier: 1.30, note: 'Moderate growth continues.' },
      { year: 5, salaryMultiplier: 1.55, savingsMultiplier: 1.65, note: 'Ceiling becomes visible. Plateau risk.' },
      { year: 10, salaryMultiplier: 2.20, savingsMultiplier: 2.80, note: 'Senior specialist. Limited ceiling upside.' }
    ],
    milestones: {
      career: ['Deep specialization', 'Team lead role', 'Internal promotion', 'Domain expert status'],
      financial: ['Steady savings growth', 'SIP investments started', 'Emergency fund 6 months', 'Small investments'],
      lifestyle: ['Stable lifestyle', 'Bike possible Y2', 'Moderate travel Y3', 'Car consideration Y4']
    },
    viability: 84,
    confidence: '80–88%',
    fiveYearUpside: 'STABLE',
    incomeGrowth: '8–12%/year',
    warnings: ['Growth ceiling appears in Year 4–5', 'Market differentiation narrows over time'],
    tips: ['Negotiate hard at each review', 'Build internal visibility', 'Cross-skill adjacently']
  },

  start_business: {
    id: 'start_business',
    code: 'PATH_03',
    title: 'Launch Own Venture',
    subtitle: 'Validate → Risk → Asymmetric Upside',
    icon: '🚀',
    risk: 'HIGH',
    riskScore: 85,
    color: '#e17055',
    description: 'Build while employed. Validate revenue. Go full-time only with runway. High-risk, extreme upside.',
    requirements: { minSavings: 200000, minExperience: 2 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 0.8, savingsMultiplier: 0.5, note: 'Side hustle phase. Split energy. Small revenue.' },
      { year: 2, salaryMultiplier: 1.0, savingsMultiplier: 0.6, note: 'Go full-time decision. High burn period.' },
      { year: 3, salaryMultiplier: 1.5, savingsMultiplier: 0.8, note: 'First traction or pivot. Wide variance.' },
      { year: 5, salaryMultiplier: 3.0, savingsMultiplier: 2.0, note: 'Top quartile outcome. Or restart.' },
      { year: 10, salaryMultiplier: 8.0, savingsMultiplier: 12.0, note: 'Successful exit scenario.' }
    ],
    milestones: {
      career: ['Side project launch', 'First paying customer', 'Full-time transition', 'Hire first employee', 'Break-even', 'Scale phase'],
      financial: ['6-month runway secured', 'Revenue covering 50% expenses', 'Break-even achieved', 'Profit reinvested'],
      lifestyle: ['Significant sacrifice Y1–2', 'Variable lifestyle', 'High stress phase', 'Freedom unlocked Y4+']
    },
    viability: 42,
    confidence: '30–55%',
    fiveYearUpside: 'EXTREME',
    riskLevel: 'HIGH',
    warnings: ['Most fail without 6+ month financial runway', 'Income drops to ₹0 risk is real', 'Mental health cost is high'],
    tips: ['Keep job while building (first 12–18 months)', 'Target side revenue = 50% of expenses before quitting', 'Don\'t build in isolation — get customers first']
  },

  relocate: {
    id: 'relocate',
    code: 'PATH_04',
    title: 'Relocate to New Market',
    subtitle: 'Plan → Adapt → Accelerate',
    icon: '🌍',
    risk: 'MEDIUM',
    riskScore: 50,
    color: '#a29bfe',
    description: 'Target domestic metro or international market. Income often doubles. Expenses spike initially.',
    requirements: { minSavings: 150000, minExperience: 1 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 1.8, savingsMultiplier: 0.9, note: 'Income doubles. Expenses spike. Network rebuild.' },
      { year: 2, salaryMultiplier: 2.0, savingsMultiplier: 1.4, note: 'Settled. Savings velocity increases.' },
      { year: 3, salaryMultiplier: 2.3, savingsMultiplier: 1.9, note: 'Strong growth. Career ceiling much higher.' },
      { year: 5, salaryMultiplier: 3.0, savingsMultiplier: 3.2, note: 'Wealth accumulation accelerates.' },
      { year: 10, salaryMultiplier: 5.0, savingsMultiplier: 7.0, note: 'International career peak.' }
    ],
    milestones: {
      career: ['Research target market', 'Build job pipeline', 'Secure offer', 'Visa/permit process', 'Relocate', 'Network rebuild'],
      financial: ['Relocation fund', 'First-year expense spike budgeted', 'Income doubles', 'Savings accelerate Y2+'],
      lifestyle: ['Culture adjustment Y1', 'New city/country settled', 'Travel opens up', 'International lifestyle']
    },
    viability: 66,
    confidence: '60–72%',
    fiveYearUpside: 'HIGH',
    adjustmentTime: '6–12 months',
    warnings: ['First year expenses spike 40–60%', 'Network starts at zero', 'Visa/permit delays possible'],
    tips: ['Secure job before moving', 'Build 3-month relocation buffer', 'Target cities with high demand in your domain']
  },

  passive_income: {
    id: 'passive_income',
    code: 'PATH_05',
    title: 'Build Passive Income',
    subtitle: 'Invest → Compound → Freedom',
    icon: '💰',
    risk: 'MEDIUM',
    riskScore: 40,
    color: '#f7b731',
    description: 'Systematic investing + side income streams. 3-year horizon. Financial optionality unlocked.',
    requirements: { minSavings: 50000, minExperience: 0 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 1.08, savingsMultiplier: 1.15, note: 'SIP + one digital income stream started.' },
      { year: 2, salaryMultiplier: 1.16, savingsMultiplier: 1.35, note: 'First passive income visible (₹2–8K/month).' },
      { year: 3, salaryMultiplier: 1.26, savingsMultiplier: 1.65, note: 'Consistent passive flows. Reinvest aggressively.' },
      { year: 5, salaryMultiplier: 1.50, savingsMultiplier: 2.40, note: 'Passive covers 20–40% of expenses.' },
      { year: 10, salaryMultiplier: 2.00, savingsMultiplier: 6.00, note: 'Financial independence range unlocked.' }
    ],
    milestones: {
      career: ['Main job optimized', 'Side income stream 1 launched', 'Digital asset built'],
      financial: ['SIP started (₹5K+/month)', 'Emergency fund 6 months', 'Passive income ₹5–20K/month Y3', 'Investment corpus growing'],
      lifestyle: ['Stability maintained', 'Travel funded by passive income', 'Career risk becomes lower-stakes']
    },
    viability: 71,
    confidence: '65–78%',
    fiveYearUpside: 'MEDIUM',
    timeToResults: '2–3 years',
    warnings: ['Requires discipline — most quit in 6 months', 'Returns aren\'t linear — patience needed'],
    tips: ['Start with 1 income stream only', 'Automate savings via SIP', 'Reinvest first 2 years aggressively']
  },

  freelance: {
    id: 'freelance',
    code: 'PATH_06',
    title: 'Go Freelance / Consultant',
    subtitle: 'Package → Position → Premium',
    icon: '⚡',
    risk: 'MEDIUM',
    riskScore: 60,
    color: '#fd79a8',
    description: 'Convert skills into a service business. 2–3x income potential. High freedom, variable income.',
    requirements: { minSavings: 100000, minExperience: 2 },
    yearlyModifiers: [
      { year: 1, salaryMultiplier: 1.2, savingsMultiplier: 0.9, note: 'Building client base. Inconsistent income.' },
      { year: 2, salaryMultiplier: 1.8, savingsMultiplier: 1.4, note: 'Established. Retainer clients secured.' },
      { year: 3, salaryMultiplier: 2.4, savingsMultiplier: 2.0, note: 'Premium positioning. Selective projects.' },
      { year: 5, salaryMultiplier: 3.2, savingsMultiplier: 3.0, note: 'Agency or productized service possible.' },
      { year: 10, salaryMultiplier: 5.0, savingsMultiplier: 6.0, note: 'Top-tier consultant status.' }
    ],
    milestones: {
      career: ['First 3 clients', 'Retainer secured', 'Premium positioning', 'Agency model', 'Thought leader'],
      financial: ['3-month buffer before starting', 'First consistent ₹50K/month', 'Savings resume Y2', 'Tax optimization'],
      lifestyle: ['Location freedom', 'Work hours control', 'Travel while working']
    },
    viability: 65,
    confidence: '58–72%',
    fiveYearUpside: 'HIGH',
    warnings: ['No income guarantee', 'Self-discipline critical', 'No employer benefits'],
    tips: ['Build portfolio before quitting', 'Price yourself 30% higher than you think', 'Get 2 retainer clients before full-time']
  }
};

// Goal definitions with costs and timelines
const GOALS = [
  { id: 'bike', icon: '🏍️', label: 'Buy a Bike', cost: 80000, costMax: 200000, minYears: 1, maxYears: 3 },
  { id: 'car', icon: '🚗', label: 'Buy a Car', cost: 400000, costMax: 1200000, minYears: 2, maxYears: 5 },
  { id: 'home', icon: '🏠', label: 'Own a Home', cost: 2000000, costMax: 8000000, minYears: 5, maxYears: 12 },
  { id: 'travel', icon: '✈️', label: 'International Travel', cost: 150000, costMax: 400000, minYears: 2, maxYears: 5 },
  { id: 'business', icon: '💼', label: 'Start a Business', cost: 200000, costMax: 2000000, minYears: 3, maxYears: 7 },
  { id: 'fi', icon: '🔓', label: 'Financial Independence', cost: 10000000, costMax: 30000000, minYears: 10, maxYears: 20 },
  { id: 'family', icon: '👨‍👩‍👧', label: 'Marriage / Family', cost: 500000, costMax: 1500000, minYears: 1, maxYears: 5 },
  { id: 'abroad', icon: '🌐', label: 'Study / Work Abroad', cost: 1500000, costMax: 5000000, minYears: 2, maxYears: 6 },
  { id: 'retire', icon: '🌴', label: 'Early Retirement', cost: 15000000, costMax: 50000000, minYears: 12, maxYears: 25 },
  { id: 'passive', icon: '📈', label: 'Build Passive Income', cost: 500000, costMax: 3000000, minYears: 3, maxYears: 8 }
];

window.SCENARIOS = SCENARIOS;
window.GOALS = GOALS;
