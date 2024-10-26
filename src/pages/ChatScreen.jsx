import React, { useContext, useEffect, useState } from 'react';
import { ChannelList, Chat } from 'stream-chat-react';
import { Spinner } from '@chakra-ui/react';
import TeamChannelList from '../components/ChatComponents/TeamChannelList';
import TeamChannelPreview from '../components/ChatComponents/TeamChannelPreview';
import { UserContext } from '../Contexts/UserContext';
import 'stream-chat-react/dist/css/v2/index.css'; 
import './index.css'
import ChatContainer from '../components/ChatComponents/ChatContainer';

const ChatScreen = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('team');  // Track which tab (team or messaging) is active

    const { userDetails } = useContext(UserContext);

    return (
            <div className="flex flex-row w-full h-screen">
                <div className="flex w-full flex-col flex-1 h-screen bg-white">
                    {/* Tabs to switch between team channels and direct messages */}
                    {/* <div className="flex-row gap-2 flex w-full h-10 mt-2 mb-4 ">
                        <button
                            className={`w-[45%] text-blue-600 hover:bg-[#4b5563] hover:bg-opacity-15 rounded-md p-[3px] ${activeTab === 'team' ? 'bg-[#4b5563] bg-opacity-15 rounded-md' : 'border-b-[1px]'}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Groups
                        </button>
                        <button
                            className={`w-[48%] text-blue-600 hover:bg-[#4b5563] hover:bg-opacity-15 rounded-md  p-[3px] ${activeTab === 'messaging' ? 'bg-[#4b5563] bg-opacity-15 rounded-md' : 'border-b-[1px]'}`}
                            onClick={() => setActiveTab('messaging')}
                        >
                            Direct Messages
                        </button>
                    </div> */}

                    <ChannelList
                        filters={{ members: { $in: [userDetails.id] }, type: "team" }}  // Dynamic filtering based on activeTab
                        List={(listProps) => (
                            <TeamChannelList
                                {...listProps}
                                type="team" 
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                createType={createType}
                                setCreateType={setCreateType}
                            />
                        )}
                        Preview={(previewProps) => (
                            <TeamChannelPreview
                                {...previewProps}
                                type="team"  
                            />
                        )}
                    />
                    <ChannelList
                        filters={{ members: { $in: [userDetails.id] }, type: "messaging" }}  // Dynamic filtering based on activeTab
                        List={(listProps) => (
                            <TeamChannelList
                                {...listProps}
                                type="messaging" 
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                createType={createType}
                                setCreateType={setCreateType}
                            />
                        )}
                        Preview={(previewProps) => (
                            <TeamChannelPreview
                                {...previewProps}
                                type="messaging"  // Pass the active tab type to the preview
                            />
                        )}
                    />
                </div>
                <div className="flex chatContainer w-[70%] h-screen bg-white">
                    <ChatContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        createType={createType}
                    />
                </div>
            </div>
    );
};

export default ChatScreen;
