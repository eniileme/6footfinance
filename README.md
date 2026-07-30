# 6footfinance

Personal budgeting and financial planning app. Manual entry only — no bank integrations.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- localStorage persistence

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Pages

| Page | Purpose |
|------|---------|
| **Dashboard** | Monthly snapshot: income, fixed costs, savings rate, variable budget, warnings |
| **Monthly budget** | Edit income, fixed expenses, and planned category amounts |
| **Transactions** | Log spending with date, amount, category, note |
| **Sinking funds** | Track insurance, car maintenance, putkiremppa, gifts, travel, etc. |
| **Debts** | Mortgage and car loan with payoff estimates |
| **Goals** | Saving targets, emergency buffer, YTD progress |

Data persists in `localStorage` under key `6footfinance-state-v1`. Use **Reset to defaults** on the Goals page to start fresh.
