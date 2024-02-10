import React, { useState, useContext, useEffect } from 'react'
import { AddExpense } from '../modals/AddExpense'
import { GetBudgets } from '../../utils/budgetUtils'
import BudgetContext from '../../contexts/Budgets'
import ExpenseContext from '../../contexts/Expenses'
import { GetExpenses } from '../../utils/expenseUtils'
import { formatDate } from '../../utils/dateUtils'
import { formatCurrency } from '../../utils/currencyUtils'

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
      const budgetName = budgetInfo.budgetName
      return {
        ...expense,
        budgetName: budgetName
      };
    });

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
      {!renderedExpenses ? (
        <div className='w-full h-full flex flex-grow mb-12 justify-center items-center'><span className='dashBoardLoader'></span></div>
      ) : (
        <div className='grid grid-cols-1 gap-8 pb-6'>
          {renderedExpenses?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((expense, index) => (
            <div key={index} className='bg-white flex justify-between rounded-lg p-4 border border-solid border-[#1b1b1b] transition 
              hover:border-[#6d9dc5] cursor-pointer'>
              <div className='flex flex-col gap-1'>
                <h2>{expense.budgetName}</h2>
                <span className='text-xs text-[#808080]'>{formatDate(expense.createdAt)}</span>
              </div>
              <div className=''>
                  <span>-{formatCurrency(expense.expenseAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <AddExpense setModalOpen={setModalOpen} />
      )}
    </div>
  )
}

export default Expenses
