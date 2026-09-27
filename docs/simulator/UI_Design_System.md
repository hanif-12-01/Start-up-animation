---
id: SIM-UDS-001
type: specification
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 4A
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
  - SRC-010
  - SRC-015
  - ADR-002
  - ADR-003
  - ADR-004
  - ADR-005
  - ADR-006
  - ADR-007
  - ADR-008
blocks: []
supersedes: []
---

# WattWise Operating Simulator — UI Design System
## Phase 4A UI Architecture & Design System

This document specifies the authoritative design system, CSS design token architecture, typographic hierarchy, component styling rules, and accessibility standards for the [[Engine_Architecture|WattWise Operating Simulator]]. It builds on the verified visual identity established in the prototype (`SRC-010`, `SRC-015`) while codifying strict epistemic design patterns to visually distinguish facts, assumptions, and unknowns.

---

## 1. Brand Identity & Color Palette

The simulator inherits WattWise's established environmental tech palette—evoking energy conservation, modern SaaS precision, and commercial credibility:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BRAND PALETTE SWATCHES                          │
├──────────────┬──────────────┬──────────────┬─────────────┬─────────────┤
│ Forest Green │ Teal Primary │ Emerald High │ Dark Slate  │ Mint Tint   │
│   #064E3B    │   #0D9488    │   #10B981    │   #0F172A   │   #ECFDF5   │
└──────────────┴──────────────┴──────────────┴─────────────┴─────────────┘
```

- **Deep Forest Green (`#064E3B`):** Brand foundation, primary buttons, structural accents.
- **Vibrant Teal (`#0D9488`):** Active interactive controls, focus rings, primary data curves.
- **Emerald Green (`#10B981`):** Positive outcomes, verified baseline badges, solvency surplus.
- **Dark Slate Navy (`#0F172A`):** High-contrast typography, top bar background, deep borders.
- **Soft Light Mint (`#ECFDF5`):** Subdued card backgrounds, positive highlight fills.
- **Clean Off-White (`#F8FAF9`):** Application canvas background.
- **Pure White (`#FFFFFF`):** Card surfaces, elevated popovers, input backgrounds.
- **Amber Gold (`#FBBF24`):** Hypotheses, unvalidated estimates, cautionary alerts.

---

## 2. Design Token Architecture (CSS Custom Properties)

All interface components are styled strictly using semantic CSS variables, preventing ad-hoc colors and enabling future theme portability.

### 2.1 Surface & Layout Tokens
```css
:root {
  /* Surfaces */
  --color-bg-app: #F8FAF9;
  --color-bg-surface: #FFFFFF;
  --color-bg-surface-elevated: #FFFFFF;
  --color-bg-surface-sunken: #F1F5F3;
  --color-bg-surface-subtle: #F0FDF4;

  /* Borders & Dividers */
  --color-border-subtle: #E2E8F0;
  --color-border-default: #CBD5E1;
  --color-border-strong: #94A3B8;
  --color-border-focus: #0D9488;

  /* Text & Content */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #64748B;
  --color-text-disabled: #94A3B8;
  --color-text-inverse: #FFFFFF;
  --color-text-link: #0D9488;
}
```

### 2.2 Epistemic Knowledge Status Tokens
The simulator enforces visual differentiation across the 6 knowledge classifications cataloged in the [[Variable_Dictionary]]:

```css
:root {
  /* CURRENT (Verified in snapshot code) */
  --epistemic-current-bg: #E6FFFA;
  --epistemic-current-border: #319795;
  --epistemic-current-text: #234E52;

  /* ACCEPTED_BASELINE (Human ADR Locked) */
  --epistemic-adr-bg: #ECFDF5;
  --epistemic-adr-border: #10B981;
  --epistemic-adr-text: #064E3B;

  /* SIMULATION_ASSUMPTION (User or scenario override) */
  --epistemic-assumption-bg: #F5F3FF;
  --epistemic-assumption-border: #8B5CF6;
  --epistemic-assumption-text: #4C1D95;

  /* HYPOTHESIS (Unverified pitch assertion) */
  --epistemic-hypothesis-bg: #FFFBEB;
  --epistemic-hypothesis-border: #F59E0B;
  --epistemic-hypothesis-text: #78350F;

  /* UNKNOWN (Missing empirical evidence) */
  --epistemic-unknown-bg: #FFF1F2;
  --epistemic-unknown-border: #F43F5E;
  --epistemic-unknown-text: #881337;

  /* TARGET (Future aspiration) */
  --epistemic-target-bg: #EFF6FF;
  --epistemic-target-border: #3B82F6;
  --epistemic-target-text: #1E3A8A;
}
```

### 2.3 Spacing, Radius & Elevation Tokens
```css
:root {
  /* Spacing Scale (4px base) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.50rem;  /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1.00rem;  /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.50rem;  /* 24px */
  --space-8: 2.00rem;  /* 32px */
  --space-10: 2.50rem; /* 40px */
  --space-12: 3.00rem; /* 48px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Elevation Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-drawer: -4px 0 24px rgba(15, 23, 42, 0.15);
}
```

---

## 3. Typographic Hierarchy

The simulator employs a modern, clean system font stack ensuring high rendering performance and zero external font asset download delays:

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
```

### Typographic Scale

| Role | Font Size | Line Height | Weight | Tracking | Primary Usage |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **App Title** | 22px (`1.375rem`) | 28px | 700 (Bold) | `-0.01em` | Top Bar title |
| **Lab Heading** | 20px (`1.25rem`) | 26px | 600 (Semibold) | `-0.01em` | Primary Lab page headers |
| **Section Header** | 16px (`1.0rem`) | 22px | 600 (Semibold) | `0em` | Card group titles |
| **Metric Large** | 28px (`1.75rem`) | 32px | 700 (Bold) | `-0.02em` | Headline KPI numbers |
| **Metric Standard** | 20px (`1.25rem`) | 24px | 700 (Bold) | `-0.01em` | Standard card KPI numbers |
| **Body Standard** | 14px (`0.875rem`) | 20px | 400 (Regular) | `0em` | General description copy |
| **Input Label** | 13px (`0.8125rem`) | 18px | 500 (Medium) | `0em` | Form control field labels |
| **Badge / Tag** | 11px (`0.6875rem`) | 14px | 600 (Semibold) | `+0.02em` | Epistemic status badges |
| **Caption / Helper** | 12px (`0.75rem`) | 16px | 400 (Regular) | `0em` | Explanatory field footnotes |
| **Code / Formula** | 12px (`0.75rem`) | 18px | 500 (Medium) | `0em` | Trace DAG math in monospace |

---

## 4. Theme Evaluation: Dark Mode Recommendation

### 4.1 Decision: Light Mode Only for Phase 4
> [!IMPORTANT]
> **Phase 4 Recommendation:** Implement a refined, high-contrast **Light Mode** as the primary and only active theme for Phase 4.

### 4.2 Rationale
1. **Competition Presentation Readability:** Competition pitching environments and venue projectors suffer massive contrast degradation with dark themes. Off-white canvases with dark slate text maintain maximum legibility.
2. **Tabular & Financial Density:** Financial ledgers, MRR breakdown tables, and multi-line trajectories are significantly easier to parse rapidly in clean light surfaces.
3. **Engineering Focus & Delivery Velocity:** Implementing dual-theme token testing across 48+ variables and 6 labs introduces unnecessary regression surface during the initial UI construction phase.
4. **Future Portability:** By routing 100% of styles through CSS custom properties, Dark Mode can be activated seamlessly in Phase 5 without refactoring component markup.

---

## 5. Epistemic Component Standards

### 5.1 Knowledge Status Badges
Badges communicate authority at a glance. They **must never rely solely on color**: every badge includes a text label and distinctive iconography:

- `[● CURRENT]` *(Filled circle icon + Teal border)*: Verified in codebase snapshot.
- `[🔒 ADR LOCKED]` *(Lock icon + Emerald border)*: Immutable human policy decision.
- `[✎ ASSUMPTION]` *(Pencil icon + Violet border)*: Scenario override parameter.
- `[▲ HYPOTHESIS]` *(Triangle warning icon + Amber border)*: Unverified market claim.
- `[✕ UNKNOWN]` *(Cross/Hollow icon + Rose striped border)*: Missing empirical telemetry.

### 5.2 The Standardized UNKNOWN State Component
When a variable evaluates to `UNKNOWN`, the component **must never** render as `0`, `-`, or an unadorned blank:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOTAL MRR                                          [✕ RUNTIME UNKNOWN] │
│                                                                        │
│ UNKNOWN                                                                │
│ Upstream input [monthly_account_churn_rate] is UNKNOWN.                │
│                                                                        │
│ [Why is this Unknown? ↗]                [Set Scenario Assumption ✎]    │
└────────────────────────────────────────────────────────────────────────┘
```

- **Visual Treatment:** Rose-tinted background fill (`--epistemic-unknown-bg`), subtle dashed border (`--epistemic-unknown-border`), bold monospace `UNKNOWN` display text.
- **Action Triggers:**
  - `[Why is this Unknown? ↗]`: Opens execution trace popover identifying the exact missing upstream dependency.
  - `[Set Scenario Assumption ✎]`: Jumps the user directly to the control lever in the relevant Lab to provide an illustrative override.

### 5.3 Decoupled Customer Economics Component (ADR-008)
To prevent accidental contamination of WattWise venture economics by client-level electricity metrics, `revenue_after_electricity` is visually framed within a distinct **Customer Micro-Business Panel**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚡ CUSTOMER CLIENT ECONOMICS (DECOUPLED VIA ADR-008)                     │
│ Note: This metric reflects SME customer surplus, NOT WattWise revenue. │
├────────────────────────────────────────────────────────────────────────┤
│ Client Gross Revenue: Rp50.000.000 │ Electricity Bill: Rp4.000.000     │
│ Sisa Pendapatan Setelah Listrik: Rp46.000.000                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Form Control & Input Specifications

Inputs are tailored directly to the underlying Phase 2 data types cataloged in [[Variable_Dictionary]]:

| Data Type | Preferred Control | Formatting & Step | Boundary Enforcement |
| :--- | :--- | :--- | :--- |
| **`boolean`** | Switch / Toggle Pill | `true` (Active) / `false` (Disabled) | Constrained to binary state |
| **`enum`** | Segmented Button Group | Human-readable option pills | Strictly bounded to `allowedValues` |
| **`float` (ratio)** | Numeric field with `%` suffix | Stepper `0.01` ($1\%$) | Min/Max enforced via validator |
| **`integer` (count)** | Stepper number box | Stepper `1` | Strictly integer, non-negative |
| **`float` (currency)**| Textbox with `Rp` prefix | Thousands separator (e.g. `49.000`) | Strictly numeric integer/float |
| **`integer` (horizon)**| Segmented button | `6 Months` vs `12 Months` | Limited to standard scenario horizons |

---

## 7. Accessibility & Usability Standards (WCAG 2.1 AA)

1. **Color Contrast:** Every text pairing satisfies minimum contrast ratio of $4.5:1$ against its background ($3.0:1$ for large headings).
2. **Keyboard Navigation:** Full interactive loop operable via keyboard alone (`Tab`, `Shift+Tab`, `Space`, `Enter`, Arrow keys).
3. **Visible Focus Rings:** Focused elements display an unmistakable $2\text{px}$ teal ring (`outline: 2px solid var(--color-border-focus); outline-offset: 2px;`).
4. **Screen Reader Semantics:** Semantic HTML elements utilized exclusively (`<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<table>`, `<button>`).
5. **Reduced Motion Support:** Respects user's operating system preferences:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, ::before, ::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

---

## Related Documents

- [[Engine_Architecture]]
- [[Simulation_Rulebook]]
- [[Variable_Dictionary]]
- [[Dependency-Map]]
- [[UI_Information_Architecture]]
- [[UI_Engine_Contract]]
- [[UI_Component_Architecture]]
- [[UI_Wireframes]]
- [[Phase_4B_Implementation_Plan]]
