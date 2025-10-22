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
import { Helmet } from "react-helmet-async";
import TopBar from "../components/others/TopBar";

const Home = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


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

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.$id !== postId));
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row">
      <Helmet>
        <title>Home | Talkmore</title>
        <meta name="description" content="See the latest posts and connect with users on Talkmore." />
      </Helmet>

      <div className="md:w-[55%] w-full md:border-r-[1px] border-primary h-screen dark:bg-darkBackground relative">

        <div className="w-full h-screen flex flex-col md:pt-[70px] pt-10 overflow-y-auto scrollbar-none">
          {loading && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner size="lg" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col flex-1 items-center justify-center text-red-500">
              <p>Something went wrong, please try again</p>
              <Button colorScheme="red" onClick={getAllPosts}>
                Retry
              </Button>
            </div>
          )}

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

          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-col md:px-4 pb-4">
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
      <div className=" hidden md:flex flex-col w-[45%] h-screen">
        {/* Create Post Section */}
        {/* <div className="flex-1 mt-[40px] overflow-y-auto p-6">
          <CreatePostForm getAllPosts={getAllPosts} />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
