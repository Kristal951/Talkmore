import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { Spinner, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');  // Initialize email as an empty string
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate()

    const LoginUser = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast({
                title: 'Invalid Input',
                description: 'Email and password are required.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:5000/user/Login', { email, password });
            const { user, jwtToken } = response.data

            localStorage.setItem('token', JSON.stringify(jwtToken));
            localStorage.setItem('appwritePayload', JSON.stringify(user));

            navigate('/')

            return toast({
                title: 'Login Successful',
                description: 'You have successfully logged in.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            setLoading(false)
            const errorMessage = error.response?.data?.message || 'Login failed, please try again.';
            return toast({
                title: 'Login Unsuccessful',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="flex w-full h-screen bg-black justify-center items-center">
            <div className="form-container w-[40%] h-max flex-col p-8 bg-white justify-center rounded-lg items-center flex">
                <div className="flex w-full justify-center items-center h-max p-4 pb-8">
                    <h2 className="text-xl font-bold">Login To Your Account</h2>
                </div>
                <form onSubmit={LoginUser} className="flex flex-col gap-8 items-center justify-center w-full h-full">
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full border-black border-[1px] p-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-required="true"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border-black border-[1px] p-2 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                    />
                    <button
                        type="submit"
                        className={loading ? 'w-full cursor-not-allowed bg-black h-[50px] hover:bg-transparent hover:text-black hover:border-black hover:border-[1px] rounded-lg text-white' : 'w-full bg-black h-[50px] hover:bg-transparent hover:text-black hover:border-black hover:border-[1px] cursor-pointer rounded-lg text-white'}
                        disabled={loading ? true : false}
                    >
                        {
                            loading ? <Spinner size="md"/> : <p>Login</p>
                        }
                    </button>
                </form>

                <p className='p-4'>Dont have an account, <Link to='/SignUp' className='underline cursor-pointer text-blue-600'> SignUp here.</Link></p>
            </div>
        </div>
    );
};

export default Login;
