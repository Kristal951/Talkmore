import { Avatar } from "@chakra-ui/react";
import React from "react";

const SearchResultCard = ({ user }) => {
  return (
    <div className="flex w-full  p-2 items-center">
      <div className="flex w-full h-max">
        <Avatar
          name={user?.name}
          src={user?.imgURL}
          size="md"
        />

        <div className="flex flex-col gapp-1 p-2">
          <p className="font-bold text-primary text-[20px]">{user.name}</p>
          <p className="text-[15px] text-green-300">{user.tag}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
