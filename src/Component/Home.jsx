import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [feedToken, setFeedToken] = useState(null);

  // Function to initiate login
  const login = () => {
    const apiKey = '7a5C23yx'; // Replace with your API key
    const stateVariable = 'stateVariable'; // State variable for redirection tracking
    window.location.href = `https://smartapi.angelone.in/publisher-login?api_key=${apiKey}&state=${stateVariable}`;
  };

  // Function to handle login redirect
  const handleLoginRedirect = (authToken, feedToken) => {
    setAuthToken(authToken);
    setFeedToken(feedToken);

    // Fetch user profile after obtaining tokens
    fetchUserProfile(authToken);
  };

  // Function to fetch user profile
  const fetchUserProfile = async (authToken) => {
    console.log('Using Auth Token for profile:', authToken);
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
      console.error(
        'Error Fetching Profile:',
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message || 'Error fetching profile. Check the logs.'
      );
    }
  };

  // Function to refresh JWT token
  const refreshToken = async () => {
    const refreshToken = 'your_refresh_token'; // Replace with the actual refresh token
    console.log('Refreshing token...');
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
      setAuthToken(response.data.auth_token); // Update with the new auth token
      setFeedToken(response.data.feed_token); // Update with the new feed token
    } catch (err) {
      console.error(
        'Error Refreshing Token:',
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message || 'Error refreshing token. Check the logs.'
      );
    }
  };

  // Handle login redirect and extract tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authTokenFromURL = urlParams.get('auth_token');
    const feedTokenFromURL = urlParams.get('feed_token');

    if (authTokenFromURL && feedTokenFromURL) {
      handleLoginRedirect(authTokenFromURL, feedTokenFromURL);
    }
  }, []);

  return (
    <div>
      {/* Display login button if tokens are not available */}
      {!authToken && !feedToken && (
        <button onClick={login}>Login with Angel</button>
      )}

      {/* Display profile and refresh token button if tokens are available */}
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
