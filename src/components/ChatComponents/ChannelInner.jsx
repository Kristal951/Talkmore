import React, { useEffect, useRef, useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, renderText, PollCreationDialog, VirtualizedMessageList } from 'stream-chat-react';
import TeamChannelHeader from './TeamChannelHeader';
import './index.css'
import { AttachmentSelector, Channel, defaultAttachmentSelectorActionSet } from 'stream-chat-react';
import  {
  AttachmentSelectorAction,
  AttachmentSelectorActionProps,
  AttachmentSelectorModalContentProps,
} from 'stream-chat-react';


export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();

  const CustomMentionComponent = ({ children, node: { mentionedUser } }) => (
    <a data-user-id={mentionedUser.id} href={`/profile/${mentionedUser.id}`}>
      {children}
    </a>
  );

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList 
            renderText={(text, mentionedUsers) =>
              renderText(text, mentionedUsers, {
                customMarkDownRenderers: {mention: CustomMentionComponent },
              })}
              scrollToLatestMessageOnFocus
          />
          <MessageInput audioRecordingEnabled />
          {/* <AttachmentSelector/> */}
          {/* <PollCreationDialog/> */}
          
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

export default ChannelInner;
