import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BudgetProvider } from './context/BudgetContext'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { MonthlyBudget } from './pages/MonthlyBudget'
import { Transactions } from './pages/Transactions'
import { SinkingFunds } from './pages/SinkingFunds'
import { Debts } from './pages/Debts'
import { GoalsPage } from './pages/Goals'

export default function App() {
  return (
    <ThemeProvider>
      <BudgetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="budget" element={<MonthlyBudget />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="sinking-funds" element={<SinkingFunds />} />
              <Route path="debts" element={<Debts />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BudgetProvider>
    </ThemeProvider>
  )
}
