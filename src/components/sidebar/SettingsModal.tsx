import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import UserProfileContext from '../../contexts/UserProfile.ts';
import { SettingModalProps } from '../../types/sidebar/index.ts';

const SettingsModal = ({ setModalOpen }: SettingModalProps) => {
    // const { userProfile, setUserProfile } = useContext(UserProfileContext);
    const navigate = useNavigate()

    const LogOut = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/log-out`, { withCredentials: true })
            if (response.status === 200) {
                navigate('/log-in')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='fixed min-h-screen h-full w-full z-[9999] bg-[rgba(0,0,0,0.4)] left-0 top-0'>
            <div className='flex justify-center items-center w-full min-h-screen h-full'>
                <button className='h-[30px] w-[100px] m-[30px] bg-white' onClick={LogOut}>LogOut</button>
                <button className='h-[30px] w-[100px] m-[30px] bg-white' onClick={() => setModalOpen(false)}>Close</button>
            </div>
        </div>
    )
}

export default SettingsModal