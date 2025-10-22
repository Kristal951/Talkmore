import moment from "moment";
import React from "react";
import {
  useMessageContext,
  useChannelActionContext,
  useChatContext,
} from "stream-chat-react";

const CustomPinIndicator = () => {
  const { message } = useMessageContext("CustomPinIndicator");
  const { jumpToMessage } = useChannelActionContext();
  const { client } = useChatContext();

  const pinnedBy = message.pinned_by?.name || message.pinned_by?.id;
  if (!pinnedBy) return null;

  const handlePinClick = () => {
    if (message.id) {
      jumpToMessage(message.id);
    }
  };

  const formattedDate = message.pinned_at
    ? moment(message.pinned_at).format("MMM D, YYYY, h:mm A")
    : "Unknown date";

  // Determine the content to show in the pin
  let displayText = "Unsupported message type";

  if (message.text) {
    displayText = message.text;
  } else if (message.attachments?.length > 0) {
    const [attachment] = message.attachments;

    if (attachment.type === "image") {
      displayText = "📷 Image";
    } else if (attachment.type === "file") {
      displayText = `📎 File: ${attachment.title || attachment.name}`;
    } else if (attachment.type === "video") {
      displayText = "📹 Video";
    } else if (attachment.type === "voiceRecording") {
      displayText = `🎙️ Voice Recording`;
    } else {
      displayText = `🔗 Attachment: ${attachment.title || "Unnamed"}`;
    }
    
  } else if (message.poll.name) {
    displayText = "📊 Poll";
  } else if (message.type === "custom") {
    displayText = "🛠️ Custom Message";
  }

  return (
    <div
      className="w-full opacity-100 h-[60px] dark:text-white dark:bg-darkBackground bg-white shadow-md fixed top-[55px] right-0 left-[602px] z-40 flex items-center px-4 gap-4 border-l-4 border-primary cursor-pointer hover:bg-gray-100 transition"
      onClick={handlePinClick}
    >
      <div className="text-2xl">📌</div>
      <div className="flex flex-col">
        <p className="text-primary dark:text-white font-medium w-full truncate">
          {displayText}
        </p>
        <p className="text-sm text-green-400">
          Pinned by{" "}
          <span className="font-semibold">
            {message.pinned_by.id === client.userID
              ? `You at ${formattedDate}`
              : `${pinnedBy} at ${formattedDate}`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomPinIndicator;
