import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [feedToken, setFeedToken] = useState(null);

  // Function to initiate the login process
  const login = () => {
    const apiKey = '7a5C23yx';  // Replace with your actual API key
    const stateVariable = 'stateVariable';  // This can be any value used to track state

    // Redirect to the SmartAPI login endpoint
    window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${apiKey}&state=${stateVariable}`;
  };

  // Function to handle login redirect and extract auth_token and feed_token
  const handleLoginRedirect = (authToken, feedToken) => {
    setAuthToken(authToken);
    setFeedToken(feedToken);

    // After storing tokens, fetch the user profile
    fetchUserProfile(authToken);
  };

  // Function to fetch user profile using auth_token
  const fetchUserProfile = async (authToken) => {
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
      setData(response.data);  
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Error fetching profile');
    }
  };

  // Function to refresh JWT token using refresh token
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

  // Check the URL for the auth_token and feed_token when the page loads
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authTokenFromURL = urlParams.get('auth_token');
    const feedTokenFromURL = urlParams.get('feed_token');

    // If tokens are available, process the login and fetch the profile
    if (authTokenFromURL && feedTokenFromURL) {
      handleLoginRedirect(authTokenFromURL, feedTokenFromURL);
    }
  }, []); // Run only once on component mount

  return (
    <div>
      {/* Display login button if tokens are not available */}
      {!authToken && !feedToken && (
        <button onClick={login}>Login with Angel</button>
      )}

      {/* If logged in, show user profile or error */}
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
