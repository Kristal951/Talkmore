import React from 'react';
import { Attachment, Avatar, useMessageContext } from 'stream-chat-react';

const CustomMessageRenderer = (messageProps) => {
  const { message } = useMessageContext();
  // console.log(message);

  const hasAttachments = message.attachments && message.attachments.length > 0;
  // Extract different types of attachments
  const audioAttachment = message.attachments?.find(attachment => attachment.type === 'audio');
  const imageAttachment = message.attachments?.find(attachment => attachment.type === 'image');
  const videoAttachment = message.attachments?.find(attachment => attachment.type === 'video');

  return (
    <div {...messageProps} className="custom-message-renderer">
      <Avatar image={message.user.image} name={message.user.name} size={40} />
      {/*  */}
      <div className="message-content">
        {/* Render text if no attachments */}
        {(!audioAttachment && !imageAttachment && !videoAttachment) && (
          <p>{message.text}</p>
        )}

        {/* Render each attachment type conditionally */}
        {/* {imageAttachment && (
          <Attachment attachments={[imageAttachment]} />
        )} */}
        
        {/* {videoAttachment && (
          <Attachment attachments={[videoAttachment]} />
        )} */}
        
        {hasAttachments && (
          <Attachment attachments={message.attachments}/>
        )}
      </div>
    </div>
  );
};

export default CustomMessageRenderer;
