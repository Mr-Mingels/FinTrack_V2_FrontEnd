import React, { useState } from 'react'
import { AddBudget } from '../modals/AddBudget'

const Budgets = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <div className='flex flex-col h-full'>
      <div className='text-2xl h-[64px] font-medium text-[#1b1b1b] flex items-end justify-between border-b-[#dadada] 
      border-b border-solid pb-2'>
        <h2 className='flex items-end'>Budgets</h2>
        <button type='button' className='h-9 px-4 text-white bg-[#1b1b1b] font-normal rounded text-sm hover:bg-[#6d9dc5] 
        transition-colors' onClick={() => setModalOpen(true)}>
          Add Budget +
        </button>
      </div>
      <div>

      </div>
      {modalOpen && (
        <AddBudget setModalOpen={setModalOpen}/>
      )}
    </div>
  )
}

export default Budgets
