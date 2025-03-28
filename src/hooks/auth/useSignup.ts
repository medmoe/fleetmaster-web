// src/hooks/useSignup.ts
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiClient from "../../api/axiosConfig.ts";

export type SignupFormState = {
    user: {
        firstname?: string;
        lastname?: string;
        username: string;
        email: string;
        password: string;
    },
    phone?: string,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    zip_code?: string,
}

export const useSignup = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<SignupFormState>({
        user: {
            username: "",
            email: "",
            password: "",
        }
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (name: string, value: string) => {
        setFormState((prevState) => {
            if (name in prevState.user) {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        [name]: value,
                    }
                };
            } else {
                return {
                    ...prevState,
                    [name]: value,
                };
            }
        });
    };

    const updateConfirmPassword = (value: string) => {
        setConfirmPassword(value);
    };

    const submitForm = async () => {
        setError(null);
        setLoading(true);

        try {
            // Validate password
            if (formState.user.password !== confirmPassword) {
                setError("Passwords don't match");
                setLoading(false);
                return;
            }

            // Validate email
            if (!validateEmail(formState.user.email)) {
                setError("Invalid email address");
                setLoading(false);
                return;
            }


            // Make API call
            const response = await apiClient.post('signup/', formState);
            console.log(response);
            // Navigate to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        formState,
        confirmPassword,
        loading,
        error,
        handleChange,
        updateConfirmPassword,
        submitForm
    };
};