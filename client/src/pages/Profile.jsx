import React, { useContext, useEffect, useState, useMemo } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Avatar,
  AvatarBadge,
  Spinner,
  IconButton,
  useToast,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import Talkmore from "../assets/images/comp2.png";
import { useNavigate, useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdPersonAddAlt1, MdBlock } from "react-icons/md";
import { addFriendToDB, getUserPosts } from "../lib/AppriteFunction";
import UserPostCard from "../components/PostComponents/UserPostCard";
import useUserStatus from "../hooks/useUserStatus";
import { UserContext } from "../Contexts/UserContext";
import ProfileMenu from "../components/others/ProfileMenu";

const Profile = () => {
  const { userId } = useParams();
  const { client } = useChatContext();
  const [streamUser, setStreamUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { userDetails } = useContext(UserContext);
  const isOnline = useUserStatus(userId);
  const navigate = useNavigate();
  const toast = useToast();
  const [isBioExpanded, setIsBioExpanded] = useState(false); // State for bio expansion

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await client.queryUsers(
          { id: { $eq: userId } },
          { limit: 1 }
        );
        setStreamUser(res.users[0]);
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoadingUserPosts(true);
        const posts = await getUserPosts(userId);
        setUserPosts(posts);
      } catch (err) {
        setError("Failed to load posts.");
      } finally {
        setLoadingUserPosts(false);
      }
    };

    if (userId) {
      fetchData();
      fetchPosts();
    }
  }, [client, userId]);

  const toggleBlockUser = async () => {
    try {
      if (isBlocked) {
        await client.unBlockUser(userId);
        setIsBlocked(false);
        toast({ title: "User Unblocked", status: "success" });
      } else {
        await client.blockUser(userId);
        setIsBlocked(true);
        toast({ title: "User Blocked", status: "success" });
      }
    } catch (error) {
      toast({
        title: "Block Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const addFriend = async () => {
    try {
      await addFriendToDB(client.userID, userId);
      toast({ title: "Friend Added", status: "success" });
    } catch (error) {
      toast({
        title: "Add Friend Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const userPostCards = useMemo(
    () => userPosts.map((post) => <UserPostCard post={post} key={post.id} />),
    [userPosts]
  );

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex w-full h-[80%] flex-col">
        <div className="flex w-full h-[50%] bg-white border-[2px] dark:border-[0] border-b-primary">
          <img
            src={Talkmore}
            alt="Talkmore"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-row w-full h-max justify-between relative">
          <div className="flex flex-col w-max h-max  ml-4 relative">
            <div className="flex flex-col w-max h-max items-start transform -translate-y-1/2 justify-start">
              <Avatar
                name={streamUser?.name}
                src={streamUser?.image}
                size="2xl"
                className="dark:border-[5px] border-[5px] border-white dark:border-darkBackground"
                position="relative"
                backgroundColor="white"
                _dark={{ backgroundColor: "#212121e6" }}
              >
                {isOnline && (
                  <Tooltip label="Online" placement="top" hasArrow bg="#41cc69">
                    <AvatarBadge
                      bg="#41cc69"
                      boxSize="0.8em"
                      className="!bottom-1.5 !right-1.5 border-white dark:border-darkBackground border-[2px]"
                    />
                  </Tooltip>
                )}
              </Avatar>
            </div>
            <div className="flex w-max h-max flex-col items-start pl-2 justify-start pt-2 absolute left-0 top-[50px] gap-1">
              <h2 className="text-primary text-xl font-bold">
                {streamUser?.name}
              </h2>
              <p className="text-green-200 text-sm font-bold">
                @{streamUser?.tag}
              </p>

              {/* Bio Section with Show More functionality */}
              <p
                className={`text-green-200 max-w-[400px] text-sm font-bold overflow-hidden ${
                  isBioExpanded ? "block" : "line-clamp-3"
                }`}
              >
                {/* {streamUser?.bio} */}
                John Doe is a passionate and results-driven software engineer
                with over 8 years of experience in building innovative,
                user-centered solutions. Known for a strong foundation in web
                development and a deep understanding of front-end and back-end
                technologies, John thrives on creating seamless, efficient user
                experiences across multiple platforms.
              </p>

              {/* Show More Button */}
              <Button
                variant="link"
                colorScheme="teal"
                size="sm"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                alignSelf="flex-end"
              >
                {isBioExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          </div>

          <div className="flex w-max h-max gap-2 p-4 relative">
            <ProfileMenu userID={userId} userName={streamUser?.name} />
            {client.userID === userId ? (
              <Tooltip
                label="Edit Profile"
                placement="top"
                hasArrow
                bg="#41cc69"
              >
                <IconButton
                  icon={<CiEdit className="text-primary text-2xl" />}
                  aria-label="Edit Profile"
                  onClick={() => navigate(`/Profile/edit/${userId}`)}
                  variant="outline"
                  borderColor="#41cc69"
                />
              </Tooltip>
            ) : (
              <>
                <IconButton
                  icon={<MdPersonAddAlt1 className="text-primary text-2xl" />}
                  aria-label="Add Friend"
                  onClick={addFriend}
                  variant="outline"
                />
                <IconButton
                  icon={<MdBlock className="text-primary text-2xl" />}
                  aria-label={isBlocked ? "Unblock User" : "Block User"}
                  onClick={toggleBlockUser}
                  variant="outline"
                  colorScheme={isBlocked ? "red" : "gray"}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
