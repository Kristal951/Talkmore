import React, { useContext, useState } from "react";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import moment from "moment";
import useUserStatus from "../../hooks/useUserStatus";
import { FaTrash, FaCommentAlt, FaStar, FaRegStar } from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";

const CommentCard = ({ comment, onDelete, onReply }) => {
  const getTimeAgo = (createdAt) => moment(createdAt).fromNow();
  const isOnline = useUserStatus(comment?.creator?.$id);
  const { userDetails } = useContext(UserContext);
  const isCurrentUser = userDetails?.id === comment?.creator?.$id;

  // Like state (toggle between liked/unliked)
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex flex-col w-[60%] ml-2 border-b-2 border-gray-200">
      <div className="flex w-full h-max p-2 mt-4 flex-col hover:bg-green-50 cursor-pointer">
        <div className="flex flex-row">
          <Avatar
            src={comment?.creator?.imgURL || "/default-avatar.png"}
            alt={comment?.creator?.name || "User"}
            size="md"
          >
            {isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
          </Avatar>
          <div className="flex w-full flex-row gap-2 items-center">
            <h3 className="text-lg font-bold ml-2 text-primary">
              {comment?.creator?.name || "Unknown User"}
            </h3>
            <p className="text-green-400">
              {comment?.creator?.tag || "@anonymous"} • {getTimeAgo(comment.$createdAt)}
            </p>
          </div>
        </div>

        <div className="flex w-[90%] ml-12">
          <p className="text-primary mt-1">{comment.content}</p>
        </div>
      </div>

      {/* Actions: Delete, Reply, Like */}
      <div className="flex w-full p-2 justify-between items-center mt-2">
        {isCurrentUser && (
          <button
            onClick={() => onDelete(comment.$id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <FaTrash />
          </button>
        )}

        <button
          onClick={() => onReply(comment)}
          className="text-primary hover:text-blue-600 transition"
        >
          <FaCommentAlt />
        </button>

        {/* Toggle Like Button */}
        <button onClick={() => setIsLiked(!isLiked)} className="text-yellow-500">
          {isLiked ? <FaStar /> : <FaRegStar />}
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
