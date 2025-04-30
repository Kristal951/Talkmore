import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";
import { queryPosts } from "../lib/AppriteFunction";
import SearchResultCard from "../components/others/SearchResultCard";
import { Spinner } from "@chakra-ui/react";

const Search = ({ setSearching }) => {
  const { query } = useParams();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const queryUsers = async (query) => {
    try {
      const res = await axios.post("http://localhost:5000/user/searchUser", {
        query,
      });
      return res.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {};
    }
  };

  const performSearch = async (value) => {
    setLoading(true);
    try {
      if (filter === "Posts") {
        setUsers([]);
        const res = await queryPosts(value);
        setPosts(res.documents || []);
      } else if (filter === "Users") {
        const res = await queryUsers(value);
        setUsers(res.documents || []);
        setPosts([]);
      } else if (filter === "All") {
        const [postsRes, usersRes] = await Promise.all([
          queryPosts(value),
          queryUsers(value),
        ]);
        setPosts(postsRes.users || []);
        setUsers(usersRes?.users || []);
      }
      setChats([]);
    } catch (err) {
      console.error(err);
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
      return;
    }
    performSearch(value);
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    setPosts([]);
    setUsers([]);
    setChats([]);
    if (searchQuery.trim()) performSearch(searchQuery);
  };

  const closeSearch = () => {
    setSearching(false);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filter]);

  return (
    <div className="flex w-full h-screen bg-white">
      <div className="flex flex-col gap-3 w-full h-full p-2 max-w-[50%]">
        {/* Header */}
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

        {/* Filters */}
        <div className="flex gap-4 mb-6 pt-2">
          {["All", "Posts", "Users"].map((item) => (
            <button
              key={item}
              onClick={() => changeFilter(item)}
              className={`px-3 py-1 rounded-lg text-md font-medium transition ${
                filter === item
                  ? "bg-primary text-white font-bold text-[20px]"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading && <Spinner size="md" />}
          {users && users.map((user) => <SearchResultCard user={user} />)}
        </div>
      </div>
    </div>
  );
};

export default Search;
