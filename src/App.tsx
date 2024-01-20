import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProfileProvider } from './contexts/UserProfile.ts'
import { User } from './types/index.ts';
import Expenses from './components/dashboard/Expenses.tsx';

const SignIn = lazy(() => import('./pages/SignIn.tsx') as any)
const SignUp = lazy(() => import('./pages/SignUp.tsx') as any)
const Dashboard = lazy(() => import('./pages/Dashboard.tsx') as any)

const App = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null)

  return (
    <BrowserRouter>
      <Suspense fallback={<div className='mainLoaderWrapper'><span className="mainLoader"></span></div>}>
        <UserProfileProvider value={{ userProfile, setUserProfile }}>
          <Routes>
            <Route path='/log-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/' element={<Dashboard />}>
              <Route path='overview' />
              <Route path='budget' />
              <Route path='expenses' element={<Expenses />}/>
              <Route path='calender' />
              <Route path='analytics' />
            </Route>
          </Routes>
        </UserProfileProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
