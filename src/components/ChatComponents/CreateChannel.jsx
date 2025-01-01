import React, { useState, useCallback } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import UserList from "./UserList";
import { useChatContext } from "stream-chat-react";
import { useDropzone } from "react-dropzone";
import { MdCancel, MdFileUpload } from "react-icons/md";
import { getfilePrev, getFileUrl, uploadFile } from "../../lib/AppriteFunction";
import { useNavigate } from "react-router-dom";

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [channelName, setChannelName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([client.userID || ""]);
  const [channelImage, setChannelImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setChannelImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const navigateBack = () => {
    setIsCreating(false)
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".svg", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mpeg", ".mkv"],
    },
  });

  const createChannel = async () => {
    setIsLoading(true)
    if (createType === "team" && !channelName) {
      return toast({
        title: "Input Channel Name",
        description: "Please make sure to enter a name for your channel.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }

    if (selectedUsers.length < 2) {
      return toast({
        title: "Select at least more than one User",
        description: "Please select at least one more user to create a channel",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
      let fileUrl = "";

      if (channelImage) {
        const uploadedFile = await uploadFile(channelImage);
        fileUrl = await getfilePrev(uploadedFile.$id);
      }

      const newChannel = client.channel(createType, {
        name: channelName || "Untitled Channel",
        members: selectedUsers,
        image: fileUrl || "",
      });

      await newChannel.create();

      setActiveChannel(newChannel);

      setChannelName("");
      setSelectedUsers([client.userID || ""]);
      setChannelImage(null);
      setImagePreview(null);
      setIsCreating(false);

      setIsLoading(false)

      return toast({
        title: "Channel Created",
        description:
          "Your channel has been created successfully, happy chatting!!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    
    } catch (error) {
      console.error("Error creating channel:", error);
      setIsLoading(false)
      return toast({
        title: "Something Went Wrong",
        description: "Failed to create the channel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-full h-screen dark:bg-darkBackground bg-white overflow-y-scroll ">
      <div className="flex items-center dark:bg-darkBackground2 justify-between p-4 shadow-md bg-white z-50 ">
        <p className="capitalize font-bold text-xl text-blue-600 dark:text-white">
          {createType === "team" ? "Create a new channel" : "Send a direct message"}
        </p>
        <MdCancel
          className="w-8 h-8 cursor-pointer text-blue-600 dark:text-white"
          onClick={navigateBack}
        />
      </div>
      <div className="p-4 gap-4">
        {createType === "team" && (
          <div className="space-y-6">
            <InputGroup>
              <InputLeftAddon>Name</InputLeftAddon>
              <Input
                variant="outline"
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </InputGroup>

            <div {...getRootProps()} className="w-full">
              <input {...getInputProps()} />
              <div className="border-dashed border-2 dark:bg-darkBackground2 border-gray-300 rounded-lg flex items-center justify-center h-56">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <MdFileUpload className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500">
                      Drag and drop an image here, or click to select
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="font-bold text-xl">Add members</p>

            <UserList
              setSelectedUser={setSelectedUsers}
              selectedUser={selectedUsers}
            />
            
            <Button
              colorScheme="blue"
              className="w-full p-2"
              onClick={createChannel}
            >
              {createType === "team" ? "Create Channel" : "Create Message Group"}
              {isLoading && <Spinner ml="2"/>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChannel;
