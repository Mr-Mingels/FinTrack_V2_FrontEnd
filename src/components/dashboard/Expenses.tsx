import React, { useState, useContext, useEffect } from 'react'
import { AddExpense } from '../modals/AddExpense'
import { GetBudgets } from '../../utils/budgetUtils'
import BudgetContext from '../../contexts/Budgets'

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { budgets, setBudgets } = useContext(BudgetContext)

  useEffect(() => {
    GetBudgets(setBudgets)
  }, [])

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
      {modalOpen && (
        <AddExpense setModalOpen={setModalOpen} />
      )}
    </div>
  )
}

export default Expenses
