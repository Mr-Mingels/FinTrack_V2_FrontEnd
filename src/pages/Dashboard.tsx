import React, { useEffect, useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileContext from '../contexts/UserProfile.ts';
import SideBar from '../components/sidebar/SideBar.tsx';
import { BudgetProvider } from '../contexts/Budgets.ts';
import { ExpenseProvider } from '../contexts/Expenses.ts';
import { Budget } from '../types/index.ts';
import { Expense } from '../types/index.ts';
import { toast } from 'sonner';

const DashBoard = () => {
  const { userProfile, setUserProfile } = useContext(UserProfileContext);
  const [budgets, setBudgets] = useState<Budget[] | null>(null)
  const [expenses, setExpenses] = useState<Expense[] | null>(null)
  const navigate = useNavigate()

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/authenticated`, { withCredentials: true });
      if (response.status === 200) {
        const userData = await response.data;
        console.log(userData)
        setUserProfile(userData)
      } else {
        navigate('/log-in')
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        navigate('/log-in')
      } else {
        toast.error('Unknown Server Error')
      }
    }
  };

  useEffect(() => {
    checkAuth()
  }, [])

  if (!userProfile) {
    return <div className='w-full h-screen flex items-center justify-center'><span className='dashBoardLoader'></span></div>
  }

  return (
    <ExpenseProvider value={{ expenses, setExpenses }}>
      <BudgetProvider value={{ budgets, setBudgets }}>
        <div className='h-full w-full'>
          <div className='flex w-full h-full'>
            <SideBar />
            <div className='flex-grow flex flex-col bg-[#f5f6f8] px-[30px] py-6 h-screen max-h-screen overflow-y-scroll min-h-[740px]'>
              <Outlet />
            </div>
          </div>
        </div>
      </BudgetProvider>
    </ExpenseProvider>
  )
}

export default DashBoard