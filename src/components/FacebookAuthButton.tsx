import React from 'react';
import FacebookLogin, {SuccessResponse } from '@greatsumini/react-facebook-login';

// Define your backend endpoint URL
// This usually comes from dj-rest-auth or a similar library integrating with allauth
// Common patterns are /rest-auth/facebook/ or /api/auth/facebook/
// CHECK YOUR project's urls.py to confirm the exact path!
const BACKEND_FACEBOOK_LOGIN_URL = 'https://api.fleetmasters.net/auth/facebook/'; // <-- VERIFY THIS URL
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

const FacebookAuthButton = () => {

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
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Backend login failed:', errorData);
        // Handle error display to user (e.g., "Login failed, please try again.")
        throw new Error(`Backend login failed with status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log('Backend Login Response:', data);

      // --- Handle Successful Backend Login ---
      // 1. Store Tokens: Securely store the access and refresh tokens
      //    (e.g., in localStorage, sessionStorage, or manage via HttpOnly cookies if backend sets them)
      localStorage.setItem('access_token', data.access_token); // Or data.access if using simplejwt directly
      localStorage.setItem('refresh_token', data.refresh_token); // Or data.refresh

      // 2. Update Auth State: Use your state management (Context API, Redux, Zustand, etc.)
      //    to set the user as logged in and store user details (data.user)
      //    Example: authContext.login(data.user, data.access_token);

      // 3. Redirect (Optional): Navigate the user to their dashboard or home page
      //    Example: navigate('/dashboard');

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
      appId={facebookAppId} // Use environment variable or replace directly
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
