import React, { useEffect, useState, useContext } from 'react'
import { ModalBackground } from '../misc/ModalBackground'
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ModalInput } from '../misc/ModalInput'
import { Button } from '../misc/Button'
import { BudgetCategoryInput } from '../../types'
import { toast } from 'sonner'
import BudgetContext from '../../contexts/Budgets'
import axios from 'axios'
import { ModalInputLabel } from '../misc/ModalInputLabel'

type AddBudgetProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddBudgetModal = ({ setModalOpen }: AddBudgetProps) => {
    const [budgetName, setBudgetName] = useState<string>('')
    const [budgetNameError, setBudgetNameError] = useState<boolean>(false)
    const [monthlyAmountError, setMonthlyAmountError] = useState<boolean>(false)
    const [monthlyAmount, setMonthlyAmount] = useState<string>('')
    const { setBudgets } = useContext(BudgetContext);
    const [loader, setLoader] = useState<boolean>(false)
    const [sumError, setSumError] = useState<boolean>(false)
    const [sumOfPercentages, setSumOfPercentages] = useState<number>(0)
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

            const hasEmptyFields = newCategories.some((category) => category.nameField.emptyField || category.percentageField.emptyField);

            setCategories(newCategories)

            if (hasEmptyFields || sumOfPercentages < 100 || budgetName === '' || monthlyAmount === '') {
                if (sumOfPercentages < 100) {
                    setSumError(true)
                    toast.error('Total Sum of Budget Percentage is below 100%. Please adjust your category percentages.')
                } else {
                    setSumError(false)
                }

                if (budgetName === '') {
                    setBudgetNameError(true)
                } else {
                    setBudgetNameError(false)
                }

                if (monthlyAmount === '') {
                    setMonthlyAmountError(true)
                } else {
                    setMonthlyAmountError(false)
                }
                setLoader(false)
                return
            }

            const budgetCategories = categories.map((category: BudgetCategoryInput) => {
                return {
                    name: category.nameField.name,
                    percentage: parseInt(category.percentageField.percentage)
                }
            })

            const budget = {
                budgetName: budgetName,
                budgetCategories: budgetCategories,
                monthlyBudgetAmount: monthlyAmount
            }

            setSumError(false)
            setBudgetNameError(false)
            setMonthlyAmountError(false)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/budget/add-budget`, budget, { withCredentials: true })
            if (response.status === 200) {
                setBudgets(prevBudgets => {
                    if (prevBudgets === null) {
                        return [response.data];
                    } else {
                        return [...prevBudgets, response.data];
                    }
                });
                setModalOpen(false)
                toast.success('🎉 Budget Successfully Created!');
            }
            setLoader(false)
        } catch (err) {
            console.log(err)
            toast.error('Unknown Server Error')
            setLoader(false)
        }
    }

    useEffect(() => {
        const sumOfPercentages = categories.reduce((accumulator: number, category: BudgetCategoryInput) => {
            const percentage = parseInt(category.percentageField.percentage);
            return isNaN(percentage) ? accumulator : accumulator + percentage;
        }, 0);

        setSumOfPercentages(sumOfPercentages)
    }, [categories])

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
                        <ModalInputLabel required={true}>Budget Name</ModalInputLabel>
                        <ModalInput value={budgetName} onChangeHandler={(e) => setBudgetName(e.target.value)} placeholder={budgetNameError ? 'Fill Out Field' : 'Ex. Personal Finance'}
                            additionalStyles={`${budgetNameError ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`} />
                        <ModalInputLabel required={true} additionalStyles='mt-6'>Monthly Budget Amount</ModalInputLabel>
                        <ModalInput value={monthlyAmount} onChangeHandler={(e) => {
                            const input = e.target.value;
                            const isValidInput = /^\d*\.?\d*$/.test(input);
                            if (isValidInput) {
                                setMonthlyAmount(e.target.value)
                            }
                        }}
                            placeholder={monthlyAmountError ? 'Fill Out Field' : 'Ex. $10,000'}
                            additionalStyles={`${monthlyAmountError ? 'placeholder:text-[#FF4D4D] border-[#FF4D4D]' : ''}`} />
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between'>
                            <ModalInputLabel required={true}>Budget Categories</ModalInputLabel>
                            <div className='mb-1 mr-1 text-[13px] text-[#1b1b1b] flex items-center'><span className={`${sumOfPercentages > 100 ? 'text-[#FF4D4D]' : ''}`}>{sumOfPercentages}%</span>&nbsp;/ 100%</div>
                        </div>
                        <div className='flex flex-col gap-3 overflow-y-scroll max-h-[200px] scrollable-div'>
                            {categories.map((category: BudgetCategoryInput, index: number) => (
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
                                                setCategories((prevCategories: BudgetCategoryInput[]) => {
                                                    const newCategories = [...prevCategories];
                                                    const filteredCategories = newCategories.filter((_, currentIndex) => currentIndex !== index);
                                                    const sumOfFilteredCategories = filteredCategories.reduce((accumulator, category) => {
                                                        const percentage = parseInt(category.percentageField.percentage);
                                                        return isNaN(percentage) ? accumulator : accumulator + percentage;
                                                    }, 0);
                                                    newCategories[index].percentageField.percentage = input;
                                                    if (parseInt(newCategories[index].percentageField.percentage) + sumOfFilteredCategories > 100 ||
                                                        parseInt(newCategories[index].percentageField.percentage) > 100) {
                                                        newCategories[index].percentageField.percentage = input.slice(0, -1);
                                                        return prevCategories
                                                    }
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
