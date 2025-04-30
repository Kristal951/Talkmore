import React, { useState } from "react";
import {
  useChannelStateContext,
  useChatContext,
  useTypingContext,
} from "stream-chat-react";
import MessagingHeader from "./MessagingHeader";
import {
  Avatar,
  AvatarBadge,
  Divider,
  IconButton,
  Tooltip,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle, FaVideo, FaInfoCircle } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();
  const { typing } = useTypingContext();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const teamChannelImage = channel?.data?.image;
  const teamChannelName = channel?.data?.name || "Unnamed Channel";
  const members = Object.values(channel.state.members).filter(
    ({ user }) => user.id !== client.userID
  );
  const typingUsers = Object.values(typing).filter(
    ({ user }) => user.id !== client.userID
  );
  const userRole = channel?.state?.members[client.userID]?.role;
  console.log(userRole)

  const canTruncate = userRole === "owner" || userRole === "admin";

  const getWatcherText = (watchers) => {
    if (!watchers) return "No users online";
    if (watchers === 1) return "1 user online";
    return `${watchers} users online`;
  };

  const navigateTo = (route, state = {}) => navigate(route, { state });

  const truncateChannel = async () => {
    setLoading(true);
    try {
      await channel.truncate({
        skip_push: false,
        message: {
          text: "The channel has been truncated.",
          user_id: client.userID,
        },
      });

      toast({
        title: "Channel truncated successfully",
        description: "You have successfully truncated the channel.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error truncating channel:", error);
      toast({
        title: "Error truncating channel",
        description: "An error occurred while truncating the channel.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length > 0) {
      const names = typingUsers
        .map(({ user }) => user.name || "Anonymous User")
        .join(", ");
      return (
        <div className="typing-indicator ml-2 text-sm text-gray-500">
          {names} {typingUsers.length > 1 ? "are" : "is"} typing...
        </div>
      );
    }
    return null;
  };

  const renderAvatar = (user) => (
    <Avatar src={user.image} name={user.name} size="md">
      {user.online && <AvatarBadge boxSize="1.10em" bg="green.500" />}
    </Avatar>
  );

  const renderMemberInfo = () => (
    <div className="flex flex-row items-center p-2">
      {members[0]?.user?.image ? (
        renderAvatar(members[0]?.user)
      ) : (
        <FaUserCircle className="w-10 h-10" />
      )}
      <div className="flex flex-col">
        <h3
          className="ml-2 text-blue-600 text-xl cursor-pointer dark:text-white"
          onClick={() => navigateTo(`/Chat/${channel.id}/Info`)}
        >
          {members[0]?.user?.name || "Anonymous User"}
        </h3>
        {renderTypingIndicator()}
      </div>
    </div>
  );

  const renderTeamInfo = () => (
    <div className="flex flex-row items-center p-2 dark:bg-darkBackground2 border-0 w-full">
      {teamChannelImage ? (
        <img
          src={teamChannelImage}
          alt="Channel Avatar"
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <RiGroup2Fill className="w-10 h-10 text-primary" />
      )}
      <div className="flex flex-col">
        <h3
          className="ml-2 text-primary text-xl cursor-pointer dark:text-primary"
          onClick={() => navigateTo(`/Chat/${channel.id}/Info`)}
        >
          {teamChannelName}
        </h3>
        {renderTypingIndicator()}
      </div>
    </div>
  );

  return (
    <div className="h-[70px] w-full items-center flex-row relative shadow-md z-50 flex justify-start dark:bg-darkBackground2 bg-white">
      <div className="flex flex-1 items-center text-blue-600">
        {channel.type === "team" ? renderTeamInfo() : renderMemberInfo()}

        <div className="absolute right-10 flex space-x-2">
          <Tooltip label="Video Call" aria-label="Video Call">
            <IconButton
              icon={<FaVideo />}
              onClick={() =>
                navigate(`/VideoCall/${channel.id}`, {
                  state: {
                    videoCallMembers: members,
                    channelType: channel.type,
                  },
                })   
              }
              aria-label="Video Call"
              color="#41cc69"
            />
          </Tooltip>
          <Tooltip label="Audio Call" aria-label="Audio Call">
            <IconButton
              icon={<IoCall />}
              onClick={() =>
                navigateTo(`/AudioCall/${channel.id}`, {
                  videoCallMembers: members,
                  channelType: channel.type,
                })
              }
              aria-label="Audio Call"
              color="#41cc69"
            />
          </Tooltip>
          <Tooltip label="More Options" aria-label="More Options">
            <IconButton
              icon={<BsThreeDotsVertical />}
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="More Options"
              color="#41cc69"
            />
          </Tooltip>
        </div>
      </div>

      {showMenu && (
        <Box
          className="absolute top-[70px] right-28 bg-white shadow-lg p-2 rounded-md"
          onClick={() => setShowMenu(false)}
        >
          {canTruncate ? (
            <button
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={truncateChannel}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Truncate Channel"}
            </button>
          ) : (
            <p className="p-2 text-gray-500">You can not truncate this channel</p>
          )}
          <Divider />
        </Box>
      )}

      <MessagingHeader setIsEditing={setIsEditing} />

      {/* {channel.type === "team" && (
        <div className="absolute right-2">
          <p>{getWatcherText(watcher_count)}</p>
        </div>
      )} */}
    </div>
  );
};

export default TeamChannelHeader;
