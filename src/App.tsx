import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProfileProvider } from './contexts/UserProfile.ts'
import { BudgetProvider } from './contexts/Budgets.ts';
import { User } from './types/index.ts';
import { Budget } from './types/index.ts';
import Expenses from './components/dashboard/Expenses.tsx';
import Budgets from './components/dashboard/Budgets.tsx';
import { Toaster } from 'sonner'

const SignIn = lazy(() => import('./pages/SignIn.tsx') as any)
const SignUp = lazy(() => import('./pages/SignUp.tsx') as any)
const Dashboard = lazy(() => import('./pages/Dashboard.tsx') as any)

const App = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [budgets, setBudgets] = useState<Budget | null>(null)

  return (
    <BrowserRouter>
      <Suspense fallback={<div className='mainLoaderWrapper'><span className="mainLoader"></span></div>}>
        <UserProfileProvider value={{ userProfile, setUserProfile }}>
          <BudgetProvider value={{ budgets, setBudgets }}>
          <Routes>
            <Route path='/log-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/' element={<Dashboard />}>
              <Route path='overview' />
              <Route path='budget' element={<Budgets />}/>
              <Route path='expenses' element={<Expenses />}/>
              <Route path='calender' />
              <Route path='analytics' />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors closeButton/>
          </BudgetProvider>
        </UserProfileProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
