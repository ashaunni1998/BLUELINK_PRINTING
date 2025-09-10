import React, { useState } from 'react';

import LoadingSmall from '../../commonElements/LoadingSmall';
import LoginHead from '../components/LoginHead';
import Input from '../components/Input';

import { LOGIN_API } from '../../apiServices/logInApi';
import { LOGIN_VALIDATION } from './loginValidation';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {logIn } from '../../redux/slices/userSlice'
import { toast } from 'react-toastify';


function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState({
        emailError: '',
        passwordError: ''
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError({ emailError: '', passwordError: '' });

        const isValid = LOGIN_VALIDATION(loginData, setError);

        if (isValid) {
            handleLogin();
        } else {
            // console.log('Validation failed');
        }
    };


    const dispatch = useDispatch();
    const handleLogin = async () => {
        setIsLoading(true);

        try {
            const res = await LOGIN_API(loginData);
            // console.log('Login successful:', res.adminData);
            toast.success(res.message)
            dispatch(logIn({ type: 'LOGIN_SUCCESS', payload:res.adminData }));
            navigate('/admin/');

        } catch (error) {
            const message = error.response?.data?.message;

            if (message === 'Admin account not found with this email') {
                setError((prev) => ({ ...prev, emailError: message }));
            } else if (message === 'Incorrect password. Please check and try again.') {
                setError((prev) => ({ ...prev, passwordError: message }));
            } else {
                console.log('An unexpected error occurred:', message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setLoginData({ ...loginData, email: e.target.value });
        setError({ emailError: '', passwordError: '' });
    };

    const handlePasswordChange = (e) => {
        setLoginData({ ...loginData, password: e.target.value });
        setError({ emailError: '', passwordError: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-sm shadow-2xl border border-white/20 p-8">
                    <form onSubmit={handleSubmit}>
                        <LoginHead />
                        <div className="space-y-6">
                            <Input
                                type="email"
                                placeholder="Enter Admin email"
                                value={loginData.email}
                                onChange={handleEmailChange}
                                error={error.emailError}
                            />

                            <Input
                                type="password"
                                placeholder="Enter Admin password"
                                value={loginData.password}
                                onChange={handlePasswordChange}
                                error={error.passwordError}
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-10 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSmall />
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
