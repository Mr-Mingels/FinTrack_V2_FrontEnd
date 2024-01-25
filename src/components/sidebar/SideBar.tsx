import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCreditCard, faMagnifyingGlass, faWallet, faCalendarDays, faChartLine, faCoins } from '@fortawesome/free-solid-svg-icons';
import { SideBarItem } from '../../types/sidebar';
import SettingsModal from './SettingsModal.tsx';

const SideBar = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const location = useLocation()
  const sideBarItems: SideBarItem[] = [
    {
      itemName: 'Overview',
      itemIcon: faMagnifyingGlass
    },
    {
      itemName: 'Budget',
      itemIcon: faWallet
    },
    {
      itemName: 'Expenses',
      itemIcon: faCreditCard
    },
    {
      itemName: 'Calender',
      itemIcon: faCalendarDays
    },
    {
      itemName: 'Analytics',
      itemIcon: faChartLine
    },
  ]

  return (
    <div className='min-h-screen min-w-[280px] w-[280px] shadow-[1px_0_10px_rgba(0,0,0,0.1)] z-10'>
      <div className='flex flex-col items-center min-h-screen justify-between px-7 py-6'>
        <div className='w-full h-16 flex justify-center items-center mb-4 pb-4 border-b-[#dadada] border-b border-solid'>
          <div className='flex items-center justify-start w-full gap-3'>
            <div className='authLogoWrapper items-center bg-[#6d9dc5] box-border flex h-[45px] justify-center min-h-[45px] min-w-[40px] w-10 border-2 border-solid border-[#6d9dc5]'>
              <FontAwesomeIcon color='white' icon={faCoins} />
            </div>
            <h2 className='font-extrabold text-xl text-[#6d9dc5]'>FinTrack V2</h2>
          </div>
        </div>
        <div className='flex flex-col items-center w-full gap-3'>
          {sideBarItems.map((item, index) => (
            <Link key={index} to={`/${item.itemName.toLowerCase()}`} type='button' className={`${location.pathname === 
              `/${item.itemName.toLowerCase()}` ? 'text-[white] bg-[#6d9dc5]' : 'hover:bg-[#f2f2f2]'} no-underline text-[#1b1b1b] 
            transition-colors flex items-center gap-4 w-full h-11 rounded px-5 py-2.5 text-sm`}
              onMouseDown={(e) => e.preventDefault()}>
              <FontAwesomeIcon className='w-5 h-5' icon={item.itemIcon} />
              <span className='sideBarItem'>{item.itemName}</span>
            </Link>
          ))}
        </div>
        <button type='button' className='w-full h-11 cursor-pointer bg-transparent rounded text-base flex items-center gap-4 
        text-[#1b1b1b] mt-auto px-5 py-2.5 transition-colors border-[none] hover:bg-[#f2f2f2]' onClick={() => {
          if (modalOpen) {
            setModalOpen(false)
          } else {
            setModalOpen(true)
          }
        }}><FontAwesomeIcon className='w-5 h-5' icon={faGear} />Settings</button>
        {modalOpen ? <SettingsModal setModalOpen={setModalOpen} /> : null}
      </div>
    </div>
  )
}

export default SideBar