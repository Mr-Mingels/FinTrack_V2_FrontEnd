import React, { useState, useContext } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Expense } from '../../types'
import { Button } from '../misc/Button'
import ReactDOM from 'react-dom';
import { toast } from 'sonner'
import axios from 'axios'
import ExpenseContext from '../../contexts/Expenses'

type EditBudgetProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    expense: Expense
}

export const DeleteExpense = ({ setModalOpen, expense }: EditBudgetProps) => {
    const [btnLoader, setBtnLoader] = useState<boolean>(false)
    const portalRoot = document.getElementById('portal-root');
    const { expenses, setExpenses } = useContext(ExpenseContext)

    const deleteExpense = async () => {
        try {
            setBtnLoader(true)
            
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/expense/delete-expense`, { 
                data: expense,
                withCredentials: true 
            });            
            if (response.status === 200) {
                const filteredExpenses = expenses?.filter(expenseItem => expenseItem._id !== expense._id) 
                setExpenses(filteredExpenses ? filteredExpenses : null)
                setModalOpen(false)
                toast.success('🎉 Expense Successfully Deleted!');
            }
            setBtnLoader(false)
        } catch (err) {
            console.log(err)
            toast.error('Unknown Server Error')
            setBtnLoader(false)
        }
    }

    if (!portalRoot) {
        return null;
    }

    return ReactDOM.createPortal(
        <ModalBackground>
            <div className='bg-white p-6 rounded-lg w-[600px] flex flex-col'>
                <div className='flex items-center justify-between border-b-[#dadada] border-b border-solid pb-2 mb-6 text-[#1b1b1b]'>
                    <h2 className='text-lg'>Delete Expense</h2>
                    <div className='flex items-center justify-center w-5 h-5 cursor-pointer' onClick={() => setModalOpen(false)}>
                        <FontAwesomeIcon className='h-full w-full' color='#1b1b1b' icon={faXmark} />
                    </div>
                </div>
                <p className='text-sm text-[#1b1b1b]'>Are you sure you want to delete this expense? This action cannot be undone.</p>
                <div className='flex gap-4 h-10 mt-8'>
                    <Button additionalStyles='h-full bg-[#1b1b1b] text-white rounded hover:bg-[#141414]' onClickHandler={() => setModalOpen(false)}>Close</Button>
                    {btnLoader ? (
                        <Button type='button' additionalStyles='text-white h-full rounded bg-[#6d9dc5] border-[#6d9dc5] cursor-default'>
                            <span className="btnLoader"></span>
                        </Button>
                    ) : (
                        <Button additionalStyles='h-full bg-[#FF4D4D] text-white rounded border-[#FF4D4D] hover:bg-[#DF2D2D]' 
                        onClickHandler={deleteExpense}>
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </ModalBackground>,
        portalRoot
    )
}
