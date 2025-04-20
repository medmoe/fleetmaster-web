import {useEffect} from "react";
import {useLoginPage} from "@/hooks/auth/useLoginPage";
import {Alert, CircularProgress} from "@mui/material";
import {Link} from 'react-router-dom'
import {LanguageSwitcher} from "@/components";
import {useTranslation} from "react-i18next";

const LoginPage = () => {
    const {isLoading, loginFormData, handleLoginFormChange, submitLoginForm, verifyToken, error, setError} = useLoginPage();
    const {t} = useTranslation();
    useEffect(() => {
        verifyToken();
    }, [])
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            {isLoading ? <CircularProgress color="primary" size={200} thickness={5}/> :
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
                    {error.isError && (
                        <Alert severity="error"
                               onClose={() => setError({isError: false, message: ''})}
                        >{error.message}</Alert>
                    )}
                    <LanguageSwitcher/>
                    <h1 className="text-2xl font-bold text-center text-txt">{t('auth.login.title')}</h1>
                    <form className="space-y-6" onSubmit={submitLoginForm}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                                {t('auth.login.username')}
                            </label>
                            <input
                                type="username"
                                value={loginFormData.username}
                                onChange={handleLoginFormChange}
                                id="username"
                                name="username"
                                required
                                className="w-full px-4 py-2 mt-1 text-txt border rounded focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                {t('auth.login.password')}
                            </label>
                            <input
                                type="password"
                                value={loginFormData.password}
                                onChange={handleLoginFormChange}
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 mt-1 text-txt border rounded focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            {t('auth.login.loginButton')}
                        </button>
                    </form>
                    <div className="text-sm text-center text-default">
                        {t('auth.login.noAccount')} <Link to={"/register"}
                                                          className="text-secondary-500 hover:underline">{t('auth.login.register')}</Link>
                    </div>
                </div>
            }
        </div>
    )
};

export default LoginPage;