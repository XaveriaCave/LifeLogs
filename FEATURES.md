# ArshMind — Complete Feature Listing

> Version 1.0 · Browser-native · Zero backend · India-focused financial context

---

## 🎮 Onboarding Experience

### Boot Screen
- Animated expanding rectangular rings (COD-style asset reveal)
- Progressive terminal text sequence with loading lines
- Gradient progress bar with 3-second auto-complete
- `[ PRESS TO BEGIN ]` call-to-action with glow hover effect
- Full-page green wipe transition to character select

### Character Select
- **8 profession archetypes** rendered as interactive stat cards:
  - Software Engineer, Doctor / Medical, Government / Civil Services
  - Finance / Analyst, Creative / Designer, Entrepreneur / Founder
  - Student / Fresher, Custom Profile
- Each card displays:
  - Class designation (e.g. TECH_OPS, MEDIC_CORPS, FOUNDER_ELITE)
  - Salary range (base min–max in LPA)
  - 5-axis stat bars (Income, Growth, Stability, Freedom, Creativity)
  - Special ability (unique mechanic flavor text)
  - Hover: top accent line draw, radial background glow, semi-circle sweep
  - Selected: persistent check badge + border highlight
- Proceed button activates only after a selection is made

---

## 📋 7-Step Onboarding Wizard

### Desktop Navigation
- Persistent left-rail step tracker with 7 nodes
- Step states: upcoming (dim) → active (green glow) → done (filled ✓)
- Connecting lines between steps fill green as user progresses
- Privacy note pinned to bottom of rail: "All data stays in your browser"

### Mobile Navigation
- Sticky horizontal pill-rail at top of screen
- Each step is a compact pill with number badge + label
- Active pill auto-scrolls into view
- Thin progress bar fills across full width
- Back/Next buttons at bottom of each panel

### Step 1 — Personal Base
- Name input (pre-fills dashboard character portrait)
- Age (numeric, 16–65)
- City / Location text field
- Education level dropdown (6 tiers: High School → Professional Degree)
- Marital status toggle buttons (Single / Married / In Relationship)

### Step 2 — Career Profile
- Job title free text
- Years of experience (numeric)
- **Annual salary slider** — ₹1L to ₹50L range with live LPA display
- Industry dropdown (9 sectors: Tech, Finance, Healthcare, Govt, etc.)
- Employment type dropdown (Full-time, Self-employed, Freelance, Business owner, Student, Unemployed)
- Archetype pre-seeds the salary slider to the midpoint of its range

### Step 3 — Financial Status
- Bank balance (all accounts combined)
- Monthly savings (after all expenses + EMIs)
- Mutual funds / stocks (current market value)
- Fixed deposits / PPF / gold
- Monthly take-home income
- Monthly expenses (excluding EMIs)

### Step 4 — Assets & Liabilities
- **8 toggle-owned asset buttons**: Bike/2W, Car/4W, Property, Gold, Business, Land, Stocks/MF, Crypto
- Visual check badge appears on selected assets
- **6 loan checkboxes**: Home loan, Vehicle loan, Personal loan, Education loan, Business loan, Credit card dues
- Total monthly EMI field
- Total outstanding debt field
- Conditional business income field (appears only if Business asset is toggled on)

### Step 5 — Dreams & Goals
- **10 selectable goal buttons** with emoji icons:
  - Buy a Bike, Buy a Car, Own a Home, International Travel
  - Start a Business, Financial Independence, Marriage / Family
  - Study / Work Abroad, Early Retirement, Build Passive Income
- Multi-select supported
- Primary goal priority dropdown (auto-populates from selected goals)
- Primary goal drives the recommended scenario

### Step 6 — Risk DNA
- **3-position slider**: Conservative → Moderate → Aggressive
- Active label highlights as slider moves
- Live-updating risk description panel with title + explanation text
- Monthly income-loss tolerance field (how much drop is acceptable during transition)
- Financial runway field (months survivable without income)

### Step 7 — Constraints
- Number of dependents
- Location flexibility dropdown (Locked / Same City / Anywhere in India / Global)
- **5 commitment toggle buttons**: Aging Parents, Young Children, Heavy EMIs, Health Considerations, Notice Period Locked
- Timeline urgency dropdown (Patient 5–10yr / Moderate 3–5yr / Urgent 1–2yr)
- Free-text context field (3 rows, for any extra information)

### Analysis Animation Screen
- Full-page overlay with 3 spinning concentric ring animations
- 5 labeled loading bars animate sequentially with staggered timing:
  Career Vectors → Financial Runway → Goal Alignment → Risk Calibration → Scenario Mapping
- Status text cycles through 6 messages
- Auto-navigates to dashboard after ~5 seconds

---

## 📊 Dashboard — 5 Views

### Sidebar (persistent)
- Logo wordmark
- **Character portrait**: archetype emoji icon + operative name + class tag
- Level badge (calculated from age: `floor((age - 16) / 3) + 1`)
- **Life Clarity Score** progress bar (gradient green→gold, animated on load)
  - Score calculated from 11 weighted profile completeness checks
- **4 quick-stat tiles**: Current Salary, Savings/Month, 5-Year Net Worth, Risk Profile
- Navigation rail: Timeline, Scenarios, Financials, Action Plan, Compare
- Edit Profile button (returns to wizard)
- Back to Menu button (returns to character select)

### Mobile-specific Dashboard UI
- Fixed hamburger button (top-left) — opens sidebar drawer
- Full-width sidebar drawer slides in from left with backdrop overlay
- **Bottom navigation bar** — 5 icon+label buttons for all views
- View switching syncs both sidebar rail and bottom nav simultaneously

---

### View 1 — Timeline Roadmap

**3-Column Milestone Grid (3-Year / 5-Year / 10-Year)**

Each column contains milestone cards color-coded by category:
- ⚔️ Career milestones (green) — pulled from active scenario's milestone array
- 💰 Financial milestones (gold) — projected salary at that horizon
- 📈 Savings milestones (teal) — projected net worth / corpus
- 🌟 Lifestyle milestones (purple) — lifestyle notes from scenario data

Each milestone card includes:
- Type badge, text content
- Likelihood progress bar with percentage (declines toward 10-year)

**Goal Windows Section**
- One card per selected goal
- Shows: goal icon, label, achievable year range (e.g. "Year 2–3")
- Likelihood percentage based on savings-to-cost trajectory
- Visual classification: `feasible` (green border) / `stretch` (gold border) / `hard` (red border)
- Recalculates automatically when active scenario changes

---

### View 2 — Scenario Explorer

**6 Scenario Cards**
- Upskill & Switch, Stay & Optimize, Launch Own Venture, Relocate to New Market, Build Passive Income, Go Freelance
- Each card: code tag, icon, title, subtitle, risk badge (Low/Medium/High), viability bar
- Active scenario has persistent top accent border
- Click any card to activate it → updates Timeline, Action Plan, sidebar badge

**Expandable Detail Panel** (opens below cards on click)
- Scenario title, risk + viability badge
- Year-by-year modifier table (Year 1/2/3/5/10 with explanatory notes)
- 3 stat boxes: 5-year salary, 5-year savings, confidence range
- Risk factors block (red border, warning list)
- Winning moves block (green border, tips list)
- "Select This Path" primary button → activates scenario and navigates to Timeline

---

### View 3 — Financial Projections

**3 Interactive Control Sliders**
- Monthly Savings Rate (₹1K–₹1L, step ₹1K) — live updates projections
- Annual Salary Growth % (5–50%) — affects projection calculations
- Investment Return % (6–25%) — SIP return assumption

**Chart 1 — 10-Year Net Worth Projection (Line Chart)**
- 6 datasets, one per scenario, each in its scenario color
- Smooth bezier curves with area fills
- X-axis: Year 1/2/3/5/7/10
- Y-axis: auto-scaled with ₹ formatting (K/L/Cr)
- Interactive legend with scenario labels
- DPI-aware canvas rendering

**Chart 2 — 5-Year Savings Comparison (Bar Chart)**
- One bar per scenario colored by scenario palette
- Gradient fill from solid top to 40% opacity bottom
- Top 2px highlight stripe
- DPI-aware canvas rendering

**Color Legend** — inline labels for all 6 scenario datasets

---

### View 4 — Action Plan

**Scenario Selector Tabs**
- 6 buttons, one per scenario with icon + code
- Switch between plans without changing the active dashboard scenario

**Month-by-Month Execution Blocks**
Four time blocks per scenario (Month 1–2, 3–5, 6–9, 10–12 approximate):
- Each block has a month header + task list
- Tasks are checkable — click check box to mark done
- Completed tasks get strikethrough + reduced opacity
- State is maintained in DOM for the session

**Smart Recommendations Panel** (below tasks)
Up to 4 contextual recommendation cards, each classified:
- ⚠️ Warning — low savings rate (triggers if saving < 15% of income)
- 🔴 Critical — emergency fund too low (triggers if bank balance < 3× monthly expenses)
- 🎯 Opportunity — prime switching window (triggers if experience 2–5 years, non-conservative)
- 💡 Nudge — risk capacity reminder (triggers if age < 28 and risk = conservative)
- 🚀 Business — launch window approaching (triggers if experience ≥ 3 years, savings ≥ ₹10K, business goal selected)

Each rec card: icon, title, description, → action text

---

### View 5 — Compare Paths

**2 Scenario Selectors**
- Path A and Path B dropdowns (any 2 of 6 scenarios)
- Re-renders comparison on any change

**Side-by-Side Stat Comparison**
For each metric, the winning side gets highlighted with scenario color + ▲ indicator:
- 5-Year Salary (LPA)
- 5-Year Net Worth
- 10-Year Net Worth
- Viability percentage
- Risk Score
- Confidence range

**Capability Radar Chart (Canvas)**
- 6-axis polygon overlay of both paths
- Axes: Risk, Income, Wealth, Viability, Stability, Freedom
- Each dataset fills with 15% opacity + solid 2px border
- Dot markers at each axis point
- DPI-aware, auto-redraws on selector change

---

## 🎨 Design System Features

### Visual Effects
- **Particle system** — geometric shapes (rect, square, line, cross, bracket) drift across a fixed canvas background on both pages
- **Scanline overlay** — subtle 4px repeating gradient for CRT texture
- **Grid overlay** — 40px green mesh at 2% opacity
- **Page wipe transitions** — full-screen skewed panel sweeps between pages
- **Glitch text** — RGB-split animation on any `.glitch` element
- **Pulse glow** — box-shadow breathing animation
- **Bracket draw** — corner bracket reveal animation on hover

### Component Library
| Component | Description |
|-----------|-------------|
| `.hud-input` | Dark glass text input with green focus ring |
| `.hud-select` | Styled dropdown with custom SVG chevron |
| `.hud-range` | Custom range slider with diamond-shaped thumb |
| `.btn-primary` | Clipped parallelogram button with shimmer hover |
| `.btn-ghost` | Outline button with green hover transition |
| `.btn-danger` | Red-tinted outline button |
| `.glass-card` | Frosted dark surface with backdrop blur |
| `.stat-box` | Padded metric tile with label/value/sub |
| `.section-tag` | Small-caps label with leading line decoration |
| `.seg-bar` | Segmented progress indicator with filled/unfilled states |

### Responsive Breakpoints
- **Desktop** (>1024px): Full 2-column dashboard, 4-column archetype grid
- **Tablet** (768–1024px): Narrowed sidebar, stacked grid layouts
- **Mobile** (<768px): Hidden sidebar → drawer, bottom nav, horizontal wizard pill rail, all grids stack to 1 column

---

## 🔧 Technical Features

| Feature | Detail |
|---------|--------|
| **Zero dependencies** | No npm, no bundler, no frameworks |
| **No backend** | 100% static, deployable to any CDN |
| **localStorage persistence** | Profile survives page navigation and refresh |
| **Edit mode** | Re-entering wizard reloads saved profile values |
| **DPI-aware charts** | `devicePixelRatio` scaling prevents blurry canvas on retina displays |
| **Lazy chart rendering** | Charts only draw when their view becomes active |
| **Live financial controls** | Slider changes recalculate all 6 projections in real-time |
| **Scenario hot-swap** | Changing active scenario updates Timeline, Goal Windows, and Action Plan simultaneously |
| **India-first formatting** | All currency in ₹ with K/L/Cr notation |
| **Accessibility** | `aria-label` on interactive buttons, semantic `<nav>` |
| **Font loading** | Google Fonts: JetBrains Mono, Orbitron, Outfit |
