import React from 'react';
import { useChatContext } from 'stream-chat-react';
import { RiGroup2Fill } from "react-icons/ri";
import moment from 'moment';
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarBadge } from '@chakra-ui/react';
import useUserStatus from '../../hooks/useUserStatus';

const TeamChannelPreview = ({ channel, type }) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext();
  const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
  const userID = members[0]?.user?.id || null;
  const isOnline = useUserStatus(userID);

  if (!members.length) return null;

  const lastActive = members[0]?.user?.last_active;
  const currentTime = moment();
  const givenTime = moment(lastActive);
  const hoursDiff = currentTime.diff(givenTime, 'hours');

  let lastSeen = '';
  if (hoursDiff >= 1 && hoursDiff < 24) {
    lastSeen = `${hoursDiff} hour(s) ago`;
  } else if (hoursDiff < 1) {
    lastSeen = `${currentTime.diff(givenTime, 'minutes')} minute(s) ago`;
  } else {
    lastSeen = `${currentTime.diff(givenTime, 'days')} day(s) ago`;
  }

  const isActive = channel.id === activeChannel?.id;
  const channelImage = channel.data.image;

  const TeamPreview = () => (
    <div className={`w-full flex flex-row items-center relative space-x-2 h-[60px] px-2 ${isActive ? 'text-blue-600 border-l-[2px] border-blue-600' : 'text-blue-600'}`}>
        {channelImage ? (
          <img src={channelImage} alt="Channel Avatar" className="w-10 h-10 rounded-full" />
        ) : (
          <RiGroup2Fill size={40} className={isActive ? 'bg-opacity-15' : 'text-blue-600'} />
        )}
        <div className="flex flex-col">
          <p className={`font-bold truncate ${isActive ? 'text-blue-600' : 'text-blue-600'}`}>
            {channel?.data?.name || 'Unnamed Channel'}
          </p>
          {channel.state.unreadCount > 0 && (
              <div className="flex absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 items-center justify-center">
                {channel.state.unreadCount}
              </div>
            )
          }
      </div>
      
    </div>
  );

  const DirectPreview = () => (
    <div className={`w-full flex flex-row items-center relative space-x-2 h-[60px] px-2 ${isActive ? 'text-blue-600 border-l-[2px] border-blue-600' : 'text-blue-600'}`}>
      {members[0]?.user?.image ? (
        <Avatar src={members[0]?.user?.image} className="w-10 h-10 ml-2 rounded-full">
          {isOnline && <AvatarBadge boxSize='1.10em' bg='green.500' />}
        </Avatar>
      ) : (
        <FaUserCircle className='w-10 h-10' />
      )}
      <div className="flex flex-col">
        <p className={`font-bold truncate ${isActive ? 'text-blue-600' : 'text-blue-600'}`}>
          {members[0]?.user?.name || 'Anonymous User'}
        </p>
        {!isOnline && <p>{lastSeen}</p>}
        {channel.state.unreadCount > 0 && (
          <div className="flex absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 items-center justify-center">
            {channel.state.unreadCount}
          </div>
        )}
      </div>
    </div>
  );

  const handleClick = () => {
    if (setActiveChannel) setActiveChannel(channel);
  };

  return (
    <div 
      className={`${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''} flex justify-start w-[98%] text-blue-600 rounded-md cursor-pointer hover:bg-gray-200`} 
      onClick={handleClick}
    >
      {type === 'team' ? <TeamPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
