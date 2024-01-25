import React from 'react'
import { ModalBackgroundProps } from '../../types'

export const ModalBackground = ({ children }: ModalBackgroundProps) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-10'>
        {children}
    </div>
  )
}
