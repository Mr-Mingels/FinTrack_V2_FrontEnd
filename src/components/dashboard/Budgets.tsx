import React, { useEffect, useState, useContext } from 'react'
import { AddBudget } from '../modals/AddBudget'
import axios from 'axios'
import BudgetContext from '../../contexts/Budgets'
import { toast } from 'sonner'
import BudgetPieChart from '../misc/BudgetPieChart'

const Budgets = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { budgets, setBudgets } = useContext(BudgetContext);

  useEffect(() => {
    const GetBudgets = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/budget/get-budgets`, { withCredentials: true })
        if (response.status === 200) {
          setBudgets(response.data)
        }
      } catch (err) {
        console.log(err)
        toast.error('Unknown Server Error')
      }
    }

    GetBudgets()
  }, [])

  useEffect(() => {
    console.log(budgets)
  }, [budgets])

  return (
    <div className='flex flex-col h-full'>
      <div className='text-2xl h-[64px] font-medium text-[#1b1b1b] flex items-end justify-between border-b-[#dadada] 
      border-b border-solid pb-2 mb-6'>
        <h2 className='flex items-end'>Budgets</h2>
        <button type='button' className='h-9 px-4 text-white bg-[#1b1b1b] font-normal rounded text-sm hover:bg-[#6d9dc5] 
        transition-colors' onClick={() => setModalOpen(true)}>
          Add Budget +
        </button>
      </div>
      <div className='grid grid-cols-4 gap-8'>
        {budgets?.map((budget, index) => (
          <div key={index} className='bg-white rounded-lg p-4 border border-solid border-[#1b1b1b] cursor-pointer'>
            <div className='h-[170px] w-full cursor-pointer'>
              <BudgetPieChart categories={budget.categories} />
            </div>
            <div>
              {budget.budgetName}
              {budget.monthlyBudgetAmount}
              {budget.createdAt}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <AddBudget setModalOpen={setModalOpen} />
      )}
    </div>
  )
}

export default Budgets
