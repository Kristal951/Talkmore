import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Avatar,
  AvatarBadge
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../Contexts/UserContext";
import useUserStatus from "../../hooks/useUserStatus";
import "./index.scss";
import PostMenu from "./PostMenu";
import PostActions from "./PostActions";

const PostCard = ({ post, onDelete }) => {
  const { userDetails = {} } = useContext(UserContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const isOnline = useUserStatus(post?.creator?.$id);
  const userId = userDetails?.id;

  const [showFullCaption, setShowFullCaption] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5)
          video.play();
        else video.pause();
      },
      { threshold: [0.5] }
    );
    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);

  const getTimeAgo = (createdAt) => moment(createdAt).fromNow();
  const toggleCaption = () => setShowFullCaption(!showFullCaption);
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={() => navigate(`/post/${post?.$id}/details`)}
      className="flex rounded-t-lg flex-row w-full hover:bg-gray-50 cursor-pointer max-h-max md:p-4 pr-2 pt-2 pb-2 bg-white border-b-[1px] border-primary dark:bg-darkBackground"
    >
      {/* Avatar */}
      <div className="flex w-[70px] items-start justify-center h-full">
        <Link to={`/profile/${post?.creator?.$id}`} onClick={stopPropagation}>
          <Avatar src={post?.creator?.imgURL || "/default-avatar.png"}>
            {isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
          </Avatar>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between h-max items-center">
          <Link
            to={`/profile/${post?.creator?.$id}`}
            onClick={stopPropagation}
            className="flex items-start md:items-center gap-2"
          >
            <div className="flex flex-col md:flex-row w-max h-max">
              <h2 className="text-primary font-bold hover:underline text-[18px]">
                {post?.creator?.name}
              </h2>
              <p className="text-green-300 dark:opacity-50">
                @{post?.creator?.tag}
              </p>
            </div>
            <span className="text-green-300">•</span>
            <p className="text-green-300">{getTimeAgo(post?.$createdAt)}</p>
          </Link>

          <PostMenu post={post} userId={userId} stopPropagation={stopPropagation}/>
        </div>

        {/* Caption */}
        <div className="mt-3">
          {post?.caption && (
            <div className="flex flex-col gap-1">
              <h1 onClick={stopPropagation} className="text-primary text-base">
                <span className={showFullCaption ? "block" : "line-clamp-3"}>
                  {post?.caption}
                </span>
              </h1>
              {post?.caption?.length > 100 && (
                <div className="flex justify-end">
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
        </div>

        {/* Media */}
        <div className="md:mt-2 max-w-auto max-h-auto">
          {post?.mimeType?.includes("image") && post?.imgURL && (
            <div className="flex aspect-w-2 aspect-h-2">
              <img
                src={post.imgURL}
                alt="Post media"
                className="rounded-lg object-cover"
                loading="lazy"
              />
            </div>
          )}
          {post?.mimeType?.includes("video") && post?.vidURL && (
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
                <source src={post.vidURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {!post?.mimeType?.includes("image") &&
            !post?.mimeType?.includes("video") &&
            !post?.mimeType?.includes("text") && (
              <p className="text-gray-500">Media not available</p>
            )}

          {post?.mimeType?.includes("text") && post?.TextContent && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex w-full flex-col p-2"
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

        <PostActions post={post} userId={userId} onDelete={onDelete}/>

      </div>
    </div>
  );
};

export default PostCard;
