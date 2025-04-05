import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "@chakra-ui/react";
import axios from "axios";
import PostCard from "../components/PostComponents/PostCard";
import "./index.scss";
import LOGO from "../assets/images/comp2.png";
import Search from "./Search";
import Empty from "../assets/illustrations/Empty.gif";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { userDetails } = useContext(UserContext);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/post/getPosts", {
        timeout: 24000,
        timeoutErrorMessage: "Error fetching Posts",
      });

      if (res.data?.posts?.documents && Array.isArray(res.data.posts.documents)) {
        setPosts(res.data.posts.documents);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  console.log(userDetails);

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="w-full h-screen dark:bg-darkBackground relative">
      {/* Header Section */}
      <div className="w-[80%] h-[60px] p-2 right-0 shadow-md gap-6 bg-white dark:bg-darkBackground2 border-0 bg-opacity-10 backdrop-blur-sm border-[rgba(255,255,255,0.18)] flex fixed items-center flex-row top-0 z-[9000]">
        <div className="flex right-40 items-center justify-center absolute">
          <Button colorScheme="blue" variant="solid" onClick={() => navigate("/CreatePost")}>
            Create A Post
          </Button>
        </div>
        <div className="flex w-[50px] h-[50px] absolute right-20 cursor-pointer profile-img">
          <img
            src={userDetails?.imgUrl || "/default-profile.png"}
            alt={userDetails ? `${userDetails.name}'s profile picture` : "Default profile pic"}
            className="rounded-full w-full h-full"
            title={userDetails?.name}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-screen flex flex-col items-start justify-start overflow-y-auto pt-[70px]">
        {error && (
          <div className="flex flex-col h-full w-full items-center justify-center text-red-500">
            <p>Something went wrong, please try again</p>
            <Button colorScheme="red" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center w-full items-center h-screen">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <img src={Empty} alt="No Posts" />
            <h2 className="text-primary font-bold text-xl -translate-y-[70px]">No posts yet, be the first to create a post</h2>
            <button
              className="bg-primary p-2 text-white rounded-lg hover:scale-110 -translate-y-[20px]"
              onClick={() => navigate("/CreatePost")}
            >
              Create A Post
            </button>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex flex-col w-full items-start gap-4">
            {posts.map((post) => (
              <PostCard key={post.$id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {searching && <Search setSearching={setSearching} />}
    </div>
  );
};

export default Home;
