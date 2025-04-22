import React from 'react';
import FacebookLogin, {SuccessResponse} from '@greatsumini/react-facebook-login';
import {API} from "@/constants/endpoints.ts";
import {useNavigate} from "react-router-dom";
import useAuthStore from '@/store/useAuthStore';

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
            const apiResponse = await fetch(BACKEND_FACEBOOK_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // dj-rest-auth typically expects the token like this
                body: JSON.stringify({access_token: accessToken}),
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                console.error('Backend login failed:', errorData);
                // Handle error display to user (e.g., "Login failed, please try again.")
                throw new Error(`Backend login failed with status: ${apiResponse.status}`);
            }

            const data = await apiResponse.json();
            console.log('Backend Login Response:', data);

            setAuthResponse(data)
            navigate('/dashboard');
        } catch (error) {
            console.error('Error sending Facebook token to backend:', error);
            // Handle error display to user
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
            scope={'public_profile,email'}
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
