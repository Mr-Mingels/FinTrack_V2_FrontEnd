import React from 'react'
import { ModalLabelProps } from '../../types'

export const ModalInputLabel = ({ required, additionalStyles, children }: ModalLabelProps) => {
  return (
    <label className={`${additionalStyles} mb-1 text-[13px] ml-1 text-[#444444]`}>
        {children} 
        {required && (
            <span className='text-[#FF4D4D]'> *</span>
        )}
    </label>
  )
}
