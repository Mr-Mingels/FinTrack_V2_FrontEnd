import React, { useState, useEffect, ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { AuthInputField } from '../components/misc/AuthInputField'
import { Button } from '../components/misc/Button'
import { useNavigate } from 'react-router-dom'
import { FormFieldObject } from '../types/Authentication'
import axios from 'axios'

const SignIn = () => {
    const [redEmailPlaceHolder, setRedEmailPlaceHolder] = useState<boolean>(false)
    const [redPasswordPlaceholder, setRedPasswordPlaceholder] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [email, setEmail] = useState<FormFieldObject>({
        value: '',
        placeholder: 'Enter your email'
    });
    const [password, setPassword] = useState<FormFieldObject>({
        value: '',
        placeholder: 'Enter your password'
    });

    const navigate = useNavigate()

    const navigateToSignUp = () => {
        navigate('/sign-up')
    }

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
        if (password.value === '' || email.value === '') {
            setLoader(false)
            return;
        }

        const user = {
            email: email.value.toUpperCase(),
            password: password.value
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/log-in`, user, { withCredentials: true });
            if (response.status === 200) {
                navigate('/')
            }
            setLoader(false)
        } catch (error: any) {
            if (error.response) {
                console.error('Error message: ', error.response.data.message);
                if (error.response.data.message === 'Email is incorrect') {
                    setRedEmailPlaceHolder(true)
                    setEmail({ ...email, value: '', placeholder: 'Incorrect email' })
                } else if (error.response.data.message === 'Incorrect password') {
                    setRedPasswordPlaceholder(true)
                    setPassword({ ...password, value: '', placeholder: 'Incorrect password' })
                } else if (error.response.data.message === "Email has already been taken") {
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
                <h2 className='text-[#1b1b1b] text-[22px] font-medium'>Log into your Account</h2>
                <div className='items-end flex h-[34px] justify-center w-full mt-1.5 pb-3 border-b-[#dadada] border-b border-solid'>
                    <span className='text-[#1b1b1b] cursor-pointer text-xs underline'>Use Demo Account</span>
                </div>
                <form method='POST' className='text-[#1b1b1b] flex flex-col w-full pt-6' onSubmit={handleFormSubmit}>
                    <label className='items-center flex text-[15px] gap-0.5 mb-1'>
                        Email
                        <span className='text-[#ff6464]'>*</span>
                    </label>
                    <AuthInputField value={email.value} placeholder={email.placeholder} inputType='email' name='email'
                        onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => setEmail({ ...email, value: e.target.value })} additionalStyles={`${redEmailPlaceHolder ? 'placeholder:text-[#ff6464]' : ''} mb-6`} />
                    <label className='items-center flex text-[15px] gap-0.5 mb-1'>
                        Password
                        <span className='text-[#ff6464]'>*</span>
                    </label>
                    <AuthInputField value={password.value} placeholder={password.placeholder} inputType='password' name='password'
                        onChangeHandler={(e: ChangeEvent<HTMLInputElement>) => setPassword({ ...password, value: e.target.value })} additionalStyles={`${redPasswordPlaceholder ? 'placeholder:text-[#ff6464]' : ''} mb-6`} />
                    <div className='flex flex-col gap-4 mt-3'>
                        {loader ? (
                            <Button type='button' additionalStyles='text-white bg-[#1b1b1b] cursor-default'>
                                <span className="btnLoader"></span>
                            </Button>
                        ) : (
                            <Button type='submit' additionalStyles='text-white bg-[#1b1b1b] hover:bg-[#6d9dc5] hover:text-[#1b1b1b]'>
                                Log In
                            </Button>
                        )}
                    </div>
                    <span className='items-center text-[#757575] flex text-xs gap-1 justify-center mt-4'>
                        Don't have an account?
                        <span className='text-[#1b1b1b] cursor-pointer underline' onClick={() => navigateToSignUp()}>
                            Create Account</span>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default SignIn