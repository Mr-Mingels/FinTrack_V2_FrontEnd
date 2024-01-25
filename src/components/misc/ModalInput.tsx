import React from 'react'
import { ModalInputProps } from '../../types'

export const ModalInput = ({ value, onChangeHandler, additionalStyles, placeholder }: ModalInputProps) => {
    return (
        <input className={`${additionalStyles ? additionalStyles : ''} border outline-none text-[#1b1b1b] transition-[border-color] 
        duration-[0.2s] ease-[ease-in-out] px-3 py-2 border-solid border-[#dadada] h-9 text-[13.5px] w-full rounded font-small focus:border-[#1b1b1b] 
        placeholder:text-[#757575]`} value={value} placeholder={placeholder} onChange={onChangeHandler} />
    )
}
