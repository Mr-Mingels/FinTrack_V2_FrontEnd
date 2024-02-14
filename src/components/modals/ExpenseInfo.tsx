import React, { useState, useContext, useEffect } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../misc/Button'
import { ModalInput } from '../misc/ModalInput'
import BudgetContext from '../../contexts/Budgets'
import { ModalDropDown } from '../misc/ModalDropDown'
import { Budget, Expense } from '../../types'
import { BudgetCategories } from '../../types'
import { ModalTextArea } from '../misc/ModalTextArea'
import { toast } from 'sonner'
import { DropDownFieldProps } from '../../types'
import ExpenseContext from '../../contexts/Expenses'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { formatDate } from '../../utils/dateUtils'
import { formatCurrency } from '../../utils/currencyUtils'
import { ExpenseDoughNutChart } from '../misc/ExpenseDoughNutChart'
import { ModalTextLabel } from '../misc/ModalTextLabel'

type ExpenseInfoProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    expense: Expense
}

export const ExpenseInfo = ({ setModalOpen, expense }: ExpenseInfoProps) => {
    const [doughnutData, setDoughnutData] = useState<any>(null)
    const [budgetUsagePercentage, setBudgetUsagePercentage] = useState<string>('')
    const [budgetCategoryUsagePercentage, setBudgetCategoryUsagePercentage] = useState<string>('')
    const portalRoot = document.getElementById('portal-root');
    const { expenses } = useContext(ExpenseContext)

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const startOfMonth = new Date(`${currentYear}-${currentMonth}-01`);
        const endOfMonth = new Date(currentYear, currentMonth, 0);

        const allExpensesInBudget = expenses?.filter(expenseItem => (
            expenseItem.budget._id === expense.budget._id &&
            new Date(expenseItem.createdAt) >= startOfMonth &&
            new Date(expenseItem.createdAt) <= endOfMonth
        ));

        const expensesInBudgetSum = allExpensesInBudget?.reduce((accumulator, expense) => {
            const expenseAmount = parseFloat(expense.expenseAmount)
            return accumulator += expenseAmount;
        }, 0)

        const otherExpensesInBudgetSum = allExpensesInBudget?.reduce((accumulator, expenseItem) => {
            const expenseAmount = parseFloat(expenseItem.expenseAmount)
            if (expenseItem._id === expense._id) {
                return accumulator += 0;
            } else {
                return accumulator += expenseAmount;
            }
        }, 0)

        const usedBudgetPercentage = ((parseFloat(expense.expenseAmount) / parseFloat(expense.budget.monthlyBudgetAmount)) * 100).toFixed(0);
        const categoryPercentage = expense.budgetCategory.budgetCategoryPercentage || 0;
        const categoryAmount = (parseFloat(expense.budget.monthlyBudgetAmount) * categoryPercentage) / 100;

        console.log(categoryAmount)
        const usedCategoryPercentage = ((parseFloat(expense.expenseAmount) / categoryAmount) * 100).toFixed(0);

        setBudgetUsagePercentage(usedBudgetPercentage)
        setBudgetCategoryUsagePercentage(usedCategoryPercentage)

        const doughtNutChartBudgetViewData = {
            data: [
                {
                    label: 'Other Expenses',
                    value: otherExpensesInBudgetSum
                },
                {
                    label: 'Total Budget Used',
                    value: expensesInBudgetSum
                },
                {
                    label: 'Selected Expense',
                    value: parseFloat(expense.expenseAmount)
                },
            ],
            budgetAmount: expense.budget.monthlyBudgetAmount,
            expenseAmount: expense.expenseAmount
        }

        setDoughnutData(doughtNutChartBudgetViewData)
        console.log(allExpensesInBudget, expensesInBudgetSum, otherExpensesInBudgetSum)
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
                    <div className='flex'>
                        <ExpenseDoughNutChart chartData={doughnutData} />
                        <div className='grid grid-cols-2 gap-6 w-full'>
                            <div className='flex flex-col gap-1'>
                                <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Name</ModalTextLabel>
                                <p className='text-sm'>{expense.budget.budgetName}</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Category</ModalTextLabel>
                                <p className='text-sm'>{expense.budgetCategory.budgetCategoryName}</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <ModalTextLabel additionalStyles='ml-0 mb-0'>Expense Amount</ModalTextLabel>
                                <p className='text-sm'>{formatCurrency(expense.expenseAmount)}</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <ModalTextLabel additionalStyles='ml-0 mb-0'>SubCategory</ModalTextLabel>
                                <p className='text-sm'>None</p>
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
                    </div>
                    <div className='border-b border-solid border-[#dadada]'></div>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Usage</ModalTextLabel>
                            <p className={`text-sm ${parseFloat(budgetUsagePercentage) > 100 ? 'text-[#FF4D4D]' : ''}`}>
                                {budgetUsagePercentage}%</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Budget Category Usage</ModalTextLabel>
                            <p className={`text-sm ${parseFloat(budgetCategoryUsagePercentage) > 100 ? 'text-[#FF4D4D]' : ''}`}>
                                {budgetCategoryUsagePercentage}%</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>SubCategory Usage</ModalTextLabel>
                            <p className='text-sm'>None</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ModalTextLabel additionalStyles='ml-0 mb-0'>Expense ID</ModalTextLabel>
                            <p className='text-sm'>{expense._id}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <ModalTextLabel additionalStyles='ml-0 mb-0'>Description</ModalTextLabel>
                        <textarea className='border outline-none text-[#1b1b1b] px-3 py-2 border-solid h-24 text-[13.5px] w-full rounded 
                    font-small border-[#1b1b1b] resize-none scrollable-div' readOnly={true} value={expense.description}></textarea>
                    </div>
                </div>
            </div>
        </ModalBackground>,
        portalRoot
    )
}