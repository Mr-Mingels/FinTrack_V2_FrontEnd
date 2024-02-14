import React, { useState } from 'react'
import { ModalDropDownProps } from '../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export const ModalDropDown = ({ value, options, additionalStyles, deactivated, changeValue }: ModalDropDownProps) => {
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)
    const [newValue, setNewValue] = useState<string>(value)

    return (
        <div className={`${additionalStyles} ${!deactivated ? 'text-[#1b1b1b] border-[#1b1b1b] cursor-pointer' : 'text-[#757575] select-none'} 
    border relative outline-none transition-[border-color] duration-[0.2s] ease-[ease-in-out] px-3 py-2 border-solid h-9 
    text-[13.5px] w-full rounded font-small`}
            onClick={() => {
                if (deactivated) return
                if (dropDownOpen) {
                    setDropDownOpen(false)
                } else {
                    setDropDownOpen(true)
                }
            }}>
            <div className='flex items-center justify-between'>
                <span>{newValue}</span>
                {dropDownOpen ? (
                    <FontAwesomeIcon className='h-3 w-3' icon={faChevronUp} />
                ) : (
                    <FontAwesomeIcon className='h-3 w-3 mb-1' icon={faChevronDown} />
                )}
            </div>
            {dropDownOpen && (
                <div className='absolute flex flex-col top-0 left-0 mt-10 bg-white outline-none text-[#1b1b1b] border-[#1b1b1b] 
                border border-solid text-[13.5px] min-w-full rounded font-small z-[100]'>
                    {options().map((option: any, index: number) => (
                        <div key={index} className={`${index === 0 && 'rounded-[4px_4px_0_0]'} ${index === options().length - 1 && 'rounded-[0_0_4px_4px]'}
                        py-2 flex items-center px-3 hover:bg-[#6d9dc5] hover:text-white`} onClick={() => {
                                changeValue({
                                    value: option.name,
                                    id: option.id,
                                    percentage: option.percentage ? option.percentage : null,
                                    error: false
                                })
                                setNewValue(option.name)
                            }}>
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
