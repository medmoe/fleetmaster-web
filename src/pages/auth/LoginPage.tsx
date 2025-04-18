import {useEffect} from "react";
import {useLoginPage} from "@/hooks/auth/useLoginPage";
import {CircularProgress, Alert} from "@mui/material";
import {Link} from 'react-router-dom'

const LoginPage = () => {
    const {isLoading, loginFormData, handleLoginFormChange, submitLoginForm, verifyToken, error, setError} = useLoginPage();
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
                    <h1 className="text-2xl font-bold text-center text-txt">Login</h1>
                    <form className="space-y-6" onSubmit={submitLoginForm}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                                Username:
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
                                Password:
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
                            Login
                        </button>
                    </form>
                    <div className="text-sm text-center text-default">
                        Don't have an account? <Link to={"/register"} className="text-secondary-500 hover:underline">Register</Link>
                    </div>
                </div>
            }
        </div>
    )
};

export default LoginPage;
4