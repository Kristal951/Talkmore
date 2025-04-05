import React from "react";
import { useChatContext } from "stream-chat-react";
import { RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import useUserStatus from "../../hooks/useUserStatus";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const TeamChannelPreview = ({ channel, type, setActiveChannel }) => {
  const { channel: activeChannel, client } = useChatContext();
  const members = Object.values(channel.state.members).filter(
    ({ user }) => user.id !== client.userID
  );
  const { cid } = useParams();
  // const [types, id] = cid?.split(":");
  // console.log(types, id)
  const userID = members[0]?.user?.id || null;
  const isOnline = useUserStatus(userID);
  const navigate = useNavigate()

  const latestMessage = channel.state.messages?.slice(-1)[0] || null;
  const latestMessageText = latestMessage?.text || " ";
  const latestMessageAt = latestMessage?.created_at || null;
  const formattedDate = latestMessageAt
    ? moment(latestMessageAt).format("hh:mm A")
    : "";

  const isActive = channel.id === activeChannel?.id;
  const channelImage = channel.data.image;

  const handleClick = () => {
    setActiveChannel(channel); 
    // navigate(`/chat/channel/${channel.cid}`)
  };

  const TeamPreview = () => (
    <div
      className={`flex items-center space-x-2 px-2 py-2 w-full ${
        isActive
          ? "bg-gray-200 border-l-2 border-primary dark:border-white dark:bg-darkBackground2"
          : ""
      } dark:hover:bg-darkBackground2 hover:bg-gray-200`}
    >
      {channelImage ? (
        <img
          src={channelImage}
          alt="Channel Avatar"
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <RiGroup2Fill
          size={40}
          className={`${isActive ? "text-blue-600" : "text-gray-600"}`}
        />
      )}
      <div className="flex flex-row justify-between flex-1">
        <div className="flex flex-col">
          <p className="font-semibold truncate">
            {channel?.data?.name || "Unnamed Channel"}
          </p>
          <p className="text-sm text-gray-500 truncate w-[180px]">{latestMessageText}</p>
        </div>
        <div className="flex">
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </div>
  );

  const DirectPreview = () => (
    <div
      className={`flex items-center space-x-2 px-3 py-2 w-full ${
        isActive
          ? "bg-gray-200 border-l-2 border-primary dark:border-white dark:bg-darkBackground2"
          : ""
      } dark:hover:bg-darkBackground2 hover:bg-gray-200`}
    >
      {members[0]?.user?.image ? (
        <Avatar src={members[0]?.user?.image} size="md">
          {isOnline && <AvatarBadge boxSize="1.1em" bg="green.500" />}
        </Avatar>
      ) : (
        <FaUserCircle className="w-10 h-10 text-gray-600" />
      )}

      <div className="flex flex-row justify-between flex-1">
        <div className="flex flex-col">
          <p className="font-semibold truncate">
          {members[0]?.user?.name || "Anonymous User"}
          </p>
          <p className="text-sm text-gray-500 truncate flex-1">{latestMessageText}</p>
        </div>
        <div className="flex">
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flex w-full  cursor-pointer hover:bg-darkBackground rounded-md ${
        isActive ? "bg-gray-200" : ""
      }`}
      onClick={handleClick}
    >
      {type === "team" ? <TeamPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
