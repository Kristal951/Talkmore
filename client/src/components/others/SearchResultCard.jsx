import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";

const SearchResultCard = ({ user, searchQuery = "" }) => {
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
  
    const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");
    const parts = text.split(regex);
  
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-green-50 font-bold animate-pulse">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <Link
      to={`/Profile/${user.$id}`}
      className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg"
    >
      <Avatar name={user.name} src={user.imgURL} size="md" />
      <div className="flex flex-col">
        <p className="text-primary font-bold">{highlightMatch(user.name)}</p>
        <p className="text-primary text-sm">@{highlightMatch(user.tag)}</p>
      </div>
    </Link>
  );
};

export default SearchResultCard;
