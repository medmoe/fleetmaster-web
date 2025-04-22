import React from 'react';
import FacebookLogin, {SuccessResponse} from '@greatsumini/react-facebook-login';
import {API} from "@/constants/endpoints.ts";
import {useNavigate} from "react-router-dom";
import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';

const BACKEND_FACEBOOK_LOGIN_URL = `${API}accounts/dj-rest-auth/facebook/`;
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

const FacebookAuthButton = () => {
    const navigate = useNavigate();
    const {setAuthResponse} = useAuthStore()
    const handleFacebookLoginSuccess = async (response: SuccessResponse) => {
        console.log('Facebook Login Success:', response);
        // The key piece of information is the accessToken
        const accessToken = response.accessToken;

        if (!accessToken) {
            console.error('Facebook login failed: No access token received.');
            // Handle error display to user
            return;
        }

        // Send the accessToken to your Django backend
        try {
            const apiResponse = await axios.post(BACKEND_FACEBOOK_LOGIN_URL, {access_token: accessToken}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, withCredentials: true
            })


            setAuthResponse(apiResponse.data)
            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Backend login failed:', error.response?.data);
                // Handle error display to user (e.g., "Login failed, please try again.")
                throw new Error(`Backend login failed with status: ${error.response?.status}`);
            } else {
                console.error('Unexpected error:', error);
                throw error;
            }

        }
    };

    const handleFacebookLoginFail = (error: any) => {
        console.error('Facebook Login Failed:', error);
        // Handle error display to user (e.g., "Facebook login was cancelled or failed.")
    };

    return (
        <FacebookLogin
            appId={facebookAppId}
            onSuccess={handleFacebookLoginSuccess}
            onFail={handleFacebookLoginFail}
            scope={'public_profile'}
            // Optional: Custom rendering for the button
            // render={({ onClick, logout }) => (
            //   <button onClick={onClick}>Login with Facebook</button>
            // )}
            style={{
                backgroundColor: '#4267b2',
                color: '#fff',
                fontSize: '16px',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        />
    );
};

export default FacebookAuthButton;
