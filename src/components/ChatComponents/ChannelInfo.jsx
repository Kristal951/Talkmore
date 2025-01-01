import React, { useContext, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserContext } from "../../Contexts/UserContext";
import { Avatar, AvatarBadge, IconButton, useToast } from "@chakra-ui/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { RiGroup2Fill } from "react-icons/ri";
import { GoBellSlash } from "react-icons/go";
import { CiBellOn } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

const MemberItem = ({ user, currentUserId, onRemove, userDetails }) => {
  const { client } = useChatContext();
  return (
    <li className="flex items-center gap-4 p-2 border-b border-gray-200">
      <Link to={`/profile/${user.id}`}>
        <Avatar src={user?.image || ""} name={user?.name || "User"} size="md">
          {user.online && <AvatarBadge boxSize="1.25em" bg="green.500" />}
        </Avatar>
      </Link>
      <div className="flex flex-row justify-between items-center w-full">
        {user.id === currentUserId ? (
          <span className="font-medium">You</span>
        ) : (
          <Link to={`/profile/${user.id}`}>
            <span className="font-medium">{user.name || user.id}</span>
          </Link>
        )}
        {currentUserId === client.user.id && (user.role !== "owner" || user.role !== "admin") && (
            <IconButton
              icon={<MdOutlinePersonRemoveAlt1 className="w-[80%] h-[80%]" />}
              size="md"
              aria-label="remove member"
              onClick={() => onRemove(user)}
            />
          )}

        <span
          className={`text-sm p-1 rounded-md ${
            user.role === "owner"
              ? "border-blue-600 border-[1px]"
              : "bg-gray-500 bg-opacity-20"
          }`}
        >
          {user.role === "owner" ? "creator" : "member"}
        </span>
      </div>
    </li>
  );
};

const ChannelInfo = () => {
  const { channel } = useChatContext();
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  const muted = channel?.muteStatus()?.muted || false;

  const [members, setMembers] = useState(
    Object.values(channel?.state?.members || {}).map(({ user, role }) => ({
      ...user,
      role,
    }))
  );

  const formattedDate = channel?.data?.created_at
    ? moment(channel.data.created_at).format("MMM D, YYYY, h:mm A")
    : "Unknown date";

  const handleMuteChannel = async () => {
    try {
      if (muted) {
        await channel.unmute();
        toast({
          title: "Channel unmuted",
          description: "You will now receive notifications.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await channel.mute();
        toast({
          title: "Channel muted",
          description: "Notifications have been silenced.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error muting/unmuting channel",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleRemoveMember = async (user) => {
    try {
      // Remove the member from the channel
      await channel.removeMembers([user.id]);

      // Send a message to the channel about the removal
      const removerName = userDetails.name || userDetails.id; // Name of the remover
      const removedName = user.name || user.id; // Name of the removed user

      await channel.sendMessage({
        text:
          user.id === userDetails.id
            ? `${removerName} removed you from the group.`
            : `${removerName} removed ${removedName} from the group.`,
        user: { id: userDetails.id },
      });

      // Update the members list in the UI
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== user.id)
      );

      // Show a success toast
      toast({
        title: "Member removed",
        description: `${removedName} was successfully removed by ${removerName}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      // Handle errors and show an error toast
      toast({
        title: "Error removing member",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const leaveMessage = {
        text: `${userDetails.name || userDetails.id} has left the group.`,
        user: { id: userDetails.id },
      };
      await channel.removeMembers([userDetails.id]);
      await channel.sendMessage(leaveMessage);
      navigate("/Chat");
    } catch (error) {
      toast({
        title: "Error leaving group",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-y-scroll">
      <div className="flex absolute top-4 left-4">
        <IconButton
          aria-label="back"
          icon={<IoMdArrowRoundBack />}
          onClick={() => navigate(-1)}
        />
      </div>
      {channel?.type === "team" ? (
        <>
          <div className="flex w-full h-max items-center flex-col p-4 justify-center">
            <div className="flex w-[100px] h-[100px] rounded-full cursor-pointer hover:scale-105">
              {channel?.data?.image ? (
                <img
                  src={channel.data.image}
                  alt="channel pic"
                  className="w-full h-full rounded-full "
                />
              ) : (
                <RiGroup2Fill className="w-full h-full rounded-full text-blue-600" />
              )}
            </div>
            <p className="font-bold text-xl p-2">
              {channel?.data?.name || "Unknown Channel"}
            </p>
            {channel?.data?.created_by && (
              <p className="text-gray-400">
                Created by{" "}
                <span className="text-[15px] text-black dark:text-white">
                  {channel.data.created_by.name || "Unknown"}
                </span>
              </p>
            )}
            <p className="text-gray-400">
              Created at{" "}
              <span className="text-[15px] text-black dark:text-white">{formattedDate}</span>
            </p>
          </div>

          <div className="flex w-full h-max p-2 items-center justify-center">
            <div
              className="flex p-3 border-blue-600 border-[1px] w-[80px] h-[70px] rounded-md cursor-pointer"
              onClick={handleMuteChannel}
            >
              {muted ? (
                <CiBellOn className="w-full h-full text-blue-600" />
              ) : (
                <GoBellSlash className="w-full h-full text-blue-600" />
              )}
            </div>
          </div>

          <div className="flex flex-col p-2">
            <h2 className="text-2xl font-bold p-2">Members</h2>
            <div className="flex flex-col">
              <ul className="w-4/5 gap-4 flex flex-col">
                {members.map((user) => (
                  <MemberItem
                    key={user.id}
                    user={user}
                    currentUserId={userDetails.id}
                    onRemove={handleRemoveMember}
                    userDetails={userDetails}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p>Coming Up</p>
        </div>
      )}
    </div>
  );
};

export default ChannelInfo;
