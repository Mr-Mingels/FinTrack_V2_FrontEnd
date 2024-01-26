import { createContext, Dispatch, SetStateAction } from 'react'
import { Budget } from '../types/index.ts'

interface BudgetContextType {
	budgets: Budget[] | null
	setBudgets: Dispatch<SetStateAction<Budget[] | null>>
}

const BudgetContext = createContext<BudgetContextType>(
	{} as BudgetContextType
)

export const BudgetProvider = BudgetContext.Provider
export default BudgetContext