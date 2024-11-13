import React from 'react';
import { useChannelStateContext, useChatContext, useTypingContext } from 'stream-chat-react';
import MessagingHeader from './MessagingHeader';
import { RiGroup2Fill } from 'react-icons/ri';
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarBadge } from '@chakra-ui/react';
import { FaVideo } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle } from "react-icons/fa";

const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();
    const { typing } = useTypingContext(); // Import typing context
    const navigate = useNavigate();

    const TeamchannelImage = channel?.data?.image;
    const TeamchannelName = channel?.data?.name || 'Unnamed Channel';
    const members = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID);
    const videoCallMembers = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID);
    const additionalMembers = members.length > 2 ? members.length - 2 : 0;
    const channelType = channel.type;
    // const membernames = Object.values(channel.state.members).filter(({user}) => user.name);
    const memberNames = Object.values(channel.state.members).map(({ user }) => user.name); 
    const memberNamegt4 = memberNames.length > 4

    console.log(memberNames);

    const getWatcherText = (watchers) => {
        if (!watchers) return 'No users online';
        if (watchers === 1) return '1 user online';
        return `${watchers} users online`;
    };

    const navigateToVideoCallScreen = () => {
        const callID = channel.id;
        navigate(`/VideoCall/${callID}`, { state: { videoCallMembers, channelType } });
    };
    const navigateToAudioCallScreen = () => {
        const callID = channel.id;
        navigate(`/AudioCall/${callID}`, { state: { videoCallMembers, channelType } });
    };
    const navigateToChannelInfoScreen = () => {
        const channelID = channel.id;
        navigate(`/Chat/${channelID}/Info`);
    };

    const typingUsers = Object.values(typing).filter(({ user }) => user.id !== client.userID);
    const typingIndicator = typingUsers.length > 0 ? (
        <div className="typing-indicator ml-2 text-sm text-gray-500">
            {channel.type === 'team' 
                ? `${typingUsers.map(({ user }) => user.name || 'Anonymous User').join(', ')} is typing...`
                : 'Typing...'
            }
        </div>
    ) : null;
    

    return (
        <div className='h-[70px] w-full items-center flex-row relative shadow-md z-50 flex justify-start'>
            <div className="flex flex-row h-max flex-1 justify-start items-center text-blue-600">
                {channel.type === 'team' ? (
                    <div className="flex flex-row items-center p-2">
                        {TeamchannelImage ? (
                            <img 
                              src={TeamchannelImage} 
                              alt="Channel Avatar" 
                              className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <RiGroup2Fill className='w-10 h-10' />
                        )}
                        <div className="flex flex-col h-full w-max">
                            <h3 
                                className="ml-2 text-blue-600 text-xl cursor-pointer"
                                onClick={navigateToChannelInfoScreen}
                            >
                                {TeamchannelName}
                            </h3>
                            {typingIndicator} 
                        </div>
                        
                        <div className="flex h-full w-max ml-2 items-center justify-center cursor-pointer">
                            <FaInfoCircle
                                onClick={navigateToChannelInfoScreen}
                            />
                        </div>
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
                                    members[0]?.user?.online === true && (
                                        <AvatarBadge boxSize='1.10em' bg='green.500' />
                                    )
                                }
                            </Avatar>
                        ) : (
                            <FaUserCircle className='w-10 h-10' />
                        )}
                        <div className="flex flex-col">
                            <h3 className="ml-2 text-blue-600 text-xl">
                                {members[0]?.user?.name || 'Anonymous User'}
                            </h3>
                            {typingIndicator}
                        </div>
                    </div>
                )}
                <div className={ channel.type === 'team' ? "flex w-max h-max absolute right-28" : "flex w-max h-max absolute right-4"}>
                    <div className="flex w-[40px] h-[40px] rounded-full p-2 hover:bg-gray-400 hover:bg-opacity-20 cursor-pointer">
                        <FaVideo 
                            className='w-full h-full'
                            onClick={navigateToVideoCallScreen}
                        />
                    </div>
                    <div className="flex w-[40px] h-[40px] rounded-full p-2 hover:bg-gray-400 hover:bg-opacity-20 cursor-pointer">
                        <IoCall 
                            className='w-full h-full'
                            onClick={navigateToAudioCallScreen}
                        />
                    </div>
                </div>
            </div>

            <MessagingHeader setIsEditing={setIsEditing} />
            {
                channel.type === 'team' && (
                    <div className='absolute right-2'>
                        <p className='team-channel-header__right-text'>
                            {getWatcherText(watcher_count)}
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default TeamChannelHeader;
