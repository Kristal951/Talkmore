import React, { useEffect } from "react";
import AddChannelIcon from "./AddChannelIcon";
import "./index.css";
import { useChatContext } from "stream-chat-react";

const MessageChannelList = ({
  children,
  error,
  loading,
  type,
  isCreating,
  setCreateType,
  setIsCreating,
  setIsEditing,
}) => {
  if (error) {
    return type === "team" ? (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-red-600">
          Connection error, please wait and try again later.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-blue-600 dark:text-white">
          {type === "team" ? "Channels" : "Messages"} are loading...
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex-col flex">
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default MessageChannelList;
