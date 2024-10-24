import React from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import MessagingHeader from './MessagingHeader';
import { RiGroup2Fill } from 'react-icons/ri';
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarBadge } from '@chakra-ui/react';

const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();

    const TeamchannelImage = channel?.data?.image;
    const TeamchannelName = channel?.data?.name || 'Unnamed Channel';
    const members = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID);
    const additionalMembers = members.length > 2 ? members.length - 2 : 0;

    const getWatcherText = (watchers) => {
        if (!watchers) return 'No users online';
        if (watchers === 1) return '1 user online';
        return `${watchers} users online`;
    };

    return (
        <div className='h-[70px] w-full items-center flex-row relative shadow-md z-50 flex justify-start'>
            <div className="flex flex-row h-max w-max justify-start items-center text-blue-600">
                {channel.type === 'team' ? (
                    <div className="flex flex-row items-center">
                        {TeamchannelImage ? (
                            <img 
                              src={TeamchannelImage} 
                              alt="Channel Avatar" 
                              className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <RiGroup2Fill className='w-10 h-10' />
                        )}
                        <h3 className="ml-2 text-blue-600 text-xl">
                            {TeamchannelName}
                        </h3>
                        {additionalMembers > 0 && (
                            <p className='ml-2 text-sm text-gray-600'>
                                + {additionalMembers} more
                            </p>
                        )}
                    </div>
                ) : (
                  <div className="flex flex-row items-center">
                        {members[0]?.user?.image ? (
                            <Avatar 
                              src={members[0]?.user?.image} 
                              name={members[0]?.user?.name} 
                              className="w-10 h-10 ml-2 rounded-full"
                            >
                                {
                                    members[0]?.user?.online === "true" &&(
                                        <AvatarBadge boxSize='1.10em' bg='green.500' />
                                    )
                                }
                            </Avatar>
                        ) : (
                            <FaUserCircle className='w-10 h-10' />
                        )}
                        <h3 className="ml-2 text-blue-600 text-xl">
                            {members[0]?.user?.name || 'Anonymous User'}
                        </h3>
                    </div>
                )}
            </div>

            {/* MessagingHeader component for additional controls or actions */}
            <MessagingHeader setIsEditing={setIsEditing} />

            <div className='absolute right-2'>
                <p className='team-channel-header__right-text'>
                    {getWatcherText(watcher_count)}
                </p>
            </div>
        </div>
    );
};

export default TeamChannelHeader;
