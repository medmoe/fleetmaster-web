import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {SignUpFormData} from "@/types/types";
import axios from "axios";
import {API} from "@/constants/endpoints";


export const useSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [error, setError] = useState({
        isError: false,
        message: ''
    });

    // Form state
    const [formData, setFormData] = useState<SignUpFormData>({
        user: {
            username: '',
            email: '',
            password: '',
        },
        phone: '',
        confirmPassword: ''
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        // Handle nested properties in the user object
        if (name.startsWith('user.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                user: {
                    ...formData.user,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.user.password !== formData.confirmPassword) {
            setError({
                isError: true,
                message: 'Passwords do not match'
            })
            return;
        }
        setLoading(true);
        try {
            // Simulate API call
            const response = await axios.post(`${API}accounts/signup/`, formData, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            console.log('Registration successful:', response.data);
            // Redirect to login page on success
            navigate('/');
        } catch (err) {
            console.error('Registration failed:', err);
            setError({
                isError: true,
                message: axios.isAxiosError(err) && err.response?.data?.detail
                    ? err.response.data.detail
                    : 'Unknown error occurred'
            })
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        showAddressFields,
        showPassword,
        showConfirmPassword,
        formData,
        handleChange,
        handleSubmit,
        setShowAddressFields,
        setShowPassword,
        setShowConfirmPassword,
    }
}