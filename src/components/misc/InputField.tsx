import React from 'react'
import { InputFieldProps } from '../../types'

export const InputField = ({ value, onChangeHandler, inputType, additionalStyles, placeholder, name }: InputFieldProps) => {
  return (
    <input type={inputType ? inputType : ''} name={name ? name : ''} className={`${additionalStyles ? additionalStyles : ''} border outline-none text-[#1b1b1b] transition-[border-color] duration-[0.2s] ease-[ease-in-out] 
    px-3 py-2 border-solid border-[#dadada] h-10 text-sm font-small focus:border-[#1b1b1b] placeholder:text-[#757575]`} value={value} placeholder={placeholder} onChange={onChangeHandler}/>
  )
}
