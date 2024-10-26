import { Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserPostCard = ({ post }) => {
    const navigate = useNavigate()

    const navigateTocomments=()=>{
        navigate(`/post/${post.$id}/comments`)
      }
  return (
    <Tooltip label={post.caption} hasArrow openDelay={300} bg="blue.600">
        <div className='w-[300px] h-[250px] rounded-md hover:scale-105 hover:rounded-md cursor-pointer transition-all duration-150 shadow-md border overflow-hidden'>
            {
                post.mimeType.startsWith('video') ? (
                    <video
                        src={post.vidURL}
                        className="w-full h-full object-cover"
                        controls
                        onClick={navigateTocomments}
                    />
                    ) : (
                    <img
                        src={post.imgURL}
                        alt="User Post"
                        className="w-full h-full object-cover"
                        onClick={navigateTocomments}
                    />
                )
            }
        </div>
    </Tooltip>
  );
}

export default UserPostCard;
