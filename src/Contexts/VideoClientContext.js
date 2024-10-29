import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import axios from 'axios';

const VideoClientContext = createContext();

export const useVideoClientContext = () => useContext(VideoClientContext);

export const VideoClientProvider = ({ children }) => {
    const [videoClient, setVideoClient] = useState(null);
    const [isClientReady, setIsClientReady] = useState(false);
    const [error, setError] = useState(null);

    const initializeClient = async (userDetails) => {
        if (!userDetails?.$id) {
            setError('User details or user ID is missing');
            return;
        }
        setIsClientReady(false);

        try {
            const apiKey = 'zd7jh347dvtn';
            const userId = userDetails.$id;

            const tokenResponse = await axios.post('http://localhost:5000/stream/token', { userId });
            const token = tokenResponse.data.token;
            console.log(token);

            const client = StreamVideoClient.getOrCreateInstance({
                apiKey,
                token,
                user: { id: userId }
            });

            await client.connectUser({ apiKey, id: userId }, token);

            setVideoClient(client);
            setIsClientReady(true);
        } catch (err) {
            console.error('Error initializing video client:', err);
            setError('Failed to initialize video client. Please try again later.');
        }
    };

    useEffect(() => {
        const storedPayload = localStorage.getItem('appwritePayload');
        if (storedPayload) {
            const userDetails = JSON.parse(storedPayload);
            initializeClient(userDetails);
        } else {
            setError('User data not found');
        }

        return () => {
            if (videoClient) {
                videoClient.disconnectUser();
            }
        };
    }, []);

    return (
        <VideoClientContext.Provider value={{ videoClient, isClientReady, error }}>
            {children}
        </VideoClientContext.Provider>
    );
};
