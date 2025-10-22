import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import PostCard from "../PostComponents/PostCard"; // Assuming you have a PostCard component

const SearchResultCard = ({ searchQuery = "", user, post, chat }) => {
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightMatch = (text) => {
    if (!text || !searchQuery) return text;

    const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-green-100 font-semibold">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  if (user) {
    return (
      <Link
        to={`/profile/${user.$id}`}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
      >
        <Avatar name={user.name} src={user.imgURL} size="sm" />

        <div className="flex flex-col w-max h-max">
          <div className="text-primary font-bold hover:underline text-[18px]">
            {highlightMatch(user.name || "Anonymous")}
          </div>
          <div className="text-green-300 dark:opacity-50">
            @{highlightMatch(user.tag || "")}
          </div>
        </div>
      </Link>
    );
  }

  if (post) {
    return (
      <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
        <PostCard post={post}/>
      </div>
    );
  }

  if (chat) {
    return (
      <div className="p-3 border flex items-center gap-2 rounded hover:bg-gray-50 cursor-pointer">
        <div className="font-bold">
          <Avatar name={chat.name} src={chat.image} size="sm" />
        </div>
        <div className="text-sm text-gray-600">
        <p>{highlightMatch(chat.name || "Unnamed Channel")}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchResultCard;
