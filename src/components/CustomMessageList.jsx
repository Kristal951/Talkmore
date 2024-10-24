import React from 'react';
import CustomAudioPlayer from './AudioComponent';
import { MessageList, MessageTeam } from 'stream-chat-react';

const CustomMessageRenderer = (props) => {
  const { message } = props;

  // Check if the message contains an audio attachment
  const audioAttachment = message?.attachments?.find(attachment => attachment.type === 'audio');

  return (
    <div className="message-item">
      {/* Render regular text message */}
      <CustomMessageRenderer {...props} />

      {/* Render custom audio player if audio message is available */}
      {audioAttachment && (
        <div className="audio-message">
          <CustomAudioPlayer src={audioAttachment.asset_url} />
        </div>
      )}
    </div>
  );
};

const CustomMessageList = () => {
  return (
    <MessageList 
      Message={CustomMessageRenderer} 
    />
  );
};

export default CustomMessageList;
