import React, { createContext, useContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";

const ChatClientContext = createContext();

export const useChatClientContext = () => useContext(ChatClientContext);

export const ChatClientProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [error, setError] = useState(null);

  const initializeClient = async (userDetails) => {
    try {
      if (!userDetails || !userDetails.$id) {
        throw new Error("User ID is missing");
      }

      const apiKey = "zd7jh347dvtn"; // Replace with your actual API key
      const userId = userDetails.$id;

      // Fetch token for Stream Chat
      const tokenResponse = await axios.post("http://localhost:5000/stream/token", { userId });
      const token = tokenResponse.data.token;

      // Create a new StreamChat instance
      const client = StreamChat.getInstance(apiKey);

      // Connect the user to the client
      await client.connectUser(
        {
          id: userId, // Pass user-specific details
          name: userDetails.name, // Include additional fields if available
          image: userDetails.imgUrl, // Optional: User avatar URL
        },
        token
      );

      setChatClient(client);
      setIsClientReady(true);
      
      return () => {
        if (client) {
          client.disconnectUser();
        }
      };
    } catch (err) {
      console.error("Error initializing chat client:", err);
      setError(err.response?.data?.message || "Failed to initialize chat client.");
    }
  };

  useEffect(() => {
    const payload = localStorage.getItem("appwritePayload");
    if (payload) {
      const user = JSON.parse(payload);
      initializeClient(user);
    } else {
      setError("User data not found in localStorage.");
    }

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, []); 

  return (
    <ChatClientContext.Provider value={{ chatClient, setChatClient, isClientReady, error }}>
      {children}
    </ChatClientContext.Provider>
  );
};
