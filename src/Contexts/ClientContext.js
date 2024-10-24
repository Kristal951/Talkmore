import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

const ChatClientContext = createContext();

export const useChatClientContext = () => useContext(ChatClientContext);

export const ChatClientProvider = ({ children }) => {
    const [chatClient, setChatClient] = useState(null);
    const [isClientReady, setIsClientReady] = useState(false);
    const [error, setError] = useState(null);

    const initializeClient = async (userDetails) => {
        try {
            if (!userDetails || !userDetails.$id) {
                throw new Error('User ID is missing');
            }

            const apiKey = 'zd7jh347dvtn';
            const userId = userDetails.$id;

            // Fetch token for Stream Chat
            const tokenResponse = await axios.post('http://localhost:5000/stream/token', { userId });
            const token = tokenResponse.data.token;

            const client = StreamChat.getInstance(apiKey);
            
            // Connect the user to the client
            await client.connectUser(
                {
                    apiKey,
                    id: userDetails.$id 
                },
                token
            );

            setChatClient(client);
            setIsClientReady(true);

            return ()=> {
                if (client) {
                    client.disconnectUser()
                }
            }
        } catch (err) {
            console.error('Error initializing chat client:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        const payload = localStorage.getItem('appwritePayload');
        if (payload) {
            const user = JSON.parse(payload);
            initializeClient(user);
        } else {
            setError('User data not found');
        }
    }, []);

    return (
        <ChatClientContext.Provider value={{ chatClient, setChatClient, isClientReady, error }}>
            {children}
        </ChatClientContext.Provider>
    );
};
