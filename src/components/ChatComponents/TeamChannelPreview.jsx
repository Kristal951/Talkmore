import React from "react";
import { useChatContext } from "stream-chat-react";
import { RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import useUserStatus from "../../hooks/useUserStatus";
import moment from "moment";

const TeamChannelPreview = ({ channel, type, setActiveChannel }) => {
  const { channel: activeChannel, client } = useChatContext();
  const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
  const userID = members[0]?.user?.id || null;
  const isOnline = useUserStatus(userID);

  if (!members.length) return null;

  const lastActive = members[0]?.user?.last_active;
  const currentTime = moment();
  const givenTime = moment(lastActive);
  const hoursDiff = currentTime.diff(givenTime, "hours");

  let lastSeen = "Active now";
  if (!isOnline) {
    if (hoursDiff >= 24) {
      lastSeen = `${currentTime.diff(givenTime, "days")} day(s) ago`;
    } else if (hoursDiff >= 1) {
      lastSeen = `${hoursDiff} hour(s) ago`;
    } else {
      lastSeen = `${currentTime.diff(givenTime, "minutes")} minute(s) ago`;
    }
  }

  const isActive = channel.id === activeChannel?.id;
  const channelImage = channel.data.image;

  const handleClick = () => {
    setActiveChannel(channel); // Directly set the active channel
  };

  const TeamPreview = () => (
    <div
      className={`flex items-center space-x-3 px-3 py-2 w-full ${
        isActive ? "bg-gray-100 border-l-2 border-blue-600 dark:bg-darkBackground2" : ""
      } hover:bg-darkBackground2`}
    >
      {channelImage ? (
        <img src={channelImage} alt="Channel Avatar" className="w-10 h-10 rounded-full" />
      ) : (
        <RiGroup2Fill size={40} className={`${isActive ? "text-blue-600" : "text-gray-600"}`} />
      )}
      <div className="flex flex-col">
        <p className="font-semibold truncate">{channel?.data?.name || "Unnamed Channel"}</p>
        {channel.state.unreadCount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {channel.state.unreadCount}
          </span>
        )}
      </div>
    </div>
  );

  const DirectPreview = () => (
    <div
      className={`flex items-center space-x-3 px-3 py-2 w-full ${
        isActive ? "bg-gray-100 border-l-2 border-blue-600 dark:bg-darkBackground2" : ""
      }  hover:bg-darkBackground2`}
    >
      {members[0]?.user?.image ? (
        <Avatar src={members[0]?.user?.image} size="md">
          {isOnline && <AvatarBadge boxSize="1.1em" bg="green.500" />}
        </Avatar>
      ) : (
        <FaUserCircle className="w-10 h-10 text-gray-600" />
      )}
      <div className="flex flex-col">
        <p className="font-semibold truncate">{members[0]?.user?.name || "Anonymous User"}</p>
        {!isOnline && <p className="text-sm text-gray-500">{lastSeen}</p>}
        {channel.state.unreadCount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {channel.state.unreadCount}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`flex w-full cursor-pointer hover:bg-gray-100 rounded-md ${isActive ? "bg-gray-200" : ""}`}
      onClick={handleClick}
    >
      {type === "team" ? <TeamPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
