import React, { useState, useContext, useEffect } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Expense } from '../../types'
import ExpenseContext from '../../contexts/Expenses'
import ReactDOM from 'react-dom'
import { formatDate } from '../../utils/dateUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import { ModalTextLabel } from '../misc/ModalTextLabel'
import { Button } from '../misc/Button'

type ExpenseInfoProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDeleteModalIndex: React.Dispatch<React.SetStateAction<number | null>>
    setEditModalIndex: React.Dispatch<React.SetStateAction<number | null>>
    expenseIndex: number
    expense: Expense
}

export const ExpenseInfo = ({ setModalOpen, expense, setDeleteModalOpen, setEditModalOpen, setEditModalIndex,
    setDeleteModalIndex, expenseIndex }: ExpenseInfoProps) => {
    const [budgetUsagePercentage, setBudgetUsagePercentage] = useState<string>('')
    const [budgetCategoryUsagePercentage, setBudgetCategoryUsagePercentage] = useState<string>('')
    const portalRoot = document.getElementById('portal-root');
    const { expenses } = useContext(ExpenseContext)

    useEffect(() => {
        const usedBudgetPercentage = ((parseFloat(expense.expenseAmount) / parseFloat(expense.budget.monthlyBudgetAmount)) * 100).toFixed(0);
        const categoryPercentage = expense.budgetCategory.budgetCategoryPercentage || 0;
        const categoryAmount = (parseFloat(expense.budget.monthlyBudgetAmount) * categoryPercentage) / 100;

        const usedCategoryPercentage = ((parseFloat(expense.expenseAmount) / categoryAmount) * 100).toFixed(0);

        setBudgetUsagePercentage(usedBudgetPercentage)
        setBudgetCategoryUsagePercentage(usedCategoryPercentage)
    }, [expenses])

    if (!portalRoot) {
        return null;
    }

    return ReactDOM.createPortal(
        <ModalBackground>
            <div className='bg-white p-6 rounded-lg w-[800px]'>
                <div className='flex items-center justify-between border-b-[#dadada] border-b border-solid pb-2 mb-6 text-[#1b1b1b]'>
                    <h2 className='text-lg'>Expense Info</h2>
                    <div className='flex items-center justify-center w-5 h-5 cursor-pointer' onClick={() => setModalOpen(false)}>
                        <FontAwesomeIcon className='h-full w-full' color='#1b1b1b' icon={faXmark} />
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='grid grid-cols-3 gap-6 w-full'>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Name</ModalTextLabel>
                            <p className='text-sm'>{expense.budget.budgetName}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Category</ModalTextLabel>
                            <p className='text-sm'>{expense.budgetCategory.budgetCategoryName}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>SubCategory</ModalTextLabel>
                            <p className='text-sm'>NaN</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Usage</ModalTextLabel>
                            <p className={`text-sm ${parseFloat(budgetUsagePercentage) > 100 ? 'text-[#FF4D4D]' : 'text-[#28a745]'}`}>
                                {budgetUsagePercentage}%</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Category Usage</ModalTextLabel>
                            <p className={`text-sm ${parseFloat(budgetCategoryUsagePercentage) > 100 ? 'text-[#FF4D4D]' : 'text-[#28a745]'}`}>
                                {budgetCategoryUsagePercentage}%</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>SubCategory Usage</ModalTextLabel>
                            <p className='text-sm'>NaN</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Expense Amount</ModalTextLabel>
                            <p className='text-sm'>{formatCurrency(expense.expenseAmount)}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Created at</ModalTextLabel>
                            <p className='text-sm'>{formatDate(expense.createdAt)}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Updated at</ModalTextLabel>
                            <p className='text-sm'>{formatDate(expense.updatedAt)}</p>
                        </div>
                    </div>
                    <div className='border-b border-solid border-[#dadada]'></div>
                    <div className='flex flex-col gap-1'>
                        <ModalTextLabel additionalStyles='ml-0 mb-0'>Description</ModalTextLabel>
                        <textarea placeholder='No description has been made...' className='border outline-none text-[#1b1b1b] px-3 py-2 border-solid h-24 text-[13.5px] w-full rounded 
                    font-small border-[#1b1b1b] resize-none scrollable-div' readOnly={true} value={expense.description}></textarea>
                    </div>
                    <div className='flex gap-4 h-11'>
                        <Button additionalStyles='h-full bg-[#1b1b1b] text-white rounded hover:bg-[#141414]' onClickHandler={() => {
                            setModalOpen(false)
                            setEditModalIndex(expenseIndex)
                            setEditModalOpen(true)
                        }}>
                            Edit
                        </Button>
                        <Button additionalStyles='h-full bg-[#FF4D4D] text-white rounded border-[#FF4D4D] hover:bg-[#DF2D2D]'
                            onClickHandler={() => {
                            setModalOpen(false)
                            setDeleteModalIndex(expenseIndex)
                            setDeleteModalOpen(true)
                        }}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </ModalBackground>,
        portalRoot
    )
}