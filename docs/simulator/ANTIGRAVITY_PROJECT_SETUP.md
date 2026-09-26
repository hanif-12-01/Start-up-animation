# Google Antigravity ↔ WattWise Project Brain Setup Guide

This guide explains how to configure Google Antigravity to work seamlessly with the **WattWise Operating Simulator** codebase and its external **Obsidian Project Brain**.

---

## 1. Architectural Overview

The WattWise development setup intentionally separates code execution from governance and business truth:

```text
ANTIGRAVITY PROJECT (Multi-Folder Workspace)
│
├── Folder 1: Start-up Animation
│   └── Path: D:\04_LOMBA_DAN_ORGANISASI\Start-up Animation
│   └── Role: Canonical code repository, simulator implementation, tests
│   └── Canonical Upstream: https://github.com/hanif-12-01/Start-up-animation
│
└── Folder 2: WattWise-Project-Brain
    └── Path: D:\04_LOMBA_DAN_ORGANISASI\Obsidian\WattWise-Project-Brain
    └── Role: Canonical governance, decisions (ADRs), conflicts, and truth baseline
```

> [!IMPORTANT]
> **Do NOT merge these folders:**
> - Do **not** move the Obsidian Vault into the Git repository.
> - Do **not** move the Git repository into the Obsidian Vault.
> - Keep them as two distinct folders linked inside the same Google Antigravity Project.

---

## 2. Step-by-Step Antigravity Setup

### Step 1: Open Google Antigravity
Launch the Google Antigravity IDE on your workstation.

### Step 2: Open or Configure the WattWise Project
Open the project configuration or project workspace switcher.

### Step 3: Add Repository Folder
Add the first project folder:
```text
D:\04_LOMBA_DAN_ORGANISASI\Start-up Animation
```

### Step 4: Add Obsidian Project Brain Folder
Add the second project folder:
```text
D:\04_LOMBA_DAN_ORGANISASI\Obsidian\WattWise-Project-Brain
```

### Step 5: Verify Both Folders in Workspace
Confirm that both `Start-up Animation` and `WattWise-Project-Brain` appear in the Antigravity File Explorer sidebar under the same active project.

### Step 6: Security & Scoping
- **Principle of Least Privilege:** Prefer adding these two specific folders over granting broad, unrestricted drive access (e.g., do **NOT** add all of `D:\`).
- **Sensitive Credentials:** Never commit `.env` secrets, database credentials, or API keys into either folder.

---

## 3. Verification & Readability Checks

Verify that the Antigravity AI agent can access both contexts:

1. **Verify Project Brain Access:**
   Ensure the agent can read:
   `D:\04_LOMBA_DAN_ORGANISASI\Obsidian\WattWise-Project-Brain\00_START_HERE.md`

2. **Verify Agent Instructions:**
   Ensure the agent can read:
   `D:\04_LOMBA_DAN_ORGANISASI\Start-up Animation\AGENTS.md`

3. **Verify Workspace Rule:**
   Ensure the agent automatically picks up the rule at:
   `D:\04_LOMBA_DAN_ORGANISASI\Start-up Animation\.agents\rules\wattwise-project-brain.md`

---

## 4. Run a Context Verification Test

To verify that the Antigravity agent correctly respects the Project Brain governance and phase boundaries, test it with this prompt:

> **Verification Prompt to Antigravity Agent:**  
> *"What is the current WattWise Simulator development phase, what work is blocked, and name one unresolved conflict. Answer using the Project Brain only."*

### Expected Agent Behavior:
- **Phase Identification:** Correctly identifies that the project is in **Phase 1.5 (Project Brain Setup & Governance)**.
- **Blocked Work Recognition:** Explicitly states that **Phase 2 (Variable Dictionary & Dependency Map)** is **NOT STARTED / BLOCKED** until Phase 1.5 review, and that modifying production code, database schema, or building simulation engines is prohibited.
- **Conflict Identification:** Cites one of the 13 foundational conflicts (e.g., C-001 Next.js vs. Laravel, C-003 Business plan location limits 5 vs. 10 vs. 50, or C-007 deterministic heuristics vs. ML narrative).
- **Epistemic Discipline:** Distinguishes verified `CURRENT` snapshot facts from `HYPOTHESIS` or `TARGET` values without guessing or resolving conflicts without evidence.

---

## 5. Maintenance & Ongoing Usage

- When starting any significant implementation task, remind or prompt the agent to review `00_START_HERE.md` and `07_PHASE_GATES.md`.
- If an agent task touches a conflicted domain (such as pricing, entitlements, forecasting, or metrics), verify that the agent references `05_CONFLICT_REGISTER.md`.
- Keep notes in plain Markdown; no third-party Obsidian plugins are required.
