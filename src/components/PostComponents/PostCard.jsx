import React, { useContext, useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { UserContext } from '../../Contexts/UserContext';
import { deletePost } from '../../lib/AppriteFunction';
import { Spinner, useToast, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, Button, PopoverArrow, PopoverCloseButton, Avatar } from '@chakra-ui/react';
import moment from 'moment/moment';
import { Link, useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {

  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const fileType = post.mimeType;
  const userId = userDetails.id;
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const navigate= useNavigate()

  const openPopover = () => setIsOpen(true);
  const closePopover = () => setIsOpen(false);

  const getTimeAgo = (createdAt) => {
    const now = moment();
    const postTime = moment(createdAt);
    const duration = moment.duration(now.diff(postTime));

    const days = duration.asDays();
    const hours = duration.asHours();
    const minutes = duration.asMinutes();
    const seconds = duration.asSeconds();

    if (days >= 1) {
      return `${Math.floor(days)} day${Math.floor(days) > 1 ? 's' : ''} ago`;
    } else if (hours >= 1) {
      return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? 's' : ''} ago`;
    } else if (minutes >= 1) {
      return `${Math.floor(minutes)} minute${Math.floor(minutes) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(seconds)} second${Math.floor(seconds) > 1 ? 's' : ''} ago`;
    }
  };

  const navigateTocomments=()=>{
    navigate(`/post/${post.$id}/comments`)
  }

  const handleDeletePost = async (post) => {
    try {
      setLoading(true);  // Show spinner
      await deletePost(post);  // Attempt to delete the post
      setLoading(false);  // Stop spinner after success
      closePopover();  // Close popover after deletion
      window.location.reload();

      return toast({
        title: 'Post Deleted',
        description: 'Your post has successfully been deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.log(error);
      setLoading(false);  // Stop spinner after failure
      closePopover();  // Close popover after error
      return toast({
        title: 'Post Deletion Failed',
        description: 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="flex w-[60%] h-[600px] gap-[8px] border-[1px] shadow-xl p-4 m-4 bg-white flex-col rounded-lg">
      <div className="flex w-full flex-row h-[50px] justify-between items-center">
        <div className="flex flex-row">
          <Link to={`/profile/${post.creator.$id}`}>
            <Avatar 
              src={post.creator.imgURL} 
              alt="img" 
              className='w-[50px] h-[50px] rounded-full cursor-pointer'
            >
            </Avatar>
          </Link>
          <div className="flex items-start flex-col">
            <Link to={`/profile/${post.creator.$id}`}>
              <p className='font-bold'>{post.creator.name}</p>
              <p className='text-sm text-[#4b5563] opacity-50'>{post.creator.tag}</p>
            </Link>
          </div>
        </div>
        <div>
          <p>{getTimeAgo(post.$createdAt)}</p>
        </div>
      </div>
      <div className="w-full flex flex-col items-start">
        {
          fileType.includes('image') ? (
            <img
              src={post.imgURL}
              alt="post media"
              className="w-full h-[430px] z-10 object-cover rounded-md"
            />
          ) : (
            <video
              controls
              className="w-full h-[430px] z-10 object-cover rounded-md"
            >
              <source src={post.vidURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        }

        <h2 className="text-2xl font-semibold mt-2">{post.caption}</h2>
        <p className="text-gray-600 mt-1">{post.description}</p>

        <div className="mt-2 w-full h-max flex flex-row gap-2 justify-between items-center">
          <div className="flex flex-row gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 rounded-md text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-row gap-2 h-max justify-center items-center">
            <div className="flex rounded-full hover:bg-[#4b5563] hover:bg-opacity-20 p-2 w-max h-max">
              <FaCommentAlt size={25} className='cursor-pointer' onClick={navigateTocomments}/>
            </div>
            {
              userId === post.creator.$id && (
                <Popover 
                  isOpen={isOpen}
                  onClose={closePopover}
                  placement='bottom'
                  closeOnBlur={false}
                >
                  <PopoverTrigger>
                    <div className="flex rounded-full hover:bg-[#4b5563] hover:bg-opacity-20 p-2 w-max h-max">
                      {
                        loading ? (
                          <Spinner size="sm" />
                        ) : (
                          <FaTrash size={25} className='cursor-pointer' onClick={openPopover} />
                        )
                      }
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Confirmation</PopoverHeader>
                    <PopoverBody>Are you sure you want to delete this post?</PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-end">
                      <Button colorScheme="red" onClick={() => handleDeletePost(post)} isDisabled={loading}>
                        Yes
                      </Button>
                      <Button onClick={closePopover} ml={3}>
                        No
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
