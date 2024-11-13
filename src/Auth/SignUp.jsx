import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { useToast, Spinner } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const userPayload = {
        name,
        tag,
        email,
        phoneNumber,
        password,
    };

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !tag || !password || !email || !phoneNumber) {
            toast({
                title: 'Fill in all fields',
                description: 'Please make sure to fill in all required fields.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        if (password && !confirmPassword) {
            toast({
                title: 'Confirm password',
                description: 'Please make sure to confirm your password.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Password mismatch',
                description: 'Please make sure your password matches.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        setLoading(true);
        
        try {
            const res = await axios.post('http://localhost:5000/user/SignUp', { userPayload });

            if (res.status === 201) {
                toast({
                    title: 'Account created',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });

                const { createdUser, appwritePayload, jwtToken } = res.data;
                localStorage.setItem('streamPayload', JSON.stringify(createdUser));
                localStorage.setItem('appwritePayload', JSON.stringify(appwritePayload));
                localStorage.setItem('token', jwtToken);

                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error creating account',
                description: error.response?.data?.message || 'An error occurred. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-screen bg-black justify-center items-center">
            <div className="form-container w-[40%] h-[76%] p-8 bg-white flex-col justify-center rounded-lg items-center flex">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center justify-center w-full h-full">
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        className="w-full border-black border-[1px] p-2 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        aria-required="true"
                    />
                    <input
                        type="tel"
                        placeholder="Your Phone Number"
                        className="w-full border-black border-[1px] p-2 rounded-md"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        aria-required="true"
                    />
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
                        type="text"
                        placeholder="Your Tag"
                        className="w-full border-black border-[1px] p-2 rounded-md"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        required
                        aria-required="true"
                    />
                    <div className="flex flex-row w-full gap-4">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-[50%] border-black border-[1px] p-2 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-required="true"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-[50%] border-black border-[1px] p-2 rounded-md"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-required="true"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black h-[50px] hover:bg-transparent hover:text-black hover:border-black hover:border-[1px] cursor-pointer rounded-lg text-white flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? <Spinner size="md" /> : 'Submit'}
                    </button>
                </form>
                <p>Already have an account, <Link to='/Login' className='underline cursor-pointer text-blue-600'> Login here.</Link></p>
            </div>
        </div>
    );
};

export default SignUp;
