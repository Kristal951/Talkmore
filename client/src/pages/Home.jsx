import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import PostCard from "../components/PostComponents/PostCard";
import CreatePostForm from "../components/PostComponents/CreatePostForm";
import "./index.scss";
import { CiSearch } from "react-icons/ci";
import SearchResultCard from "../components/others/SearchResultCard";

const Home = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const getAllPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/post/getPosts", {
        timeout: 24000,
        timeoutErrorMessage: "Error fetching Posts",
      });

      const documents = res.data?.posts?.documents || [];
      setPosts(documents);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    setSearching(true);
    try {
      const res = await axios.post("http://localhost:5000/user/searchUser", {
        query
      });
      setFilteredUsers(res.data?.users?.documents || []);
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.$id !== postId));
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row">
      {/* Left side - Posts Feed */}
      <div className="w-[55%] border-r-[1px] border-primary h-screen dark:bg-darkBackground relative">
        <div className="flex w-full h-[50px] backdrop-blur-sm fixed top-0 left-[20%] z-10 dark:bg-darkBackground2 right-0" />

        <div className="w-full h-screen flex flex-col pt-[70px] overflow-y-auto scrollbar-none">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner size="lg" />
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex flex-col flex-1 items-center justify-center text-red-500">
              <p>Something went wrong, please try again</p>
              <Button colorScheme="red" onClick={getAllPosts}>
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col flex-1 items-center justify-center gap-4">
              <h2 className="text-primary font-bold text-xl">
                No posts yet, be the first!
              </h2>
              <Button
                colorScheme="teal"
                onClick={() => navigate("/CreatePost")}
              >
                Create A Post
              </Button>
            </div>
          )}

          {/* Posts list */}
          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-col px-4 pb-4">
              {posts.map((post) => (
                <PostCard
                  key={post.$id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Search and Create Post */}
      <div className="flex flex-col w-[45%] h-screen">
        {/* Search Bar */}
        <div className="relative px-6 py-4 bg-white dark:bg-darkBackground z-10">
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

          {/* Search results dropdown */}
          {searchQuery.trim() && (
            <div className="absolute w-[88%] mt-2 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2 z-20">
              {searching ? (
                <div className="flex justify-center items-center">
                  <Spinner size="sm" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <>
                <p className="text-center text-primary font-semibold">
                  No users found
                </p>
                 <Link
                 to={`/Search/${searchQuery}`}
                 className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg"
               >
                 <CiSearch />
                 <span className="text-primary font-semibold">
                   Search for "{searchQuery}"
                 </span>
                 
               </Link>
               </>
              ) : (
                <>
                  {filteredUsers.map((user) => (
                    <SearchResultCard key={user.$id} user={user} searchQuery={searchQuery} />
                  ))}

                  <Link
                    to={`/Search/${searchQuery}`}
                    className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <CiSearch />
                    <span className="text-primary font-semibold">
                      Search for "{searchQuery}"
                    </span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Create Post Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <CreatePostForm getAllPosts={getAllPosts} />
        </div>
      </div>
    </div>
  );
};

export default Home;
