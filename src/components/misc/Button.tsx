import React from 'react'
import { ButtonProps } from '../../types'

export const Button = ({onClickHandler, gradient, additionalStyles, type, children, disabled }: ButtonProps) => {
    return (
        <button
            onClick={onClickHandler}
            type={type}
            className={`${gradient ? 'btnGradient' : ''} ${additionalStyles ? additionalStyles : ''} border
             text-sm h-[42px] border-solid border-[#1b1b1b] transition-colors flex items-center justify-center w-full
            select-none`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
