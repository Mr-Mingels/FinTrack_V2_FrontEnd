import React, { useState, useContext, useEffect } from 'react'
import { AddExpense } from '../modals/AddExpense'
import { GetBudgets } from '../../utils/budgetUtils'
import BudgetContext from '../../contexts/Budgets'
import ExpenseContext from '../../contexts/Expenses'
import { GetExpenses } from '../../utils/expenseUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import { formatDate } from '../../utils/dateUtils'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DeleteExpense } from '../modals/DeleteExpense'
import { EditExpense } from '../modals/EditExpense'
import { ExpenseInfo } from '../modals/ExpenseInfo'

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { setBudgets } = useContext(BudgetContext)
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
        <div className='grid grid-cols-1 gap-4 pb-6'>
          {expenses?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((expense, index) => {
            
            return (
              <div key={index} className='bg-white flex items-center justify-between rounded-lg py-3.5 px-4 border border-solid border-[#1b1b1b] transition 
              scale-100 hover:scale-[1.02] hover:border-[#6d9dc5] cursor-pointer relative gap-3' onClick={(e) => {
                setExpenseInfoModalIndex(index)
                if (!expenseInfoModalOpen && !editModalOpen && !deleteModalOpen) {
                  setExpenseInfoModalOpen(true)
                }
              }}>
                <div className='flex justify-center items-center h-[42px] min-w-[42px] w-[42px] bg-black rounded-full'>
                  <FontAwesomeIcon className='h-3/5 w-3/5' color='white' icon={faQuestion} />
                </div>
                <div className='flex flex-col gap-1 w-full'>
                  <h2>{expense.budget.budgetName}</h2>
                  <span className='text-sm text-[#444444]'> {formatDate(expense.createdAt)}</span>
                </div>
                <div className='flex gap-2 absolute top-0 right-0 my-3.5 mr-4'>
                  <span>-{formatCurrency(expense.expenseAmount)}</span>
                </div>
                {expenseInfoModalOpen && expenseInfoModalIndex === index && (
                  <ExpenseInfo expense={expense} setModalOpen={setExpenseInfoModalOpen} setDeleteModalOpen={setDeleteModalOpen}
                  setEditModalOpen={setEditModalOpen} expenseIndex={index} setDeleteModalIndex={setDeleteModalIndex}
                  setEditModalIndex={setEditModalIndex}/>
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
