import React, { useEffect, useRef, useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, renderText, PollCreationDialog, VirtualizedMessageList } from 'stream-chat-react';
import TeamChannelHeader from './TeamChannelHeader';
import './index.css'

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);

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
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

export default ChannelInner;
