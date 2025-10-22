import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Spinner } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { queryPosts , queryUsers, queryChannels} from "../lib/AppriteFunction";
import SearchResultCard from "../components/others/SearchResultCard";

const Search = ({ setSearching }) => {
  const { query } = useParams();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState("Posts");
  const [loading, setLoading] = useState(false);

  const performSearch = async (value) => {
    setLoading(true);
    try {
      const [postsRes, channelsRes, usersRes] = await Promise.all([
        queryPosts(value),
        queryChannels(value),
        queryUsers(value),
      ]);

      console.log('post', postsRes);
      console.log('channels', channelsRes);
      console.log('users', usersRes);

      setPosts(postsRes?.documents || []);
      setChats(channelsRes?.channels || []);
      setUsers(usersRes.documents || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setPosts([]);
      setUsers([]);
      setChats([]);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery]);

  return (
    <div className="flex w-full h-screen bg-white">
      <div className="flex flex-col gap-3 w-full h-full p-2 max-w-[50%]">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="w-full placeholder-green-200 dark:bg-background2 h-[40px] pl-10 pr-4 text-primary font-semibold border border-primary rounded-xl outline-none focus:ring-0"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
        </div>

        {/* Filter Tabs */}
        <Tabs
          variant="enclosed"
          isFitted
          colorScheme="green"
          onChange={(index) => {
            const filters = ["Posts", "Channels", "Users"];
            setFilter(filters[index]);
          }}
        >
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Channels</Tab>
            <Tab>Users</Tab>
          </TabList>

          <TabPanels>
            {/* Posts Tab */}
            <TabPanel overflowY="scroll">
              {loading ? (
                <Spinner size="md" />
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <SearchResultCard key={post.$id} post={post} searchQuery={searchQuery} />
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </TabPanel>

            {/* Channels Tab */}
            <TabPanel>
              {loading ? (
                <Spinner size="md" />
              ) : chats.length > 0 ? (
                chats.map((chat) => (
                  <SearchResultCard key={chat._id || chat.id} chat={chat} searchQuery={searchQuery} />
                ))
              ) : (
                <p>No channels found.</p>
              )}
            </TabPanel>

            {/* Users Tab */}
            <TabPanel>
              {loading ? (
                <Spinner size="md" />
              ) : users.length > 0 ? (
                users.map((user) => (
                  <SearchResultCard key={user.$id} user={user} searchQuery={searchQuery} />
                ))
              ) : (
                <p>No users found.</p>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;
