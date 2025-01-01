import React from "react";
import { useMessageContext, useChannelActionContext } from "stream-chat-react";

const CustomPinIndicator = () => {
  const { message } = useMessageContext("CustomPinIndicator");
  const { jumpToMessage } = useChannelActionContext();

  const pinnedBy = message.pinned_by?.name || message.pinned_by?.id;

  if (!pinnedBy) return null;

  const handlePinClick = () => {
    if (message.id) {
      jumpToMessage(message.id); // Navigates to the full message in the message list
    }
  };

  return (
    <div
      className="w-full opacity-100 h-[60px] dark:text-white dark:bg-darkBackground bg-white shadow-lg fixed top-[55px] right-0 left-[23rem] z-40 flex items-center px-4 gap-4 border-l-4 border-blue-500 cursor-pointer hover:bg-gray-100 transition"
      onClick={handlePinClick}
    >
      <div className="text-blue-500 text-2xl">📌</div>
      <div className="flex flex-col">
        <p className="text-gray-800 dark:text-white font-medium w-full">
          {message.text || "No message text available"}
        </p>
        <p className="text-sm text-gray-500">
          Pinned by <span className="font-semibold">{pinnedBy}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomPinIndicator;
