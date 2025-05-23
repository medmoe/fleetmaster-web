import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API} from "@/constants/endpoints";
import useAuthStore from "../../store/useAuthStore";

export const useLoginPage = () => {
    const {setAuthResponse} = useAuthStore()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [loginFormData, setLoginFormData] = useState({username: "", password: ""})
    const [error, setError] = useState({isError: false, message: ""})

    const handleLoginFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setLoginFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const submitLoginForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const response = await axios.post(`${API}accounts/login/`, loginFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            setAuthResponse(response.data)
            navigate("/dashboard");
        } catch (error) {
            console.log(error)
            setError({isError: true, message: "No account found with the provided credentials. Please try again."})
        } finally {
            setIsLoading(false)
        }
    }

    const verifyToken = async () => {
        setIsLoading(true)
        try {
            await axios.get(`${API}accounts/refresh/`, {withCredentials: true})
            navigate("/dashboard");
        } catch (error) {
            console.warn("verify token error")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        error,
        isLoading,
        loginFormData,
        setError,
        verifyToken,
        handleLoginFormChange,
        submitLoginForm,
    }
}