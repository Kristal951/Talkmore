import React from 'react';
import { Avatar, MessageSimple, Tooltip, useMessageContext } from 'stream-chat-react';
import { FaCheckDouble } from 'react-icons/fa';

const CustomMessageRenderer = (props) => {
  const {lastReadUser } = useMessageContext();

  const CustomDeliveredStatus = () => (
    <div className="message-status">
      <Tooltip content="Delivered">
        <FaCheckDouble color="blue" size={16} />
      </Tooltip>
    </div>
  );

  const CustomReadStatus = () => (
    <div className="message-status">
      {lastReadUser ? (
        <Tooltip content={`Read by ${lastReadUser.name}`}>
          <Avatar image={lastReadUser.image} name={lastReadUser.name} size={20} />
        </Tooltip>
      ) : (
        <Tooltip content="Read">
          <FaCheckDouble color="green" size={16} />
        </Tooltip>
      )}
    </div>
  );

  return (
    <MessageSimple
      {...props}
      MessageStatus={{
        MessageDeliveredStatus: CustomDeliveredStatus,
        MessageReadStatus: CustomReadStatus,
      }}
    />
  );
};

export default CustomMessageRenderer;
