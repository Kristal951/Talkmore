import React, { useContext, useState } from 'react';
import { FaTrash, FaCommentAlt } from "react-icons/fa";
import { UserContext } from '../../Contexts/UserContext';
import { deletePost, toggleLikePost } from '../../lib/AppriteFunction';
import {
  Spinner, useToast, Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverBody, PopoverFooter, Button, PopoverArrow, PopoverCloseButton, Avatar, AvatarBadge 
} from '@chakra-ui/react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import useUserStatus from '../../hooks/useUserStatus';
import unStarred from '../../assets/icons/unStarred.svg'
import Starred from '../../assets/icons/starred.svg'

const PostCard = ({ post, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(false);
  const { userDetails } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();
  const userId = userDetails?.id;
  const isOnline = useUserStatus(post.creator.$id);

  const getTimeAgo = (createdAt) => {
    const duration = moment.duration(moment().diff(moment(createdAt)));
    return duration.asDays() >= 1
      ? `${Math.floor(duration.asDays())} day${Math.floor(duration.asDays()) > 1 ? 's' : ''} ago`
      : duration.asHours() >= 1
      ? `${Math.floor(duration.asHours())} hour${Math.floor(duration.asHours()) > 1 ? 's' : ''} ago`
      : duration.asMinutes() >= 1
      ? `${Math.floor(duration.asMinutes())} minute${Math.floor(duration.asMinutes()) > 1 ? 's' : ''} ago`
      : `${Math.floor(duration.asSeconds())} second${Math.floor(duration.asSeconds()) > 1 ? 's' : ''} ago`;
  };

  const navigateToComments = () => {
    navigate(`/post/${post.$id}/comments`);
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      await deletePost(post);
      setLoading(false);
      onDelete(post.$id)
      toast({
        title: 'Post Deleted',
        description: 'Your post has successfully been deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: 'Post Deletion Failed',
        description: 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleToggleLike = async () => {
    try {
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount(newLikeStatus ? likeCount + 1 : likeCount - 1);

      await toggleLikePost(post.$id, userId); 
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast({
        title: 'Like Failed',
        description: 'An error occurred while liking the post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      // Revert state if there was an error
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  }

  return (
    <div className="flex w-[60%] h-[600px] gap-[8px] border-[1px] shadow-xl p-4 m-4 bg-white flex-col rounded-lg">
      <div className="flex w-full flex-row h-[50px] justify-between items-center">
        <div className="flex flex-row gap-2">
          <Link to={`/profile/${post.creator.$id}`}>
            <Avatar src={post.creator.imgURL} alt="img" className="cursor-pointer">
              {isOnline && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${post.creator.$id}`}>
              <p className="font-bold">{post.creator.name}</p>
              <p className="text-sm text-[#4b5563] opacity-50">{post.creator.tag}</p>
            </Link>
          </div>
        </div>
        <p>{getTimeAgo(post.$createdAt)}</p>
      </div>

      <div className="w-full flex flex-col items-start">
        {post.mimeType.includes('image') ? (
          <img src={post.imgURL} alt="post media" className="w-full h-[430px] object-cover rounded-md" />
        ) : (
          <video controls className="w-full h-[430px] object-cover rounded-md">
            <source src={post.vidURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <h2 className="text-2xl font-semibold mt-2">{post.caption}</h2>
        <p className="text-gray-600 mt-1">{post.description}</p>

        <div className="mt-2 w-full flex flex-row gap-2 justify-between items-center">
          <div className="flex flex-row gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 rounded-md text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex w-[30px] h-[30px] ">
              <img src={unStarred} alt="stared" className='w-full h-full object-contain'/>
            </div>
            <FaCommentAlt size={25} className="cursor-pointer" onClick={navigateToComments} />
            {userId === post.creator.$id && (
              <Popover placement="bottom">
                <PopoverTrigger>
                  <button isLoading={loading}>
                    <FaTrash size={25} />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Confirmation</PopoverHeader>
                  <PopoverBody>Are you sure you want to delete this post?</PopoverBody>
                  <PopoverFooter display="flex" justifyContent="flex-end">
                    <Button colorScheme="red" onClick={handleDeletePost} isDisabled={loading}>
                      Yes
                    </Button>
                    <Button ml={3}>No</Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
