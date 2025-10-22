import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Avatar,
  Select,
  useToast,
  Textarea,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Text,
} from "@chakra-ui/react";
import { IoMdArrowDropdown } from "react-icons/io";
import TextareaAutosize from "react-textarea-autosize";

const ShareToGroupModal = ({ post, onClose }) => {
  const { client } = useChatContext();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [customMessage, setCustomMessage] = useState(
    `📢 Shared Post: ${
      post.caption || "Check this out!"
    }\n🔗 http://localhost:3000/post/${post.$id}/details`
  );
  const toast = useToast();

  useEffect(() => {
    const fetchChannels = async () => {
      const filters = { type: "team", members: { $in: [client.user.id] } };
      const sort = [{ last_message_at: -1 }];
      const result = await client.queryChannels(filters, sort, {
        watch: true,
        state: true,
      });
      setChannels(result);
      console.log("data:", channels[0]?.data?.image);
    };

    fetchChannels();
  }, [client]);

  const handleShare = async () => {
    if (!selectedChannel) return;

    const attachments = post.imgURL
      ? [{ type: "image", image_url: post.imgURL }]
      : post.vidURL
      ? [{ type: "video", asset_url: post.vidURL }]
      : [];

    await selectedChannel.sendMessage({
      text: customMessage,
      attachments,
      isForwarded: true,
    });

    toast({
      title: "Post shared!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent _dark={{ bg: "#2d2d2d", color: "#41cc69}" }}>
        <ModalHeader color="#41cc69" fontWeight="bold">Share Post to Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} gap={2}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={
                <IoMdArrowDropdown className="text-primary font-bold text-2xl" />
              }
              w="full"
              mb={4}
              textAlign="left"
              borderColor="#41cc69"
              borderWidth="1px"
              backgroundColor="#ffff"
            >
              <p className="text-primary font-bold">
                {selectedChannel?.data?.name || "Select a Channel"}
              </p>
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              {channels.map((ch) => (
                <MenuItem
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  _hover={{ bg: "gray.100" }}
                >
                  <Flex align="center" gap={3}>
                    <Avatar src={ch.data.image} name={ch.data.name} size="sm" />
                    <Text>{ch.data.name || ch.id}</Text>
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Message Editor */}
          <Box
            as={TextareaAutosize}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write your message..."
            mb={4}
            p={3}
            border="1px solid #41cc69"
            borderRadius="md"
            w="100%"
            color="#41cc69"
            _focus={{
              outline: "none",
              boxShadow: "none",
              borderColor: "#41cc69",
            }}
          />

          {/* Preview */}
          {post.imgURL && (
            <Box
              mb={4}
              borderRadius="md"
              overflow="hidden"
              border="1px solid #eee"
            >
              <img src={post.imgURL} alt="Preview" style={{ width: "100%" }} />
            </Box>
          )}
          {post.vidURL && (
            <Box mb={4} borderRadius="md" overflow="hidden">
              <video
                src={post.vidURL}
                controls
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}

          {/* Share Button */}
          <Button
            colorScheme="green"
            isDisabled={!selectedChannel}
            onClick={handleShare}
            w="full"
          >
            Share
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareToGroupModal;
