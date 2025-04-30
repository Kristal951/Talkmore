import React, { useContext, useState, useEffect, useRef } from "react";
import { FaTrash, FaCommentAlt } from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";
import {
  deletePost,
  handleDownload,
  toggleLikePost,
} from "../../lib/AppriteFunction";
import { Avatar, AvatarBadge, Spinner, useToast } from "@chakra-ui/react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import useUserStatus from "../../hooks/useUserStatus";
import unStarred from "../../assets/GIF/unStarred.gif";
import Starred from "../../assets/GIF/Starred.gif";
import { FiDownload } from "react-icons/fi";
import './index.scss';

const PostCard = ({ post, onDelete }) => {
  const { userDetails = {} } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(
    post?.likes?.map((user) => user?.$id) || []
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const isOnline = useUserStatus(post?.creator?.$id);
  const userId = userDetails?.id;

  console.log(post)

  useEffect(() => {
    setIsLiked(likes?.includes(userId));
  }, [likes, userId]);

  const getTimeAgo = (createdAt) => moment(createdAt).fromNow();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

  const handleLikePost = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    const updatedLikes = isLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    setIsLiked(!isLiked);

    try {
      await toggleLikePost(post?.$id, userId);
    } catch (error) {
      console.error("Error updating likes:", error);
      setLikes(
        isLiked ? [...likes, userId] : likes.filter((id) => id !== userId)
      );
      toast({
        title: "Error",
        description: "Unable to update likes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePost = async () => {
    if (!userId) return;
    setLoading(true);
    const prevPosts = [...likes];
    setIsDeleting(true);

    try {
      await deletePost(post);
      onDelete(post?.$id);
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setLikes(prevPosts);
      toast({
        title: "Error",
        description: "Unable to delete post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleting(false);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const navigateToComments = () => {
    navigate(`/post/${post?.$id}/comments`);
  };

  const navigateToPostDetails = () => {
    navigate(`/post/${post?.$id}/details`);
  };

  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={navigateToPostDetails}
      className="flex rounded-t-lg flex-row w-full hover:bg-gray-50 cursor-pointer max-h-max p-4 bg-white border-b-[1px] border-primary dark:bg-darkBackground"
    >
      {/* Avatar Section */}
      <div className="flex w-[70px] items-start justify-center h-full">
        <Link to={`/profile/${post?.creator?.$id}`} onClick={stopPropagation}>
          <Avatar
            src={post?.creator?.imgURL || "/default-avatar.png"}
            alt={`${post?.creator?.name}'s profile`}
          >
            {isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
          </Avatar>
        </Link>
      </div>

      {/* Post Content */}
      <div className="flex w-full h-max flex-col">
        {/* User Info */}
        <Link
          to={`/profile/${post?.creator?.$id}`}
          onClick={stopPropagation}
          className="flex flex-row items-center gap-2"
        >
          <h2 className="text-primary font-bold hover:underline text-[18px]">
            {post?.creator?.name}
          </h2>
          <p className="text-green-300 dark:opacity-50">
            @{post?.creator?.tag}
          </p>
          <span className="text-green-300 dark:opacity-50">•</span>
          <p className="text-green-300 dark:opacity-50">
            {getTimeAgo(post?.$createdAt)}
          </p>
        </Link>

        <div className="flex w-full mt-3 gap-2 h-max flex-col">
          {post?.caption && (
            <div className="flex flex-col gap-1">
              <h1
                className="capitalize text-primary text-base"
                onClick={stopPropagation}
              >
                <span
                  className={`${showFullCaption ? "block" : "line-clamp-3"}`}
                >
                  {post?.caption}
                </span>
              </h1>
              {post?.caption?.length > 100 && (
                <div className="flex w-full h-max justify-end items-center">
                  <button
                    onClick={(e) => {
                      stopPropagation(e);
                      toggleCaption();
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {showFullCaption ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Post Media */}
          <div className="max-w-auto max-h-auto">
            {post?.mimeType?.includes("image") && post?.imgURL && (
              <div className="flex aspect-w-2 aspect-h-2">
                <img
                  src={post?.imgURL}
                  alt="Post Media"
                  className="rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {post?.mimeType?.includes("video") && post?.vidURL ? (
              <div className="flex aspect-w-2 aspect-h-2">
                <video
                  ref={videoRef}
                  controls
                  preload="metadata"
                  autoPlay
                  loop
                  playsInline
                  className="rounded-lg object-cover"
                  onClick={stopPropagation}
                >
                  <source src={post?.vidURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              !post?.mimeType?.includes("image") &&
              !post?.mimeType?.includes("text") && (
                <p className="text-gray-500">Media not available</p>
              )
            )}

            {post?.mimeType?.includes("text") && post?.TextContent && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex w-full flex-col p-4 "
              >
                <div
                  className={`${
                    showFullCaption
                      ? "block text-primary text-base whitespace-pre-wrap font-semibold"
                      : "line-clamp-6 text-primary font-semibold"
                  } quill-content`}
                  dangerouslySetInnerHTML={{ __html: post?.TextContent }}
                />

                {post?.TextContent?.length > 200 && (
                  <div className="flex w-full h-max justify-end items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCaption();
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      {showFullCaption ? "Show Less" : "Show More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex flex-row items-center justify-between h-max mt-3 gap-4">
          <button
            onClick={handleLikePost}
            className="flex items-center justify-center bg-opacity-10 p-1 rounded-lg dark:hover:bg-yellow-50 hover:bg-yellow-100 text-gray-600 dark:text-gray-300 gap-1"
          >
            <img
              src={isLiked ? Starred : unStarred}
              alt="Like"
              className="w-6 h-6 object-contain"
              loading="lazy"
            />
            <span className={isLiked ? "text-yellow-300" : ""}>
              {likes?.length || 0}
            </span>
          </button>

          <button
            onClick={(e) => {
              stopPropagation();
              e.navigateToComments();
            }}
            className="flex flex-row gap-2 items-center p-1 h-max w-max text-primary rounded-lg dark:hover:bg-green-50 hover:bg-green-100 justify-center bg-opacity-10 dark:bg-opacity-5"
          >
            <FaCommentAlt className="w-[1.2rem] h-[1.2rem]" />
            <span>{post?.comments?.length || 0}</span>
          </button>

          {(post.mimeType.includes("image") && post?.imgURL) ||
            (post.mimeType.includes("video") && post?.vidURL && (
              <button
                onClick={(e) => {
                  handleDownload(post?.fileID);
                  e.stopPropagation();
                }}
                className="flex flex-row gap-2 items-center p-1 h-max w-max text-primary rounded-lg dark:hover:bg-green-50 hover:bg-green-100 justify-center bg-opacity-10 dark:bg-opacity-5"
              >
                <FiDownload className="w-[1.2rem] h-[1.2rem]" />
              </button>
            ))}

          {userId === post?.creator?.$id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost();
              }}
              disabled={loading}
              className="text-red-500 hover:bg-red-300 p-1 rounded-lg dark:hover:bg-red-50 flex items-center justify-center"
              title="Delete Post"
            >
              {isDeleting ? <Spinner size="sm" color="red.500" /> : <FaTrash />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
