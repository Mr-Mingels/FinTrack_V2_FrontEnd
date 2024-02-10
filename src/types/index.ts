import { ReactNode, ChangeEvent } from "react"

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
    createdAt: string
}

export type BudgetCategories = {
    name: string
    percentage: number
    _id: string
}

export interface Budget {
    budgetName: string
    categories: BudgetCategories[]
    createdAt: string
    updatedAt: string
    monthlyBudgetAmount: string
    user: string
    _id: string
}

export interface Expense {
    budget: string
    user: string
    budgetCategory: string
    expenseAmount: string
    description: string
    createdAt: string
    _id: string
}

export interface InputFieldProps {
    value: string
    additionalStyles?: string
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    inputType?: string
    placeholder: string
    name?: string
}

export interface ButtonProps {
    type?: "submit" | "reset" | "button"
    gradient?: boolean
	additionalStyles?: string
	onClickHandler?: () => void
    children: ReactNode
	disabled?: boolean
}

export interface ModalBackgroundProps {
    children: React.ReactNode
}

export interface ModalInputProps {
    value: string
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    additionalStyles?: string
    placeholder: string
}

export interface ModalTextAreaProps {
    value: string
    onChangeHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    additionalStyles?: string
    placeholder: string
}

export interface ModalLabelProps {
    children: ReactNode
    required?: boolean
    additionalStyles?: string
}

export type DropDownFieldProps = {
    value: string
    id: string
    error: boolean
}

export interface ModalDropDownProps {
    options: any
    value: string
    additionalStyles?: string
    deactivated?: boolean
    changeValue: React.Dispatch<React.SetStateAction<DropDownFieldProps>>
}

export type BudgetCategoryInput = {
    nameField: {
        name: string
        emptyField: boolean
    }
    percentageField: {
        percentage: string
        emptyField: boolean
    }
}

export type BudgetPieChartProps = {
    categories: BudgetCategories[]
}