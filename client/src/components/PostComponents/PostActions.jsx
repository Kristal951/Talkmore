import React, { useEffect, useState } from 'react'
import unStarred from "../../assets/GIF/unStarred.gif";
import Starred from "../../assets/GIF/Starred.gif";
import { useNavigate } from 'react-router-dom';
import { Spinner, useToast } from '@chakra-ui/react';
import { deletePost, handleDownload, toggleLikePost } from '../../lib/AppriteFunction';
import { FaCommentAlt, FaTrash } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

const PostActions = ({post, userId, onDelete}) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
     const [likes, setLikes] = useState(post?.likes?.map((u) => u?.$id) || []);
     const [isDeleting, setIsDeleting] = useState(false);
     const toast = useToast();
     const [loading, setLoading] = useState(false);

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
          console.error("Like error:", error);
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
            setLikes(prevPosts);
            toast({
              title: "Error",
              description: "Unable to delete post.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } finally {
            setLoading(false);
            setIsDeleting(false);
          }
        };

      useEffect(() => {
        setIsLiked(likes.includes(userId));
      }, [likes, userId]);    

  return (
    <div className="flex items-center w-full justify-between mt-3 gap-3 flex-wrap">
    <button onClick={handleLikePost} className="flex items-center gap-1">
      <img
        src={isLiked ? Starred : unStarred}
        alt="Like"
        className="w-6 h-6"
      />
      <span className={isLiked ? "text-yellow-300" : ""}>
        {likes?.length || 0}
      </span>
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post?.$id}/comments`);
      }}
      className="flex items-center gap-1 text-primary"
    >
      <FaCommentAlt />
      <span>{post?.comments?.length || 0}</span>
    </button>

    {(post?.imgURL || post?.vidURL) && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload(post?.fileID);
        }}
        className="text-primary"
      >
        <FiDownload />
      </button>
    )}

    {userId === post?.creator?.$id && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePost();
        }}
        className="text-red-500"
        disabled={isDeleting}
      >
        {isDeleting ? <Spinner size="sm" /> : <FaTrash />}
      </button>
    )}
  </div>
  )
}

export default PostActions