import React, { createContext, useContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ChatClientContext = createContext();

export const useChatClientContext = () => useContext(ChatClientContext);

export const ChatClientProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [error, setError] = useState(null);

  const initializeClient = async (userDetails) => {
    console.log(userDetails);

    try {
      if (!userDetails || !userDetails.id) {
        throw new Error("User ID is missing");
      }

      const apiKey = "zd7jh347dvtn"; 
      const userId = userDetails.id;

      const tokenResponse = await axios.post("http://localhost:5000/stream/token", { userId });
      const token = tokenResponse.data.token;

      const client = StreamChat.getInstance(apiKey);

      await client.connectUser(
        {
          id: userDetails.id, 
          name: userDetails.name, 
          image: userDetails.imgUrl, 
        },
        token
      );

      setChatClient(client);
      setIsClientReady(true);
    } catch (err) {
      console.error("Error initializing chat client:", err);
      setError(err.response?.data?.message || "Failed to initialize chat client.");
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = jwtDecode(token);
          console.log(payload);
          const user = payload;
          await initializeClient(user);
        } else {
          setError("User data not found in localStorage.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    initializeUser();

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
