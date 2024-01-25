import React, { useState } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ModalInput } from '../misc/ModalInput'
import { Button } from '../misc/Button'
import { BudgetCategoryInput } from '../../types'
import { toast } from 'sonner'
import axios from 'axios'

type AddBudgetProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddBudget = ({ setModalOpen }: AddBudgetProps) => {
    const [budgetName, setBudgetName] = useState<string>('')
    const [loader, setLoader] = useState<boolean>(false)
    const [sumError, setSumError] = useState<boolean>(false)
    const [categories, setCategories] = useState<BudgetCategoryInput[]>([{
        nameField: {
            name: '',
            emptyField: false
        }, percentageField: {
            percentage: '',
            emptyField: false,
        }
    }]);

    const handleAddCategory = () => {
        setCategories([...categories, {
            nameField: {
                name: '',
                emptyField: false
            }, percentageField: {
                percentage: '',
                emptyField: false,
            }
        }]);
    };

    const handleRemoveCategory = (indexToRemove: number) => {
        const newCategories = categories.filter((_, index) => index !== indexToRemove);
        setCategories(newCategories);
    };

    const addBudget = async () => {
        try {
            setLoader(true)
            const newCategories = categories.map((category) => {
                const isEmptyName = category.nameField.name === '';
                const isEmptyPercentage = category.percentageField.percentage === '';

                return {
                    ...category,
                    nameField: {
                        ...category.nameField,
                        emptyField: isEmptyName,
                    },
                    percentageField: {
                        ...category.percentageField,
                        emptyField: isEmptyPercentage,
                    },
                };
            });

            const sumOfPercentages = categories.reduce((accumulator, category) => {
                const percentage = parseInt(category.percentageField.percentage);
                return isNaN(percentage) ? accumulator : accumulator + percentage;
            }, 0);

            const hasEmptyFields = newCategories.some((category) => category.nameField.emptyField || category.percentageField.emptyField);

            setCategories(newCategories)

            if (hasEmptyFields || sumOfPercentages > 100) {
                if (sumOfPercentages > 100) {
                    setSumError(true)
                    toast.error('Total Sum of Budget Percentage exceeds 100%. Please adjust your category percentages.')
                } else if (hasEmptyFields) {
                    setSumError(false)
                }
                setLoader(false)
                return
            }

            const budgetCategories = categories.map((category) => {
                return {
                    name: category.nameField.name,
                    percentage: parseInt(category.percentageField.percentage)
                }
            })

            const budget = {
                budgetName: budgetName,
                budgetCategories: budgetCategories
            }

            setSumError(false)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/budget/add-budget`, budget, { withCredentials: true })
            if (response.status === 200) {
                setModalOpen(false)
                toast.success('🎉 Budget Successfully Created!');
            }
            setLoader(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ModalBackground>
            <div className='bg-white p-6 rounded-lg w-[600px]'>
                <div className='flex items-center justify-between border-b-[#dadada] border-b border-solid pb-2 mb-6 text-[#1b1b1b]'>
                    <h2 className='text-lg'>Add Budget</h2>
                    <div className='flex items-center justify-center w-5 h-5 cursor-pointer' onClick={() => setModalOpen(false)}>
                        <FontAwesomeIcon className='h-full w-full' color='#1b1b1b' icon={faXmark} />
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col'>
                        <label className='text-[13px] mb-1 ml-1 text-[#444444]'>Budget Name <span className='text-[#FF4D4D]'>*</span></label>
                        <ModalInput value={budgetName} onChangeHandler={(e) => setBudgetName(e.target.value)} placeholder='Ex. Personal Finance' />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[13px] mb-1 ml-1 text-[#444444]'>Budget Categories <span className='text-[#FF4D4D]'>*</span></label>
                        <div className='flex flex-col gap-3 overflow-y-scroll max-h-[300px]'>
                            {categories.map((category, index) => (
                                <div key={index} className='flex gap-4'>
                                    <ModalInput
                                        value={category.nameField.name}
                                        onChangeHandler={(e) => {
                                            const newCategories = [...categories];
                                            newCategories[index].nameField.name = e.target.value;
                                            setCategories(newCategories);
                                        }}
                                        additionalStyles={`${categories[index].nameField.emptyField ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`}
                                        placeholder={
                                            categories[index].nameField.emptyField ? 'Fill Out Field' : 'Budget Category Name'
                                        }
                                    />
                                    <ModalInput
                                        value={category.percentageField.percentage}
                                        onChangeHandler={(e) => {
                                            const input = e.target.value;
                                            const isValidInput = /^\d*\.?\d*$/.test(input);
                                            if (isValidInput) {
                                                setCategories((prevCategories) => {
                                                    const newCategories = [...prevCategories];
                                                    newCategories[index].percentageField.percentage = input;
                                                    return newCategories;
                                                });
                                            }
                                        }}
                                        additionalStyles={`${categories[index].percentageField.emptyField ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''} 
                                        ${sumError ? 'border-[#FF4D4D]' : ''}`}
                                        placeholder={
                                            categories[index].percentageField.emptyField ? 'Fill Out Field' : 'Budget %'
                                        }
                                    />
                                    {categories.length > 1 && (
                                        <div className='flex items-center justify-center min-w-9 cursor-pointer border rounded border-[#1b1b1b] 
                        transition-colors text-[#FF4D4D] hover:border-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-[#1b1b1b]'
                                            onClick={() => handleRemoveCategory(index)}>
                                            <FontAwesomeIcon className='text-inherit' icon={faTrashCan} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='mt-3 ml-1'>
                            <span className='text-sm text-[#63a0d3] cursor-pointer select-none' onClick={handleAddCategory}>Add Category +</span>
                        </div>
                    </div>
                    <div className='flex gap-4 h-10'>
                        <Button additionalStyles='h-full bg-[#1b1b1b] text-white rounded hover:bg-[#141414]' onClickHandler={() => setModalOpen(false)}>Close</Button>
                        {loader ? (
                            <Button type='button' additionalStyles='text-white h-full rounded bg-[#6d9dc5] border-[#6d9dc5] cursor-default'>
                                <span className="btnLoader"></span>
                            </Button>
                        ) : (
                            <Button additionalStyles='h-full bg-[#6d9dc5] text-white rounded border-[#6d9dc5] hover:bg-[#63a0d3]'
                                onClickHandler={addBudget}>
                                Add
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ModalBackground>
    )
}
