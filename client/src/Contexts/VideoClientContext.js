import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const VideoClientContext = createContext();

export const useVideoClientContext = () => useContext(VideoClientContext);

export const VideoClientProvider = ({ children }) => {
  const [videoClient, setVideoClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [error, setError] = useState(null);

  const initializeClient = async (userDetails) => {
    if (!userDetails?.id) {
      setError('User ID is missing');
      return;
    }

    setIsClientReady(false);

    try {
      const apiKey = 'zd7jh347dvtn';
      const userId = userDetails.id;

      const tokenResponse = await axios.post('http://localhost:5000/stream/token', { userId });
      const token = tokenResponse.data.token;

      const client = StreamVideoClient.getOrCreateInstance({  apiKey,
        token,
        user: { id: userId } });

      await client.connectUser(
        {
          id: userId,
          name: userDetails.name,
          image: userDetails.imgURL,
        },
        token
      );

      setVideoClient(client);
      setIsClientReady(true);
    } catch (err) {
      console.error('Error initializing video client:', err);
      setError('Failed to initialize video client. Please try again later.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('JWT token not found');
      return;
    }

    try {
      const payload = jwtDecode(token);
      if (payload && payload.id) {
        initializeClient(payload);
      } else {
        setError('Invalid user payload');
      }
    } catch (err) {
      console.error('JWT decode error:', err);
      setError('Failed to decode JWT token');
    }

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VideoClientContext.Provider value={{ videoClient, isClientReady, error }}>
      {children}
    </VideoClientContext.Provider>
  );
};
