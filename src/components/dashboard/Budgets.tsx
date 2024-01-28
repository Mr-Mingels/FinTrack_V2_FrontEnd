import React, { useEffect, useState, useContext } from 'react'
import { AddBudgetModal } from '../modals/AddBudget'
import axios from 'axios'
import BudgetContext from '../../contexts/Budgets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import BudgetPieChart from '../misc/BudgetPieChart'
import { formatDate } from '../../utils/dateUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import { Button } from '../misc/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { EditBudgetModal } from '../modals/EditBudget'
import UserProfileContext from '../../contexts/UserProfile'

const Budgets = () => {
  const [addBudgetModalOpen, setAddBudgetModalOpen] = useState<boolean>(false)
  const [editBudgetModalOpen, setEditBudgetModalOpen] = useState<boolean>(false)
  const [editBudgetModalIndex, setEditBudgetModalIndex] = useState<number | null>(null)
  const [scrollableDivStates, setScrollableDivStates] = useState<boolean[]>([]);
  const { budgets, setBudgets } = useContext(BudgetContext);
  const { userProfile } = useContext(UserProfileContext);
  const navigate = useNavigate()

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
    const newScrollableDivStates = budgets?.map((budget, index) => {
      const divHeight = document.getElementById(`budget-${index}`)?.clientHeight;
      return divHeight ? divHeight > 84 : false;
    }) ?? [];
    setScrollableDivStates(newScrollableDivStates);
  }, [budgets])

  return (
    <div className='flex flex-col h-full flex-grow w-full'>
      <div className='text-2xl h-[64px] font-medium text-[#1b1b1b] flex items-end justify-between border-b-[#dadada] 
      border-b border-solid pb-2 mb-6'>
        <h2 className='flex items-end'>Budgets</h2>
        <button type='button' className='h-9 px-4 text-white bg-[#1b1b1b] font-normal rounded text-sm hover:bg-[#6d9dc5] 
        transition-colors' onClick={() => setAddBudgetModalOpen(true)}>
          Add Budget +
        </button>
      </div>
      {!budgets ? (
        <div className='w-full h-full flex flex-grow mb-12 justify-center items-center'><span className='dashBoardLoader'></span></div>
      ) : (
        <div className='grid grid-cols-3 gap-8'>
          {budgets?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((budget, index) => (
            <div key={index} className='bg-white flex flex-col rounded-lg p-4 border border-solid border-[#1b1b1b] transition 
          scale-100 hover:scale-105 hover:border-[#6d9dc5]'>
              <div className='h-[160px] w-full border-b border-solid border-[#dadada] pb-4 mb-4'>
                <BudgetPieChart categories={budget.categories} />
              </div>
              <div className='flex gap-2'>
                <div className='flex flex-col w-full'>
                  <label className='text-[13px] text-[#444444]'>Budget Name</label>
                  <p className='text-sm text-[#1b1b1b] mb-3'>{budget.budgetName}</p>
                  <label className='text-[13px] text-[#444444]'>Created At</label>
                  <p className='text-sm text-[#1b1b1b] mb-3'>{formatDate(budget.createdAt)}</p>
                  <label className='text-[13px] text-[#444444]'>Updated At</label>
                  <p className='text-sm text-[#1b1b1b] mb-3'>{formatDate(budget.updatedAt)}</p>
                </div>
                <div className='flex flex-col w-full'>
                  <label className='text-[13px] text-[#444444]'>Budget Amount (Monthly)</label>
                  <p className='text-sm text-[#1b1b1b] mb-3'>{formatCurrency(parseInt(budget.monthlyBudgetAmount))}</p>
                  <label className='text-[13px] text-[#444444]'>Total Spent</label>
                  <p className='text-sm text-[#1b1b1b] mb-3'>0/{formatCurrency(parseInt(budget.monthlyBudgetAmount))}</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <label className='text-[13px] text-[#444444] mb-3 border-b border-solid border-[#dadada]'>Budget Categories</label>
                <div id={`budget-${index}`} className={`flex flex-col gap-3 w-full max-h-[85px] overflow-y-scroll ${scrollableDivStates[index] ? 'scrollable-div' : ''}`}>
                  {budget.categories.map((category, index) => (
                    <div className='flex justify-between w-full items-center text-sm text-[#1b1b1b]' key={index}>
                      <p>{category.name}</p>
                      <span>{category.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='mt-6 flex-grow flex items-end'>
                <div className='flex gap-4 h-10 w-full'>
                  <Button additionalStyles='h-full bg-[#1b1b1b] text-white rounded hover:bg-[#141414]' onClickHandler={() => {
                    setEditBudgetModalOpen(true)
                    setEditBudgetModalIndex(index)
                  }}>
                    Edit
                  </Button>
                  <Button additionalStyles='h-full bg-[#6d9dc5] text-white rounded border-[#6d9dc5] hover:bg-[#63a0d3]'
                    onClickHandler={() => navigate('/')}>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Button>
                </div>
              </div>
              {editBudgetModalOpen && editBudgetModalIndex === index && (
                <EditBudgetModal setModalOpen={setEditBudgetModalOpen} budget={budget} />
              )}
            </div>
          ))}
        </div>
      )}
      {addBudgetModalOpen && (
        <AddBudgetModal setModalOpen={setAddBudgetModalOpen} />
      )}
    </div>
  )
}

export default Budgets
