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

        try {
            const apiKey = 'zd7jh347dvtn';
            const userID = userDetails.$id

            // Fetch token for Stream Video
            const { data: { token } } = await axios.post('http://localhost:5000/stream/token', { userID });

            const client = new StreamVideoClient({ apiKey, token, user: { id: userID } });
            await client.connectUser({ apiKey, id: userID }, token);

            setVideoClient(client);
            setIsClientReady(true);
        } catch (err) {
            console.error('Error initializing video client:', err);
            setError(err.message);
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
