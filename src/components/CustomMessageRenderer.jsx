import React from 'react';
import { Avatar, useMessageContext } from 'stream-chat-react';
import CustomAudioPlayer from './CustomAudioPlayer'; // Custom audio player component

const CustomMessageRenderer = () => {
  const { message, handleOpenThread } = useMessageContext();

  // Extract different types of attachments
  const audioAttachment = message.attachments?.find(attachment => attachment.type === 'audio');
  const imageAttachment = message.attachments?.find(attachment => attachment.type === 'image');
  const videoAttachment = message.attachments?.find(attachment => attachment.type === 'video');

  return (
    <div className="message-item p-4 flex">
      <Avatar
        image={message.user.image}
        name={message.user.name || message.user.id}
        size={40}
        className="mr-2"
      />

      <div className="message-content">
        {/* Message author */}
        <div className="message-author font-bold text-sm">
          {message.user.name || message.user.id}
        </div>

        {/* Message text */}
        <div className="message-text text-base">
          {message.text}
        </div>

        {/* Render custom audio player if there's an audio message */}
        {audioAttachment && (
          <div className="audio-message my-2">
            <CustomAudioPlayer src={audioAttachment.asset_url} />
          </div>
        )}

        {/* Render image if there's an image attachment */}
        {imageAttachment && (
          <div className="image-message my-2">
            <img
              src={imageAttachment.image_url}
              alt={imageAttachment.fallback || 'Image'}
              className="rounded-md max-w-sm"
            />
          </div>
        )}

        {/* Render video player if there's a video attachment */}
        {videoAttachment && (
          <div className="video-message my-2">
            <video
              controls
              className="max-w-sm rounded-md"
            >
              <source src={videoAttachment.asset_url} type={videoAttachment.mime_type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Option to open thread */}
        <button
          onClick={handleOpenThread}
          className="text-blue-600 text-xs mt-1"
        >
          Reply in thread
        </button>
      </div>
    </div>
  );
};

export default CustomMessageRenderer;
