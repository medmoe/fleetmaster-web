// src/pages/SignupPage.tsx
import React from 'react';
import {Link} from 'react-router-dom';
import {useSignup} from '../../hooks/auth/useSignup.ts';

const SignUp: React.FC = () => {
    const {
        formState,
        confirmPassword,
        loading,
        error,
        handleChange,
        updateConfirmPassword,
        submitForm
    } = useSignup();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                {loading ? (
                    <div className="w-full flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-center text-txt">
                            Welcome to Fleet Master
                        </h1>

                        <div className="mt-4">
                            <p className="text-txt text-center">Start managing your fleet with ease</p>
                            <p className="text-txt text-center">Sign up now to keep track of your fleet and stay organized</p>
                        </div>

                        {error && (
                            <div className="w-full mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <form className="mt-6 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formState.user.firstname || ''}
                                        placeholder="Your first name"
                                        onChange={(e) => handleChange('firstname', e.target.value)}
                                        className="bg-white w-full p-4 border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formState.user.lastname || ''}
                                        placeholder="Your last name"
                                        onChange={(e) => handleChange('lastname', e.target.value)}
                                        className="bg-white w-full p-4 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <input
                                    type="text"
                                    name="username"
                                    value={formState.user.username}
                                    placeholder="Your username"
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    className="bg-white w-full p-4 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mt-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={formState.user.email}
                                    placeholder="Your email"
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="bg-white w-full p-4 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mt-4">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formState.phone || ''}
                                    placeholder="Your phone number"
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="bg-white w-full p-4 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mt-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={formState.user.password}
                                    placeholder="Your password"
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="bg-white w-full p-4 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mt-4">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Re-enter password"
                                    onChange={(e) => updateConfirmPassword(e.target.value)}
                                    className="bg-white w-full p-4 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="mt-4">
                                <p className="text-txt">
                                    By continuing you agree to Fleet Master's
                                    <span className="text-secondary-500"> Terms of service </span> and
                                    <span className="text-secondary-500"> privacy policy</span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={submitForm}
                                className="w-full mt-6 bg-primary-500 p-4 rounded text-white font-semibold text-base"
                            >
                                Continue
                            </button>

                            <div className="mt-6 text-center">
                                <p>
                                    Already registered? <Link to="/" className="text-secondary-500">Sign in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUp;