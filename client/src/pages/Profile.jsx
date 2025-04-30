import React, { useContext, useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Avatar,
  AvatarBadge,
  Spinner,
  IconButton,
  useToast,
  Tooltip,
  Button,
  Tabs,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdPersonAddAlt1, MdBlock } from "react-icons/md";
import Talkmore from "../assets/PNG/comp2.png";
import { getUserPosts } from "../lib/AppriteFunction";
import useUserStatus from "../hooks/useUserStatus";
import { UserContext } from "../Contexts/UserContext";
import UserPostCard from "../components/PostComponents/UserPostCard";
import ProfileMenu from "../components/others/ProfileMenu";
import PostCard from "../components/PostComponents/PostCard";

const Profile = () => {
  const { userId } = useParams();
  const { client } = useChatContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [streamUser, setStreamUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const isOnline = useUserStatus(userId);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await client.queryUsers({ id: { $eq: userId } }, { limit: 1 });
        setStreamUser(res.users[0]);
      } catch {
        setError("Failed to load user details.");
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const posts = await getUserPosts(userId);
        setUserPosts(posts);
      } catch {
        setError("Failed to load user posts.");
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userId) {
      fetchUser();
      fetchPosts();
    }
  }, [client, userId]);

  const toggleBlockUser = async () => {
    try {
      if (isBlocked) {
        await client.unBlockUser(userId);
        toast({ title: "User Unblocked", status: "success" });
      } else {
        await client.blockUser(userId);
        toast({ title: "User Blocked", status: "success" });
      }
      setIsBlocked(!isBlocked);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  const addFriend = async () => {
    try {
      // await addFriendToDB(client.userID, userId);
      toast({ title: "Friend Added", status: "success" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  if (loadingUser) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!streamUser) {
    return (
      <div className="flex w-full h-screen items-center justify-center text-red-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll">
      <div className="w-full h-[80%] flex flex-col">
        {/* Banner */}
        <div className="w-full h-[50%] border-b-2 border-primary dark:border-0">
          <img src={Talkmore} alt="Talkmore" className="w-full h-full object-cover" />
        </div>

        {/* Avatar + User Info */}
        <div className="flex justify-between items-start p-4 relative">
          <div className="flex flex-col items-start gap-2">
            <div className="-mt-16">
              <Avatar
                size="2xl"
                name={streamUser?.name}
                src={streamUser?.image}
                backgroundColor="white"
                className="border-[5px] dark:border-darkBackground border-white"
              >
                {isOnline && (
                  <Tooltip label="Online" hasArrow bg="#41cc69">
                    <AvatarBadge
                      boxSize="0.8em"
                      bg="#41cc69"
                      className="!bottom-1.5 !right-1.5 border-white dark:border-darkBackground border-[2px]"
                    />
                  </Tooltip>
                )}
              </Avatar>
            </div>

            <div className="pl-2">
              <h2 className="text-primary text-xl font-bold">{streamUser?.name}</h2>
              <p className="text-green-300 text-sm font-bold">@{streamUser?.tag}</p>
              <p className={`text-green-300 max-w-[400px] text-sm font-bold overflow-hidden ${isBioExpanded ? "" : "line-clamp-3"}`}>
                {streamUser?.bio || "No bio available."}
              </p>
              {streamUser?.bio?.length > 100 && (
                <Button
                  variant="link"
                  colorScheme="teal"
                  size="sm"
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                >
                  {isBioExpanded ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <ProfileMenu userID={userId} userName={streamUser?.name} />
            {client.userID === userId ? (
              <Tooltip label="Edit Profile" hasArrow bg="#41cc69">
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

      {/* Tabs Section */}
      <div className="w-full h-max px-4 bg-white dark:bg-darkBackground">
        <Tabs variant="enclosed" isFitted colorScheme="green" position="sticky" top="0" >
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Liked Posts</Tab>
            <Tab>Bookmarks</Tab>
          </TabList>

          <TabPanels paddingTop={4}>
            {/* Posts Tab */}
            <TabPanel>
              {loadingPosts ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner size="lg" />
                </div>
              ) : userPosts.length > 0 ? (
                <div className="flex w-[60%] flex-col gap-4">
                  {userPosts.map((post) => (
                    <PostCard key={post.$id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No posts yet.</p>
              )}
            </TabPanel>

            {/* Liked Posts Tab */}
            <TabPanel>
              <p className="text-gray-400 text-center">Liked posts feature coming soon.</p>
            </TabPanel>

            {/* Bookmarks Tab */}
            <TabPanel>
              <p className="text-gray-400 text-center">Bookmarks feature coming soon.</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default Profile;
