import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [feedToken, setFeedToken] = useState(null);
  // const history = useHistory(); // For redirection after successful login


  // Function to initiate the login process (step 1)
  const login = async () => {
    const apiKey = '7a5C23yx';  // Replace with your actual API key
    const stateVariable = 'stateVariable';  // This can be any value used to track state

    window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${apiKey}&state=${stateVariable}`;
  };

  // Function to handle login response after redirection (step 1 continuation)
  const handleLoginRedirect = async (authToken, feedToken) => {
    // Save the tokens in state
    setAuthToken(authToken);
    setFeedToken(feedToken);

    // Now fetch the user profile (step 3)
    fetchUserProfile(authToken);
  };

  // Function to fetch user profile (step 3)
  const fetchUserProfile = async (authToken) => {
    console.log('Fetching profile...',authToken);
    const config = {
      method: 'get',
      url: 'https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    try {
      const response = await axios(config);
      console.log('Profile Response:', response.data);
      setData(response.data);  // Store profile data
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Error fetching profile');
    }
  };

  // Function to refresh JWT token (step 2)
  const refreshToken = async () => {
    const refreshToken = 'your_refresh_token';  // Replace with actual refresh token
    const config = {
      method: 'post',
      url: 'https://apiconnect.angelone.in/rest/auth/angelbroking/jwt/v1/generateTokens',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: JSON.stringify({ refreshToken }),
    };

    try {
      const response = await axios(config);
      console.log('New Tokens:', response.data);
      setAuthToken(response.data.auth_token);  // Set the new auth token
      setFeedToken(response.data.feed_token);  // Set the new feed token
    } catch (err) {
      console.error('Error refreshing token:', err);
      setError('Error refreshing token');
    }
  };

  // UseEffect to check for query params (this runs after redirect)
  useEffect(() => {
    // Assuming the redirected URL contains auth_token and feed_token as query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authTokenFromURL = urlParams.get('auth_token');
    const feedTokenFromURL = urlParams.get('feed_token');

    if (authTokenFromURL && feedTokenFromURL) {
      handleLoginRedirect(authTokenFromURL, feedTokenFromURL);  // Handle the login response (step 1 continuation)
    }
  }, []);

  return (
    <div>
      {!authToken && !feedToken && (
        <button onClick={login}>Login with Angel</button>
      )}

      {authToken && feedToken && (
        <div>
          <button onClick={refreshToken}>Refresh Token</button>
          <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {data ? (
              <div>
                <h2>User Profile</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            ) : (
              <div>Loading profile...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
