import React from 'react'
import { ModalLabelProps } from '../../types'

export const ModalTextLabel = ({ required, additionalStyles, children }: ModalLabelProps) => {
  return (
    <label className={`${additionalStyles} text-[13px] text-[#444444]`}>
        {children} 
        {required && (
            <span className='text-[#FF4D4D]'> *</span>
        )}
    </label>
  )
}