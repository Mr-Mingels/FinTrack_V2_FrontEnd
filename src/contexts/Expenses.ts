import { createContext, Dispatch, SetStateAction } from 'react'
import { Expense } from '../types'

interface ExpenseContextType {
	expenses: Expense[] | null
	setExpenses: Dispatch<SetStateAction<Expense[] | null>>
}

const ExpenseContext = createContext<ExpenseContextType>(
	{} as ExpenseContextType
)

export const ExpenseProvider = ExpenseContext.Provider
export default ExpenseContext