import { Wrap, WrapItem, Avatar, AvatarBadge } from "@chakra-ui/react";
import React, { useState } from "react";
import { InviteIcon } from "../../assets/icons/InviteIcon";

const UserItem = ({ user, selectedUser, setSelectedUser }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUser((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUser((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <div
      className={`flex flex-col items-center dark:bg-darkBackground w-full md:w-[200px] h-[250px] rounded-lg justify-between border p-4 shadow-md cursor-pointer ${
        selected ? "bg-gray-100" : "bg-white"
      }`}
      onClick={handleSelect}
    >
      <Wrap className="flex flex-col items-center">
        <WrapItem>
          <div className="gap-2 flex flex-col items-center">
            <Avatar
              src={user?.image}
              name={user?.name}
              size="lg"
            >
              {user?.online === "true" && (
                <AvatarBadge boxSize="1.10em" bg="green.500" />
              )}
            </Avatar>
            <p className="font-bold text-lg">{user.name}</p>
          </div>
        </WrapItem>
      </Wrap>
      {selected ? (
        <InviteIcon className="text-green-500" />
      ) : (
        <div className="w-[50px] h-[50px] border-[1px] rounded-full"></div>
      )}
    </div>
  );
};

export default UserItem;
