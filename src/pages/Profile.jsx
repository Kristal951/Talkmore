import React, { useContext, useEffect, useState, useMemo } from "react";
import { useChatContext } from "stream-chat-react";
import {
  AvatarBadge,
  Avatar,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { addFriendToDB, getUserPosts } from "../lib/AppriteFunction";
import UserPostCard from "../components/PostComponents/UserPostCard";
import useUserStatus from "../hooks/useUserStatus";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { UserContext } from "../Contexts/UserContext";
import { CiEdit } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdPersonAddAlt1, MdBlock } from "react-icons/md";

const AvatarWithBadge = ({ src, isOnline, title }) => (
  <Avatar src={src} size="2xl" title={title}>
    {isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
  </Avatar>
);

const Profile = () => {
  const { userID } = useParams();
  const { client } = useChatContext();
  const [streamUser, setStreamUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { userDetails } = useContext(UserContext);
  const isOnline = useUserStatus(userID);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getCurrentUserPosts = async () => {
      if (userID) {
        try {
          setLoading(true);
          setError(null);
          const posts = await getUserPosts(userID);
          setUserPosts(posts);
        } catch (err) {
          console.error("Error fetching user posts:", err);
          setError("Failed to load posts. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    const getCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await client.queryUsers(
          { id: { $eq: userID } },
          { limit: 1 }
        );
        setStreamUser(response.users[0]);
        console.log(response.users[0]);

        console.log('user', client.user)

        const blockStatus = await client.getBlockedUsers({
          bannedUserId: userID,
          userId: client.userID,
        });
        setIsBlocked(blockStatus.bans.length > 0);
      } catch (err) {
        console.error("Error fetching Stream user:", err);
        setError("Failed to load user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
    getCurrentUserPosts();
  }, [client, userID]);

  const toggleBlockUser = async () => {
    try {
      if (isBlocked) {
        await client.unBlockUser(userID);
        setIsBlocked(false);
        toast({
          title: "User Unblocked Successfully",
          description: "You have successfully unblocked the user.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await client.blockUser(userID);
        setIsBlocked(true);
        toast({
          title: "User Blocked Successfully",
          description: "You have successfully blocked the user.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "An error occurred while toggling the block status.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const addFriend = async () => {
    try {
      const res = await addFriendToDB(client.userID, userID);
      console.log(res);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const userPostCards = useMemo(
    () =>
      userPosts.map((post) => (
        <UserPostCard post={post} key={post.id} />
      )),
    [userPosts]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden dark:bg-darkBackground">
      <div className="w-full h-max flex flex-row items-center justify-center relative">
        <div className="flex w-[300px] h-max p-6 flex-col items-center justify-center relative dark:text-white">
          <AvatarWithBadge
            src={streamUser?.image}
            isOnline={isOnline}
            title={streamUser?.name}
          />
          <div className="flex p-2 flex-col items-center justify-center">
            <h3 className="text-xl font-bold p-1">{streamUser?.name}</h3>
            <p className="text-gray-400 text-center">{streamUser?.tag}</p>
            <div className="flex items-center justify-center">
              <p>{streamUser?.bio}</p>
            </div>

            <div
              className="flex absolute right-6 top-6 w-[40px] h-[40px] cursor-pointer hover:bg-gray-200 hover:rounded-full p-2"
              onClick={() => navigate(`/Profile/edit/${userID}`)}
            >
              <CiEdit className="w-full h-full" />
            </div>
          </div>
        </div>

        <Link
          to={`/profile/notifications/${userID}`}
          className="flex w-[50px] h-[50px] p-2 absolute right-6 top-6 hover:bg-gray-200 rounded-full cursor-pointer"
        >
          <IoMdNotificationsOutline className="w-full h-full" />
        </Link>
      </div>

      {client.userID !== userID && (
        <div className="w-full p-2 h-max gap-6 justify-center flex">
          <IconButton
            icon={<MdPersonAddAlt1 className="w-full h-full" />}
            size="lg"
            p="2"
            aria-label="Add friend button"
            onClick={addFriend}
          />
          <IconButton
            icon={<MdBlock className="w-full h-full" />}
            size="lg"
            p="2"
            aria-label={isBlocked ? "Unblock user button" : "Block user button"}
            onClick={toggleBlockUser}
            colorScheme={isBlocked ? "red" : "gray"}
            title={isBlocked ? "Unblock User" : "Block User"}
          />
        </div>
      )}

      <div className="w-full h-full p-2">
        {error && <p className="text-red-500">{error}</p>}
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>
              <p className="font-bold text-xl" title="user posts">
                Posts
              </p>
            </Tab>
            <Tab>
              <p className="font-bold text-xl" title="starred posts">
                Starred
              </p>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="flex flex-wrap h-[500px] w-full p-2 gap-8 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray scrollbar-rounded">
                {userPosts.length > 0 ? (
                  userPostCards
                ) : (
                  <p>No posts available</p>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <p>Starred posts will appear here.</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
