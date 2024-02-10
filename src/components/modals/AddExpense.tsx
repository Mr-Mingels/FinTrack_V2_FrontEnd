import React, { useState, useContext, useEffect } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../misc/Button'
import { ModalInput } from '../misc/ModalInput'
import { ModalLabel } from '../misc/ModalLabel'
import BudgetContext from '../../contexts/Budgets'
import { ModalDropDown } from '../misc/ModalDropDown'
import { Budget } from '../../types'
import { BudgetCategories } from '../../types'
import { ModalTextArea } from '../misc/ModalTextArea'
import { toast } from 'sonner'
import { DropDownFieldProps } from '../../types'
import ExpenseContext from '../../contexts/Expenses'
import axios from 'axios'

type AddExpenseProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddExpense = ({ setModalOpen }: AddExpenseProps) => {
    const [btnLoader, setBtnLoader] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [expenseAmount, setExpenseAmount] = useState<string>('')
    const [expenseAmountError, setExpenseAmountError] = useState<boolean>(false)
    const [pickedBudget, setPickedBudget] = useState<DropDownFieldProps>({
        value: '-- None --',
        id: '',
        error: false
    })
    const [pickedBudgetCategory, setPickedBudgetCategory] = useState<DropDownFieldProps>({
        value: '-- None --',
        id: '',
        error: false
    })
    const [pickedSubCategory, setPickedSubCategory] = useState<DropDownFieldProps>({
        value: '-- None --',
        id: '',
        error: false
    })
    const { budgets } = useContext(BudgetContext)
    const { expenses, setExpenses } = useContext(ExpenseContext)

    const addExpense = async () => {
        try {
            setBtnLoader(true)
            if (expenseAmount === '' || pickedBudget.id === '' || pickedBudgetCategory.id === '') {

                if (pickedBudget.id === '') {
                    setPickedBudget({
                        ...pickedBudget,
                        error: true
                    })
                } else {
                    setPickedBudget({
                        ...pickedBudget,
                        error: false
                    })
                }

                if (pickedBudgetCategory.id === '') {
                    setPickedBudgetCategory({
                        ...pickedBudget,
                        error: true
                    })
                } else {
                    setPickedBudgetCategory({
                        ...pickedBudget,
                        error: false
                    })
                }

                if (expenseAmount === '') {
                    setExpenseAmountError(true)
                } else {
                    setExpenseAmountError(false)
                }

                if (pickedBudget.id === '' || pickedBudgetCategory.id === '') toast.error('Please fill out all required fields')

                setBtnLoader(false)
                return
            }

            const expense = {
                budget: pickedBudget.id,
                budgetCategory: pickedBudgetCategory.id,
                expenseAmount: expenseAmount,
                description: description
            }

            setExpenseAmountError(false)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/expense/add-expense`, expense, { withCredentials: true })
            if (response.status === 200) {
                setExpenses(prevExpenses => {
                    if (prevExpenses === null) {
                        return [response.data];
                    } else {
                        return [...prevExpenses, response.data];
                    }
                });
                setModalOpen(false)
                toast.success('🎉 Expense Successfully Created!');
            }
            setBtnLoader(false)
        } catch (err) {
            console.log(err)
            toast.error('Unknown Server Error')
            setBtnLoader(false)
        }
    }

    return (
        <ModalBackground>
            <div className='bg-white p-6 rounded-lg w-[600px]'>
                <div className='flex items-center justify-between border-b-[#dadada] border-b border-solid pb-2 mb-6 text-[#1b1b1b]'>
                    <h2 className='text-lg'>Add Expense</h2>
                    <div className='flex items-center justify-center w-5 h-5 cursor-pointer' onClick={() => setModalOpen(false)}>
                        <FontAwesomeIcon className='h-full w-full' color='#1b1b1b' icon={faXmark} />
                    </div>
                </div>
                <div className='grid grid-cols-2 grid-rows-2 grid-flow-row gap-4 mb-6'>
                    <div className='flex flex-col'>
                        <ModalLabel required={true}>Amount</ModalLabel>
                        <ModalInput value={expenseAmount} onChangeHandler={(e) => {
                            const input = e.target.value;
                            const isValidInput = /^\d*\.?\d*$/.test(input);
                            if (isValidInput) {
                                setExpenseAmount(e.target.value)
                            }
                        }}
                            placeholder={expenseAmountError ? 'Fill Out Field' : 'Expense Amount'} 
                            additionalStyles={`${expenseAmountError ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`}/>
                    </div>
                    <div className='flex flex-col'>
                        <ModalLabel required={true}>Budget Category</ModalLabel>
                        <ModalDropDown options={() => {
                            if (pickedBudget.id === '') return []
                            return budgets?.filter((budget) => budget._id === pickedBudget.id).map((budget: Budget) => (
                                budget.categories.map((category: BudgetCategories) => ({
                                    name: category.name,
                                    id: budget._id
                                }))
                            ))[0] || [];
                        }}
                            value={pickedBudgetCategory.value}
                            deactivated={pickedBudget.id === '' ? true : false}
                            changeValue={setPickedBudgetCategory}
                            additionalStyles={`${pickedBudgetCategory.error ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <ModalLabel required={true}>Budget</ModalLabel>
                        <ModalDropDown options={() => {
                            return budgets?.map((budget: Budget) => ({
                                name: budget.budgetName,
                                id: budget._id
                            })) || [];
                        }}
                            value={pickedBudget.value}
                            deactivated={budgets?.length === 0 ? true : false}
                            changeValue={setPickedBudget}
                            additionalStyles={`${pickedBudget.error ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <ModalLabel required={false}>SubCategory</ModalLabel>
                        <ModalDropDown options={() => {
                            return budgets?.map((budget: Budget) => ({
                                name: budget.budgetName,
                                id: budget._id
                            })) || [];
                        }}
                            value={pickedSubCategory.value}
                            deactivated={true}
                            changeValue={setPickedSubCategory}
                        />
                    </div>
                </div>
                <div className='flex flex-col mb-6'>
                    <ModalLabel required={false}>Description</ModalLabel>
                    <ModalTextArea value={description} placeholder='Write a brief description...' onChangeHandler={(e) => setDescription(e.target.value)} />
                </div>
                <div className='flex gap-4 h-10'>
                    <Button additionalStyles='h-full bg-[#1b1b1b] text-white rounded hover:bg-[#141414]' onClickHandler={() => setModalOpen(false)}>Close</Button>
                    {btnLoader ? (
                        <Button type='button' additionalStyles='text-white h-full rounded bg-[#6d9dc5] border-[#6d9dc5] cursor-default'>
                            <span className="btnLoader"></span>
                        </Button>
                    ) : (
                        <Button additionalStyles='h-full bg-[#6d9dc5] text-white rounded border-[#6d9dc5] hover:bg-[#63a0d3]'
                            onClickHandler={addExpense}>
                            Add
                        </Button>
                    )}
                </div>
            </div>
        </ModalBackground>
    )
}
