import React, { useEffect } from "react";
import ChannelInner from "./ChannelInner";
import CreateChannel from "./CreateChannel";
import EditChannel from "./EditChannel";
import EmptyChannelState from "../PostComponents/EmptyChannelState";
import { Channel, useChatContext } from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";
import CustomMessageRenderer from "./CustomMessageRenderer";
import CustomPinIndicator from "./CustomPinIndicator";

const ChatContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  const { channel } = useChatContext();

  if (isCreating) {
    return (
      <div className="flex w-full h-screen">
        <CreateChannel setIsCreating={setIsCreating} createType={createType} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex w-full h-screen">
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-lg dark:bg-darkBackground2">
        <p className="text-primary font-extrabold">Please select a channel to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <Channel
        EmptyStateIndicator={EmptyChannelState}
        EmojiPicker={EmojiPicker}
        Message={CustomMessageRenderer}
        PinIndicator={CustomPinIndicator}
        theme="str-chat__theme-dark"
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChatContainer;
