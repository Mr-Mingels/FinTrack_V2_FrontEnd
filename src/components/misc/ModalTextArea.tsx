import React from 'react'
import { ModalTextAreaProps } from '../../types'

export const ModalTextArea = ({ value, onChangeHandler, additionalStyles, placeholder }: ModalTextAreaProps) => {
    return (
        <textarea className={`${additionalStyles} border outline-none text-[#1b1b1b] transition-[border-color] 
        duration-[0.2s] ease-[ease-in-out] px-3 py-2 border-solid h-24 text-[13.5px] w-full rounded font-small focus:border-[#1b1b1b] 
        resize-none scrollable-div`} value={value} placeholder={placeholder} onChange={onChangeHandler} />
    )
}
