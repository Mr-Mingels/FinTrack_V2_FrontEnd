import React, { useState, useEffect, ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { AuthInputField } from '../components/misc/AuthInputField'
import { Button } from '../components/misc/Button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
    const [redEmailPlaceHolder, setRedEmailPlaceHolder] = useState<boolean>(false)
    const [redPasswordPlaceholder, setRedPasswordPlaceholder] = useState<boolean>(false)
    const [redConfirmPasswordPlaceholder, setRedConfirmPasswordPlaceholder] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [email, setEmail] = useState({
        value: '',
        placeholder: 'Enter your email'
    });
    const [password, setPassword] = useState({
        value: '',
        placeholder: 'Password'
    });
    const [confirmPassword, setConfirmPassword] = useState({
        value: '',
        placeholder: 'Confirm Password'
    });

    const navigate = useNavigate()

    useEffect(() => {
        if (email.value !== '') {
            setRedEmailPlaceHolder(false)
            setEmail({ ...email, placeholder: 'Enter your email' })
        }
    }, [email.value])

    useEffect(() => {
        if (password.value !== '') {
            setRedPasswordPlaceholder(false)
            setPassword({ ...password, placeholder: 'Enter your password' })
        }
    }, [password.value])

    useEffect(() => {
        if (confirmPassword.value !== '') {
            setRedConfirmPasswordPlaceholder(false)
            setConfirmPassword({ ...confirmPassword, placeholder: 'Confirm Password' })
        }
    }, [confirmPassword.value])

    const navigateToLogIn = () => {
        navigate('/log-in')
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoader(true)
        event.preventDefault();
        if (email.value === '') {
            setRedEmailPlaceHolder(true)
            setEmail({ ...email, placeholder: 'Please Fill Out This Field' })
        }
        if (password.value === '') {
            setRedPasswordPlaceholder(true)
            setPassword({ ...password, placeholder: 'Please Fill Out This Field' })
        }
        if (confirmPassword.value === '') {
            setRedConfirmPasswordPlaceholder(true)
            setConfirmPassword({ ...confirmPassword, placeholder: 'Please Fill Out This Field' })
        }
        if (confirmPassword.value !== password.value) {
            setRedConfirmPasswordPlaceholder(true)
            setConfirmPassword({ placeholder: 'Incorrect Password', value: '' })
        }
        if (password.value === '' || email.value === '' || confirmPassword.value === '' || confirmPassword.value !== password.value) {
            setLoader(false)
            return;
        }

        const user = {
            email: email.value.toUpperCase(),
            password: password.value,
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/sign-up`, user, { withCredentials: true });
            if (response.status === 200) {
                navigate('/log-in')
            }
            setLoader(false)
        } catch (error: any) {
            if (error.response) {
                console.error('Error message: ', error.response.data.message);
                if (error.response.data.message === "Email has already been taken") {
                    setRedEmailPlaceHolder(true)
                    setEmail({ ...email, value: '', placeholder: 'Email has already been taken' })
                }
            } else {
                console.error('Error', error.message);
            }
            setLoader(false)
        }
    }

    return (
        <div className='h-screen w-full flex justify-center items-center bg-black'>
            <div className='bg-white flex justify-center items-center flex-col w-[450px] p-6'>
                <div className='authLogoWrapper items-center bg-[#1b1b1b] box-border flex h-[45px] justify-center min-h-[45px] min-w-[40px] w-10 mb-4 border-2 border-solid border-[#1b1b1b]'>
                    <FontAwesomeIcon color='#6d9dc5' icon={faCoins} />
                </div>
                <h2 className='text-[#1b1b1b] text-[22px] font-medium'>Create your Account</h2>
                <div className='items-end flex h-[34px] justify-center w-full mt-1.5 pb-3 border-b-[#dadada] border-b border-solid'>
                    <span className='text-[#1b1b1b] cursor-pointer text-xs underline'>Use Demo Account</span>
                </div>
                <form method='POST' className='text-[#1b1b1b] flex flex-col w-full pt-6' onSubmit={handleFormSubmit}>
                    <label className='items-center flex text-[15px] gap-0.5 mb-1'>
                        Email
                        <span className='text-[#ff6464]'>*</span>
                    </label>
                    <AuthInputField value={email.value} placeholder={email.placeholder} inputType='email' name='email'
                        onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => setEmail({...email, value: e.target.value})} 
                        additionalStyles={`${redEmailPlaceHolder ? 'placeholder:text-[#ff6464]' : ''} mb-6`} />
                    <label className='items-center flex text-[15px] gap-0.5 mb-1'>
                        Password
                        <span className='text-[#ff6464]'>*</span>
                    </label>
                    <AuthInputField value={password.value} placeholder={password.placeholder} inputType='password' name='password'
                        onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => setPassword({...password, value: e.target.value})} 
                        additionalStyles={`${redPasswordPlaceholder ? 'placeholder:text-[#ff6464]' : ''} mb-6`} />
                    <label className='items-center flex text-[15px] gap-0.5 mb-1'>
                        Confirm Password
                        <span className='text-[#ff6464]'>*</span>
                    </label>
                    <AuthInputField value={confirmPassword.value} placeholder={confirmPassword.placeholder} inputType='password'
                        onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword({ ...confirmPassword,value: e.target.value })} 
                        additionalStyles={`${redConfirmPasswordPlaceholder ? 'placeholder:text-[#ff6464]' : ''} mb-6`} />
                    <div className='flex flex-col gap-4 mt-3'>
                        {loader ? (
                            <Button type='button' additionalStyles='text-white bg-[#1b1b1b] cursor-default'>
                                <span className="btnLoader"></span>
                            </Button>
                        ) : (
                            <Button type='submit' additionalStyles='text-white bg-[#1b1b1b] hover:bg-[#6d9dc5] hover:text-[#1b1b1b]'>
                            Sign Up
                        </Button>
                        )}
                    </div>
                    <span className='items-center text-[#757575] flex text-xs gap-1 justify-center mt-4'>
                        Already have an account?
                        <span className='text-[#1b1b1b] cursor-pointer underline' onClick={() => navigateToLogIn()}>
                            Log In</span>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default SignUp