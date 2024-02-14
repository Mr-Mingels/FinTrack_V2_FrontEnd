import React, { useState, useContext, useEffect } from 'react'
import { AddExpense } from '../modals/AddExpense'
import { GetBudgets } from '../../utils/budgetUtils'
import BudgetContext from '../../contexts/Budgets'
import ExpenseContext from '../../contexts/Expenses'
import { GetExpenses } from '../../utils/expenseUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import ProgressBar from '@ramonak/react-progress-bar'
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DeleteExpense } from '../modals/DeleteExpense'
import { EditExpense } from '../modals/EditExpense'
import { ExpenseInfo } from '../modals/ExpenseInfo'

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { budgets, setBudgets } = useContext(BudgetContext)
  const { expenses, setExpenses } = useContext(ExpenseContext)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [deleteModalIndex, setDeleteModalIndex] = useState<number | null>(null)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editModalIndex, setEditModalIndex] = useState<number | null>(null)
  const [expenseInfoModalOpen, setExpenseInfoModalOpen] = useState<boolean>(false)
  const [expenseInfoModalIndex, setExpenseInfoModalIndex] = useState<number | null>(null)

  useEffect(() => {
    GetBudgets(setBudgets)
    GetExpenses(setExpenses)
  }, [])

  return (
    <div className='flex flex-col h-full flex-grow w-full'>
      <div className='text-2xl min-h-[64px] font-medium text-[#1b1b1b] flex items-end justify-between border-b-[#dadada] 
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
          {expenses?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((expense, index) => {

            const expenseAmount = parseFloat(expense?.expenseAmount);
            const budgetAmount = parseFloat(expense.budget?.monthlyBudgetAmount);

            const completionPercentage = expenseAmount / budgetAmount * 100
            
            return (
              <div key={index} className='bg-white flex justify-between rounded-lg py-3.5 px-4 border border-solid border-[#1b1b1b] transition 
              scale-100 hover:scale-105 hover:border-[#6d9dc5] cursor-pointer relative' onClick={(e) => {
                setExpenseInfoModalIndex(index)
                if (!expenseInfoModalOpen && !editModalOpen && !deleteModalOpen) {
                  setExpenseInfoModalOpen(true)
                }
              }}>
                <div className='flex flex-col gap-2 w-full'>
                  <h2>{expense.budget.budgetName}</h2>
                  <span className='text-sm text-[#444444]'>{formatCurrency(expense.budget.monthlyBudgetAmount)}</span>
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
                    {completionPercentage > 100 ? 'Over Budget' : 'Under Budget'}
                  </span>
                </div>
                <div className='flex gap-2 absolute top-0 right-0 my-3.5 mr-4'>
                  <div className='rounded p-2 w-8 h-8 flex justify-center items-center border border-solid border-[#1b1b1b] transition-colors
                  text-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white' onClick={(e) => {
                    e.stopPropagation()
                    setEditModalIndex(index)
                    setEditModalOpen(true)
                  }}>
                      <FontAwesomeIcon icon={faPen}/>
                  </div>
                  <div className='rounded p-2 w-8 h-8 flex justify-center items-center border border-solid border-[#1b1b1b] transition-colors
                  text-[#FF4D4D] hover:border-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-[#1b1b1b]' onClick={(e) => {
                    e.stopPropagation()
                    setDeleteModalIndex(index)
                    setDeleteModalOpen(true)
                  }}>
                      <FontAwesomeIcon icon={faTrashCan}/>
                  </div>
                </div>
                {expenseInfoModalOpen && expenseInfoModalIndex === index && (
                  <ExpenseInfo expense={expense} setModalOpen={setExpenseInfoModalOpen}/>
                )}
                {editModalOpen && editModalIndex === index && (
                  <EditExpense expense={expense} setModalOpen={setEditModalOpen}/>
                )}
                {deleteModalOpen && deleteModalIndex === index && (
                  <DeleteExpense expense={expense} setModalOpen={setDeleteModalOpen}/>
                )}
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
