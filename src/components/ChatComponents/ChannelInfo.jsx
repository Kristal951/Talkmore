import { Avatar } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserContext } from '../../Contexts/UserContext';
import moment from 'moment';
import { FaRegTrashAlt } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { RiGroup2Fill } from "react-icons/ri";

const ChannelInfo = () => {
    const { channel } = useChatContext();
    const { userDetails } = useContext(UserContext);
    const navigate = useNavigate()

    const members = Object.values(channel?.state.members).filter(({ user }) => user);
    const memberUsers = members.map(({ user, role }) => ({ ...user, role }));

    // Format creation date and time using moment
    const formattedDate = channel.data.created_at 
        ? moment(channel.data.created_at).format('MMM D, YYYY, h:mm A') 
        : 'Unknown date';

        const handleDeleteChannel = async () => {
            try {
                await channel.delete({ hard: true });
                console.log("Channel deleted successfully");
                navigate('/Chat')
            } catch (error) {
                console.error("Error deleting channel:", error);
            }
        };

        const handleLeaveGroup = async () => {
            try {
                const leaveMessage = {
                    text: `${userDetails.name || userDetails.id} has left the group.`,
                    user: { id: userDetails.id },
                };
                await channel.removeMembers([userDetails.id],);
                await channel.sendMessage(leaveMessage);

                console.log("You have left the group successfully.");
                navigate('/Chat')
            } catch (error) {
                console.error("Error leaving the group:", error);
            }
        };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex w-full h-max items-center flex-col p-4 justify-center">
                <div className="flex w-[100px] h-[100px] rounded-full cursor-pointer hover:scale-105">
                    {
                        channel.data.image ? (
                            <img
                                src={channel.data.image}
                                alt="channel pic"
                                className="w-full h-full rounded-full "
                            />
                        ) : (
                            <RiGroup2Fill
                                className="w-full h-full rounded-full text-blue-600"
                            />
                        )
                    }
                </div>
                <p className="font-bold text-xl p-2">{channel.data.name}</p>
                {channel.data.created_by && (
                    <p className='text-gray-400'>Created by <span className='text-[15px] text-black'>{channel.data.created_by.name}</span></p>
                )}
                <p className='text-gray-400'>Created at <span className='text-[15px] text-black'>{formattedDate}</span></p>
            </div>

            <div className="flex flex-col p-2">
                <h2 className="text-2xl font-bold p-2">Members</h2>

                <div className="flex flex-col">
                    <ul className="w-4/5 gap-4 flex flex-col">
                        {memberUsers.map((user) => (
                            <li key={user.id} className="flex items-center gap-4 p-2 border-b border-gray-200">
                                <Link
                                    to={`/profile/${user.id}`}
                                >
                                    <Avatar src={user.image} name={user.name} size="sm" />
                                </Link>
                                
                                <div className="flex flex-row justify-between items-center w-full">
                                    {user.id === userDetails.id ? (
                                        <span className="font-medium">You</span>
                                    ) : (
                                        <Link
                                            to={`/profile/${user.id}`}
                                        >
                                            <span className="font-medium">
                                                {user.name || user.id}
                                            </span>
                                        </Link>
                                        
                                    )}
                                    {user.role === 'owner' ? (
                                        <span className="text-sm border-blue-600 border-[1px] p-1 rounded-md">
                                            creator
                                        </span>
                                    ) : (
                                        <span className="text-sm bg-gray-500 bg-opacity-20 p-1 rounded-md">
                                            member
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex w-4/5 p-4 flex-col">
                    {
                        userDetails.id === channel.data.created_by.id && (
                            <button onClick={handleDeleteChannel} className='w-full p-4 hover:bg-gray-200 rounded-md flex items-center justify-start flex-row gap-2 font-bold text-red-600'>
                                <FaRegTrashAlt
                                    className='font-bold'
                                />
                                 Delete Group
                            </button>
                        )
                    }
                
                    <button onClick={handleLeaveGroup} className='w-full p-4 rounded-md hover:bg-gray-200 flex items-center justify-start flex-row gap-2 font-bold text-red-600'>
                        <RxExit
                            className='font-bold'
                        />
                        Exit Group
                    </button>
            </div>
        </div>
    );
};

export default ChannelInfo;
