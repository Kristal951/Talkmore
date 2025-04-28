import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { queryPosts } from "../lib/AppriteFunction";
import SearchResultCard from "../components/others/SearchResultCard";
import { MdCancel } from "react-icons/md";

const Search = ({ setSearching }) => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    try {
      // const res = await queryPosts(query);
      // setPosts(res.documents);
    } catch (error) {
      console.error(error);
    }
  };

  const closeSearch = () => {
    setSearching(false);
  };

  return (
    <div className="w-full h-screen bg-[#4b5563] bg-opacity-40 fixed left-0 top-0 z-[10000] flex items-center justify-center backdrop-blur-sm pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute w-full h-full bg-transparent pointer-events-none"
        onClick={closeSearch}
      ></div>

      {/* Main Search Container */}
      <div
        className="flex flex-col w-[50%] max-w-[600px] rounded-md dark:bg-darkBackground2 bg-white shadow-md p-6 z-[10001] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div
          className="absolute top-4 right-4 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
          onClick={closeSearch}
        >
          <MdCancel className="w-full h-full text-gray-700" />
        </div>

        {/* Search Input */}
        <div className="flex w-full items-center gap-2 mb-4">
          <FaSearch className="text-gray-500" />
          <input
            type="search"
            className="flex-1 p-2 border-0 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none"
            placeholder="Search anything"
            value={query}
            onChange={handleSearch}
            autoFocus
          />
        </div>

        {/* Search Filters */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md shadow-md">
            All
          </button>
          <button className="px-3 py-1 bg-gray-100 text-blue-600 rounded-md shadow-md dark:bg-gray-700 dark:text-white">
            Posts
          </button>
          <button className="px-3 py-1 bg-gray-100 text-blue-600 rounded-md shadow-md dark:bg-gray-700 dark:text-white">
            Chats
          </button>
        </div>

        {/* Search Results */}
        <div className="flex flex-col gap-2">
          {posts.length > 0 ? (
            posts.map((post, i) => <SearchResultCard post={post} key={i} />)
          ) : (
            <p className="text-gray-500 text-sm">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
