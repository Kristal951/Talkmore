import React, { useContext, useState, useEffect, useRef } from 'react';
import { FaTrash, FaCommentAlt } from "react-icons/fa";
import { UserContext } from '../../Contexts/UserContext';
import { deletePost, likePost } from '../../lib/AppriteFunction';
import {
  Spinner, useToast, Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverBody, PopoverFooter, Button, PopoverArrow, PopoverCloseButton, Avatar, AvatarBadge
} from '@chakra-ui/react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import useUserStatus from '../../hooks/useUserStatus';
import unStarred from '../../assets/icons/unStarred.svg';
import Starred from '../../assets/icons/starred.svg';
import './index.scss';

const PostCard = ({ post, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(post?.likes.map(user => user.$id) || []);
  const [isLiked, setIsLiked] = useState(false);
  const { userDetails } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const userId = userDetails?.id;
  const isOnline = useUserStatus(post.creator.$id);
  // console.log(likes, isLiked);
  useEffect(() => {
    setIsLiked(likes.includes(userId));
  }, [likes, userId]);

  console.log(post.likes.length)
  const getTimeAgo = (createdAt) => moment(createdAt).fromNow();

  const handleLikePost = async (e) => {
    e.stopPropagation();
    const updatedLikes = likes.includes(userId)
      ? likes.filter(id => id !== userId)
      : [...likes, userId];
    setLikes(updatedLikes);
    try {
      const res = await likePost(post.$id, updatedLikes);
      console.log(res);
    } catch (error) {
      console.error("Error updating likes:", error);
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
    setLoading(true);
    try {
      await deletePost(post);
      onDelete(post.$id);
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Unable to delete post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToComments = () => {
    navigate(`/post/${post.$id}/comments`);
  };

  return (
    <div className="flex w-full lg:w-[60%] h-[900px] gap-4 border rounded-lg shadow-lg bg-white p-4 m-4 flex-col">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.creator.$id}`}>
            <Avatar src={post.creator.imgURL}>
              {isOnline && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>
          </Link>
          <div>
            <Link to={`/profile/${post.creator.$id}`}>
              <p className="font-bold">{post.creator.name}</p>
              <p className="text-sm text-gray-500">{post.creator.tag}</p>
            </Link>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{getTimeAgo(post.$createdAt)}</p>
      </div>

      {/* Post Media */}
      <div className="w-full">
        {post.mimeType.includes("image") ? (
          <img src={post.imgURL} alt="post media" className="w-full h-80 object-cover rounded-md" />
        ) : (
          <video ref={videoRef} controls className="w-full h-80 rounded-md">
            <source src={post.vidURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <h2 className="mt-2 text-2xl font-semibold">{post.caption}</h2>
        <p className="text-gray-700 mt-1">{post.description}</p>
      </div>

      {/* Post Footer */}
      <div className="flex justify-between mt-2">
        {/* Tags */}
        <div className="flex gap-2">
          {(post.tags || []).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-200 rounded-md text-sm">
              #{tag}
            </span>
          ))}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={handleLikePost} className='w-8 h-8 cursor-pointer'>
            <img
              src={isLiked ? Starred : unStarred}
              alt="like"
              className="w-full h-full"
            />
            <p>{post.likes.length}</p>
          </button>
          <FaCommentAlt className="cursor-pointer w-6 h-6" onClick={navigateToComments} />
          {userId === post.creator.$id && (
            <Popover>
              <PopoverTrigger >
                {/* <button className='w-8 h-8'> */}
                  <FaTrash className='w-6 h-6 cursor-pointer'/>
                {/* </button> */}
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverBody>Are you sure you want to delete this post?</PopoverBody>
                <PopoverFooter>
                  <Button onClick={handleDeletePost} colorScheme="red" isLoading={loading}>
                    Delete
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
