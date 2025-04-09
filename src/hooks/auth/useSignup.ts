import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {SignUpFormData} from "../../types/types.ts";
import axios from "axios";
import {API} from "../../constants/endpoints.ts";


export const useSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [error, setError] = useState('');

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

    // Form errors state
    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        'user.username': '',
        'user.email': '',
        phone: '',
        'user.password': '',
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
        // Clear error when user starts typing again
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    // Validate individual field
    const validateField = (name: string, value: string) => {
        let error = '';

        switch (name) {
            case 'user.username':
                if (!value.trim()) {
                    error = 'Username is required';
                }
                break;
            case 'user.email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email is invalid';
                }
                break;
            case 'phone':
                if (value && !/^\+?[1-9]\d{9,14}$/.test(value)) {
                    error = 'Phone number is invalid';
                }
                break;
            case 'user.password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters';
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== formData.user.password) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        return error;
    };

    // Handle blur event to validate field
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const error = validateField(name, value);

        setFormErrors({
            ...formErrors,
            [name]: error
        });
    };

    // Validate entire form
    const validateForm = () => {
        const errors: Record<string, string> = {};
        let isValid = true;

        // Validate user fields (nested)
        Object.entries(formData.user).forEach(([key, value]) => {
            const fieldError = validateField(`user.${key}`, value);
            if (fieldError) {
                isValid = false;
                errors[`user.${key}`] = fieldError;
            }
        });

        // Validate top-level fields
        ['phone', 'confirmPassword'].forEach(field => {
            const fieldError = validateField(field, field === 'phone' ? formData.phone : formData.confirmPassword);
            if (fieldError) {
                isValid = false;
                errors[field] = fieldError;
            }
        })
        setFormErrors(errors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

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
            setError('Registration failed. Please try again later.');
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
        formErrors,
        handleChange,
        handleBlur,
        handleSubmit,
        setShowAddressFields,
        setShowPassword,
        setShowConfirmPassword,
    }
}