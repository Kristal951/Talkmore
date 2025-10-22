import React, { createContext, useState } from "react";

export const ChatUIContext = createContext();

export const ChatUIProvider = ({ children }) => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ChatUIContext.Provider
      value={{
        createType,
        setCreateType,
        isCreating,
        setIsCreating,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
};
