import React, { useState, useContext, useEffect } from 'react'
import { AddExpense } from '../modals/AddExpense'
import { GetBudgets } from '../../utils/budgetUtils'
import BudgetContext from '../../contexts/Budgets'
import ExpenseContext from '../../contexts/Expenses'
import { GetExpenses } from '../../utils/expenseUtils'
import { formatDate } from '../../utils/dateUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import ProgressBar from '@ramonak/react-progress-bar'

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { budgets, setBudgets } = useContext(BudgetContext)
  const { expenses, setExpenses } = useContext(ExpenseContext)
  const [renderedExpenses, setRenderedExpenses] = useState<any[]>([])

  useEffect(() => {
    GetBudgets(setBudgets)
    GetExpenses(setExpenses)
  }, [])

  useEffect(() => {
    if (!budgets || !expenses) return;

    const budgetMap = new Map();
    budgets.forEach(budget => {
      budgetMap.set(budget._id, budget);
    });

    const updatedExpenses = expenses.map(expense => {
      const budgetInfo = budgetMap.get(expense.budget);
      console.log(budgetInfo)
      const budgetName = budgetInfo.budgetName
      const budgetAmount = budgetInfo.monthlyBudgetAmount
      return {
        ...expense,
        budgetName: budgetName,
        budgetAmount: budgetAmount
      };
    });
    console.log(expenses)
    setRenderedExpenses(updatedExpenses)
  }, [expenses]);


  return (
    <div className='flex flex-col h-full flex-grow w-full'>
      <div className='text-2xl h-[64px] font-medium text-[#1b1b1b] flex items-end justify-between border-b-[#dadada] 
      border-b border-solid pb-2 mb-6'>
        <h2 className='flex items-end'>Expenses</h2>
        <button type='button' className='h-9 px-4 text-white bg-[#1b1b1b] font-normal rounded text-sm hover:bg-[#6d9dc5] 
        transition-colors' onClick={() => setModalOpen(true)}>
          Add Expense +
        </button>
      </div>
      {!expenses ? (
        <div className='w-full h-full flex flex-grow mb-12 justify-center items-center'><span className='dashBoardLoader'></span></div>
      ) : (
        <div className='grid grid-cols-3 gap-4 pb-6'>
          {renderedExpenses?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((expense, index) => {
            const completionPercentage = expense.expenseAmount / expense.budgetAmount * 100
            const progressBarStylings = {
              height: '40px'
            }
            return (
              <div key={index} className='bg-white flex justify-between rounded-lg py-3.5 px-4 border border-solid border-[#1b1b1b] transition 
              hover:border-[#6d9dc5] cursor-pointer'>
                <div className='flex flex-col gap-2 w-full'>
                  <h2>{expense.budgetName}</h2>
                  <span className='text-sm text-[#444444]'>{formatCurrency(expense.budgetAmount)}</span>
                  <div className='text-sm'>
                    <span className='text-[#6d9dc5] font-semibold'>Expense Amount:</span>
                    <span> {formatCurrency(expense.expenseAmount)}</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <span className='text-sm text-[#444444]'>{Number.isInteger(completionPercentage) ? completionPercentage.toFixed() : completionPercentage.toFixed(2)}%</span>
                    <div className='h-3 w-full'>
                      <ProgressBar completed={completionPercentage > 100 ? 100 : completionPercentage} bgColor='#6d9dc5' animateOnRender={true} 
                      labelClassName='progress-bar-label' margin='auto' height='100%'/>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold italic ${completionPercentage > 100 ? 'text-[#FF4D4D]' : 'text-[#28a745]'}`}>
                    {completionPercentage > 100 ? 'Over Budet' : 'Under Budget'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modalOpen && (
        <AddExpense setModalOpen={setModalOpen} />
      )}
    </div>
  )
}

export default Expenses
