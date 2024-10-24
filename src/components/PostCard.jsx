import React, { useContext, useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { UserContext } from '../Contexts/UserContext';
import { deletePost } from '../lib/AppriteFunction';
import { Spinner, useToast } from '@chakra-ui/react';

const PostCard = ({ post }) => {

const [loading , setLoading] = useState(false)

const { userDetails } = useContext(UserContext);
const fileType = post.mimeType
const userId = userDetails.id
const toast = useToast()

const handleDeletePost=async(post)=>{
  try {
    setLoading(true)
    await deletePost(post)
    window.location.reload()

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
    return toast({
              title: 'Post Deletion Failed',
              description: 'Something went wrong.',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            });
  }
}

  return (
    <div className="flex w-[60%] h-auto gap-[8px] shadow-xl p-4 m-4 bg-white flex-col rounded-lg">
      <div className="flex w-full flex-row h-[50px] justify-start items-center">
        <div className="flex flex-row">
          <img 
            src={post.creator.imgURL} 
            alt="img" 
            className='w-[50px] h-[50px] rounded-full'
          />
          <div className="flex items-start flex-col">
            <p className='font-bold'>{post.creator.name}</p>
            <p className='text-sm text-[#4b5563] opacity-50'>{post.creator.tag}</p>
          </div>
        </div>
        <div>
          <p>{post.$createdAt}</p>
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
            className="w-full h-[450px] z-10 object-cover rounded-md"
          >
            <source src={post.vidURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

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
                <FaCommentAlt size={25} className='cursor-pointer'/>
              </div>
              {
                userId === post.creator.$id &&(
                  <div className="flex rounded-full hover:bg-[#4b5563] hover:bg-opacity-20 p-2 w-max h-max">
                    {
                      loading && (
                        <Spinner size="sm"/>
                      )
                    }
                    <FaTrash size={25} className='cursor-pointer' onClick={()=> handleDeletePost(post)}/>
                  </div>
                )
              }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
