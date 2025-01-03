import { AvatarGroup } from '@chakra-ui/react';
import React from 'react';
import { Avatar, useChannelStateContext, useChatContext, useTypingContext } from 'stream-chat-react'; // Assuming this is the Avatar component you're using

const MessagingHeader = () => {
  // Ensure channel and client exist
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  const members = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID);
  const additionalMembers = members.length > 3 ? members.length - 3 : 0;

  if (channel.type === 'messaging') {
    return (
      <div className='h-max w-max'>
        {additionalMembers > 0 && (
          <p className='text-sm text-gray-600'>and {additionalMembers} more</p>
        )}
      </div>
    );
  }

  return null;
};

export default MessagingHeader;
