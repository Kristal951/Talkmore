import React, { useEffect } from "react";
import ChannelInner from "./ChannelInner";
import CreateChannel from "./CreateChannel";
import EditChannel from "./EditChannel";
import EmptyChannelState from "../PostComponents/EmptyChannelState";
import { Channel, useChatContext } from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";
import CustomMessageRenderer from "./CustomMessageRenderer";
import CustomPinIndicator from "./CustomPinIndicator";
import { useColorMode } from "@chakra-ui/react";

const ChatContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  const { channel, setActiveChannel } = useChatContext();

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

  return (
    <div className="w-full h-screen">
      <Channel
        EmptyStateIndicator={EmptyChannelState}
        EmojiPicker={EmojiPicker}
        Message={CustomMessageRenderer}
        theme="str-chat__theme-dark"
        channel={channel}
        PinIndicator={CustomPinIndicator}
        // Message={(messageProps)=> <CustomMessageRenderer {...messageProps}/>}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChatContainer;
