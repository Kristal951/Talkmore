import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import PostCard from "../components/PostComponents/PostCard";
import "./index.scss";
import LOGO from "../assets/images/comp2.png";
import Search from "./Search";
import Empty from "../assets/illustrations/Empty.gif";
import { SearchInput } from "@stream-io/video-react-sdk";
import SearchResultCard from "../components/others/SearchResultCard";
import TextareaAutosize from "react-textarea-autosize";
import { createPost } from "../lib/AppriteFunction";
import ReactQuill from "react-quill"; // Import the Quill editor component
import "react-quill/dist/quill.snow.css";
import QuillCustomToolBar from "../components/others/QuillCustomToolBar";
import MyEditor from "../components/others/QuiilEditor";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const { userDetails } = useContext(UserContext);
  const toast = useToast();

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/post/getPosts", {
        timeout: 24000,
        timeoutErrorMessage: "Error fetching Posts",
      });

      if (
        res.data?.posts?.documents &&
        Array.isArray(res.data.posts.documents)
      ) {
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

  const handleSearch = async (event) => {
    setSearching(true);
    const query = event.target.value;
    setSearchQuery(query);

    try {
      const res = await axios.post("http://localhost:5000/user/searchUser", {
        query,
      });
      setFilteredUsers(res.data.posts.documents || []);
    } catch (error) {
      console.log("Search error:", error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
  };

  const handleEditorChange = (value) => {
    setNewPostContent(value);
  };

  const createTextPost = async () => {
    const payload = {
      creator: userDetails?.id,
      textContent: newPostContent,
      mimeType: "text/plain",
    };
    setCreatingPost(true);
    try {
      if (newPostContent.length === 0) {
        return toast({
          title: "Invalid Input",
          description: "Post content is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      await createPost(payload).then((res) => {
        console.log(res);
      });
      getAllPosts();
    } catch (error) {
      console.log(error);
      setCreatingPost(false);
    } finally {
      setCreatingPost(false);
      setNewPostContent("");
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const modules = {
    toolbar: {
      container: "#custom-toolbar", // ID of your custom toolbar
    },
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[55%] border-r-[1px] border-primary h-screen dark:bg-darkBackground relative">
        {/* Header Section */}
        {/* <div className="w-[52%] h-[60px] p-2 left-[20%] shadow-md gap-6 bg-white dark:bg-darkBackground2 border-0 bg-opacity-10 backdrop-blur-sm border-[rgba(255,255,255,0.18)] flex fixed items-center flex-row top-0 z-[9000]">
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
      </div> */}

        {/* Main Content */}
        <div className="w-full h-screen flex flex-col items-start justify-start overflow-y-auto scrollbar-none pt-[70px]">
          {error && (
            <div className="flex flex-col h-full w-full items-center justify-center text-red-500">
              <p>Something went wrong, please try again</p>
              <Button colorScheme="red" onClick={() => getAllPosts()}>
                Retry
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center w-full items-center h-screen">
              <Spinner size="lg" />
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
              {/* <img src={Empty} alt="No Posts" /> */}
              <h2 className="text-primary font-bold text-xl ">
                No posts yet, be the first to create a post
              </h2>
              <button
                className="bg-primary p-2 text-white rounded-lg hover:scale-110 "
                onClick={() => navigate("/CreatePost")}
              >
                Create A Post
              </button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-col w-full items-start">
              {posts.map((post) => (
                <PostCard key={post.$id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-[45%] h-screen flex-col">
        <div className="flex w-full px-6 py-2 h-max sticky dark:bg-darkBackground top-0 bg-white z-10">
          <input
            type="search"
            placeholder="Search..."
            className="w-[98%] placeholder-green-200 dark:bg-background2 h-[40px] pl-8 pr-2 text-primary text-base font-[600px] border border-primary rounded-xl outline-none focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => handleSearch(e)}
          />
          <FaSearch className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary" />
        </div>

        <div className="flex w-full h-full justify-center items-start p-6 overflow-y-auto">
          <div className="flex w-full h-max p-2 flex-col">
            <div className="flex w-full flex-row gap-2 items-start h-max justify-center">
              <Avatar
                src={userDetails?.imgUrl || "/default-profile.png"}
                alt={
                  userDetails
                    ? `${userDetails.name}'s profile picture`
                    : "Default profile pic"
                }
                name={userDetails?.name}
              />
              <div className="flex gap-2 flex-col w-full h-max">
                <MyEditor newPostContent={newPostContent} handleEditorChange={handleEditorChange}/>
              </div>
            </div>
            <div className="flex w-full h-max justify-end">
              <button
                onClick={createTextPost}
                className="bg-primary text-white px-3 py-1 rounded-xl hover:scale-105 transition-transform duration-200 ease-in-out mt-2"
              >
                <p className="text-[18px] font-bold">
                  {creatingPost ? <Spinner /> : "Create Post"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
