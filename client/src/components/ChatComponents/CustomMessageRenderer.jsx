import React from "react";
import { Avatar, MessageSimple, Tooltip, useMessageContext } from "stream-chat-react";
import { FaCheckDouble } from "react-icons/fa";

// Custom status component for delivered messages
const CustomDeliveredStatus = () => (
  <div className="message-status">
    <Tooltip content="Delivered">
      <FaCheckDouble color="green" size={16} />
    </Tooltip>
  </div>
);
// Custom status component for read messages
const CustomReadStatus = ({ message }) => (
  <div className="message-status">
    {message.readBy && message.readBy.length > 0 ? (
      <Tooltip content={`Read by ${message.readBy[0].name}`}>
        <Avatar image={message.readBy[0].image} name={message.readBy[0].name} size={20} />
      </Tooltip>
    ) : (
      <Tooltip content="Read">
        <FaCheckDouble color="green" size={16} />
      </Tooltip>
    )}
  </div>
);

// Custom forwarded message renderer
const ForwardedMessage = ({ message }) => (
  <div className="forwarded-message">
    <p><strong>Forwarded from:</strong> {message.user.name}</p>
    {message.text && <p>{message.text}</p>}
  </div>
);

const CustomMessageRenderer = (props) => {
  const { message } = useMessageContext();
  console.log(message)

  // Check if the message is a forwarded type
  const isForwarded = message.isForwarded === true

  return (
    <MessageSimple
      {...props}
      MessageStatus={{
        MessageDeliveredStatus: CustomDeliveredStatus,
        MessageReadStatus: (message) => <CustomReadStatus message={message} />,
      }}
    >
      {/* Render forwarded message if it is a forwarded type */}
      {isForwarded && <ForwardedMessage message={message} />}
    </MessageSimple>
  );
};

export default CustomMessageRenderer;
