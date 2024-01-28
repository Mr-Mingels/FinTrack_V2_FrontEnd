import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SettingModalProps } from '../../types/sidebar/index.ts';
import { toast } from 'sonner';
import { ModalBackground } from '../misc/ModalBackground.tsx';


const SettingsModal = ({ setModalOpen }: SettingModalProps) => {
    const navigate = useNavigate()

    const LogOut = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/log-out`, { withCredentials: true })
            if (response.status === 200) {
                navigate('/log-in')
            }
        } catch (err) {
            console.log(err)
            toast.error('Unknown Server Error')
        }
    }

    return (
        <ModalBackground>
            <div className='flex justify-center items-center w-full min-h-screen h-full'>
                <button className='h-[30px] w-[100px] m-[30px] bg-white' onClick={LogOut}>LogOut</button>
                <button className='h-[30px] w-[100px] m-[30px] bg-white' onClick={() => setModalOpen(false)}>Close</button>
            </div>
        </ModalBackground>
    )
}

export default SettingsModal