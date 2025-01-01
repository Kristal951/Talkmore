import { IconButton } from "@chakra-ui/react";
import React from "react";
import { IoIosAddCircle } from "react-icons/io";

const AddChannelIcon = ({
  setCreateType,
  type,
  isExpanded,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
  onClick
}) => {

  const handleClick =()=>{
    setCreateType(type);
    setIsCreating((prev) => !prev);
    setIsEditing(false);
    if (setToggleContainer) {
      setToggleContainer((prev) => !prev);
    }
  }
  return (
    <IconButton
      icon={<IoIosAddCircle className="w-full h-full"/>}
      colorScheme="blue"
      onClick={handleClick}
      size="sm"
      p={1}
      marginRight="2"
    />
  );
};

export default AddChannelIcon;
