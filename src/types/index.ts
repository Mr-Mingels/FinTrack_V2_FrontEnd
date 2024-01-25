import { ReactNode, ChangeEvent } from "react"

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
    createdAt: string
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