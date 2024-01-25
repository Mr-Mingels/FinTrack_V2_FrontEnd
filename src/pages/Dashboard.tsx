import React, { useEffect, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileContext from '../contexts/UserProfile.ts';
import SideBar from '../components/sidebar/SideBar.tsx';

const DashBoard = () => {
  const { userProfile, setUserProfile } = useContext(UserProfileContext);
  const navigate = useNavigate()

  const checkAuth = async () => {
    // TODO: ADD LOADER WHILE CHECKING TO SEE IF THE USER IS AUTHENTICATED OR NOT
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/authenticated`, { withCredentials: true });
      // check for user authentication
      if (response.status === 200) {
        const userData = await response.data;
        console.log(userData)
        setUserProfile(userData)
      } else {
        navigate('/log-in')
      }
    } catch (error: any) {
      console.log(error.message);
      console.log(error);
      if (error.response.status === 401) {
        navigate('/log-in')
      }
    }
  };

  useEffect(() => {
    checkAuth()
  }, [])

  if (!userProfile) {
    return
  }

  return (
    <div className='min-h-screen w-full'>
      <div className='flex w-full'>
        <SideBar />
        <div className='flex-grow bg-[#f5f6f8] px-[30px] py-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashBoard