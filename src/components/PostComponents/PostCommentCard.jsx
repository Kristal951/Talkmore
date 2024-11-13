import React, { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './index.scss'

const PostCommentCard = ({ comment }) => {
  const { userDetails } = useContext(UserContext);
  const { name, imgURL } = comment.creator; // Destructuring for cleaner code
  console.log(comment);

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

  return (
    <div className="flex flex-row pb-2 gap-2 post-comment-card">
      <Link to={`/profile/${comment.creator.$id}`}>
        <img 
          src={imgURL} //Todo: add fallback image uri
          alt={`${name}'s profile`} 
          className='cursor-pointer w-[50px] h-[50px] rounded-full'
        />
      </Link>
      <div className="flex flex-col bg-[#4b5563] max-w-[80%] bg-opacity-10 p-2 rounded-lg shadow-md">
        <p className="font-bold">{name}</p>
        <p className="text-gray-600">{comment.content}</p>
        
        {comment.$createdAt && (
          <p className="text-gray-500 text-[13px] p-[3px]">{getTimeAgo(comment.$createdAt)}</p>
        )}
        
      </div>
    </div>
  );
};

export default PostCommentCard;
