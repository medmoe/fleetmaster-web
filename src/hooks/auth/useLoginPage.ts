import React, {useState} from "react";
import apiClient from "../../api/axiosConfig.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const useLoginPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [loginFormData, setLoginFormData] = useState({username: "", password: ""})

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
            const response = await axios.post('http://0.0.0.0:8000/accounts/login/', loginFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            console.log(response)
            navigate("/dashboard");
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const verifyToken = async () => {
        setIsLoading(true)
        try {
            const response = await apiClient.get('/accounts/refresh/')
            if (response.status === 200) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        loginFormData,
        verifyToken,
        handleLoginFormChange,
        submitLoginForm,
    }
}