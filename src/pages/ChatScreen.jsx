import React, { useContext, useEffect, useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import TeamChannelList from "../components/ChatComponents/TeamChannelList";
import TeamChannelPreview from "../components/ChatComponents/TeamChannelPreview";
import { UserContext } from "../Contexts/UserContext";
import ChatContainer from "../components/ChatComponents/ChatContainer";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.scss";
import MessageChannelList from "../components/ChatComponents/MessageChannelList";
import AddChannelIcon from "../components/ChatComponents/AddChannelIcon";
import { useNavigate } from "react-router-dom";

const ChatScreen = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("team");
  const { setActiveChannel } = useChatContext();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;
  const navigate = useNavigate();

  useEffect(() => {
    setActiveChannel(null);
  }, []);

  const tabs = [
    { label: "Groups", value: "team" },
    { label: "DM's", value: "messaging" },
    { label: "Unread", value: "unread" },
  ];

  const filterFunctions = {
    team: (channels) =>
      channels.filter(
        (channel) => channel.type === "team" && channel.state.members[userId]
      ),
    messaging: (channels) =>
      channels.filter(
        (channel) =>
          channel.type === "messaging" && channel.state.members[userId]
      ),
    unread: (channels) =>
      channels.filter(
        (channel) => channel.countUnread() > 0 && channel.state.members[userId]
      ),
  };

  const renderChannelList = (type, filterFn) => (
    <ChannelList
      channelRenderFilterFn={filterFn}
      filters={{ members: { $in: [userId] }, ...(type && { type }) }}
      List={(listProps) => (
        <MessageChannelList
          {...listProps}
          type={type}
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
          type={type}
          setActiveChannel={setActiveChannel}
        />
      )}
    />
  );

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col bg-white h-full md:w-[300px] boder dark:bg-darkBackground2">
        <div className="flex w-full h-max items-center justify-between">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary dark:text-white">
              CHATS
            </h1>
          </div>

          <AddChannelIcon
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
            type={activeTab}
            onClick={() => navigate("/Chat/createChannel")}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 px-4 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`text-base font-semibold px-1 py-1 border dark:border-white rounded-lg transition ${
                activeTab === tab.value
                  ? "bg-primary dark:text-black text-white border-primary dark:bg-white "
                  : "text-primary border-primary hover:bg-primary dark:text-white hover:text-white dark:hover:bg-white dark:hover:text-black"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-auto md:w-[300px] border-r-[1px] dark:bg-darkBackground2">
          {activeTab !== "unread"
            ? renderChannelList(activeTab, filterFunctions[activeTab])
            : renderChannelList(null, filterFunctions.unread)}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-grow hidden md:flex bg-white w-[700px]">
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
