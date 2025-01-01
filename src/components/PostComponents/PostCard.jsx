import React, { useContext, useState, useEffect, useRef } from "react";
import { FaTrash, FaCommentAlt } from "react-icons/fa";
import { UserContext } from "../../Contexts/UserContext";
import { deletePost, likePost } from "../../lib/AppriteFunction";
import {
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  Avatar,
  AvatarBadge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Box,
  Text,
  Image,
  IconButton,
  Tag,
} from "@chakra-ui/react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import useUserStatus from "../../hooks/useUserStatus";
import unStarred from "../../assets/icons/unStarred.svg";
import Starred from "../../assets/icons/starred.svg";
import "./index.scss";

const PostCard = ({ post, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(post?.likes.map((user) => user.$id) || []);
  const [isLiked, setIsLiked] = useState(false);
  const { userDetails } = useContext(UserContext);
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const userId = userDetails?.id;
  const isOnline = useUserStatus(post.creator.$id);
  console.log(post)

  useEffect(() => {
    setIsLiked(likes.includes(userId));
  }, [likes, userId]);

  const getTimeAgo = (createdAt) => moment(createdAt).fromNow();

  const handleLikePost = async (e) => {
    e.stopPropagation();
    const updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];
    setLikes(updatedLikes);
    setIsLiked(!isLiked); // Optimistic UI update

    try {
      await likePost(post.$id, updatedLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Error",
        description: "Unable to update likes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await deletePost(post);
      onDelete(post.$id);
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Unable to delete post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToComments = () => {
    navigate(`/post/${post.$id}/comments`);
  };

  return (
    <Card
      className="post-card"
      boxShadow="lg"
      borderRadius="lg"
      p={2}
      m={2}
      width={{md:"60%", sm:"100%"}}
    
    >
      {/* Post Header */}
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={4}>
          <Link to={`/profile/${post.creator.$id}`}>
            <Avatar src={post.creator.imgURL} size="md">
              {isOnline && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>
          </Link>
          <Box>
            <Link to={`/profile/${post.creator.$id}`}>
              <Text fontWeight="bold">{post.creator.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {post.creator.tag}
              </Text>
            </Link>
          </Box>
        </Box>
        <Text fontSize="sm" color="gray.500">
          {getTimeAgo(post.$createdAt)}
        </Text>
      </CardHeader>

      {/* Post Media and Content */}
      <CardBody p={1}>
        {post.mimeType?.includes("image") && post.imgURL ? (
          <Image
            src={post.imgURL}
            alt="Post Media"
            borderRadius="lg"
            objectFit="cover"
            w="full"
            h="300px"
          />
        ) : post.mimeType?.includes("video") && post.vidURL ? (
          <Box
            as="video"
            ref={videoRef}
            controls
            w="full"
            h="300px"
            objectFit="cover"
            borderRadius="lg"
          >
            <source src={post.vidURL} type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        ) : (
          <Text fontStyle="italic" color="gray.500">
            Media not available
          </Text>
        )}

        <Text mt={4} fontSize="xl" fontWeight="semibold">
          {post.caption}
        </Text>
        <Text mt={2} color="gray.700">
          {post.description}
        </Text>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
            {post.tags.map((tag, idx) => (
              <Tag key={idx} colorScheme="gray">
                #{tag}
              </Tag>
            ))}
          </Box>
        )}
      </CardBody>

      {/* Post Footer */}
      <CardFooter
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={1}
      >
        <Box display="flex" alignItems="center" gap={4}>
          <Box
            display="flex"
            alignItems="center"
            bgColor="gray.100"
            padding="1"
            gap="1"
            borderRadius="md"
          >
            <IconButton
              onClick={handleLikePost}
              icon={
                <img
                  src={isLiked ? Starred : unStarred}
                  alt="Like Button"
                  className="w-8 h-8"
                />
              }
              aria-label="Like post"
              variant="ghost"
              padding="1"
            />
            <Text>{likes.length}</Text>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            bgColor="gray.100"
            padding="1"
            gap="1"
            borderRadius="md"
          >
            <IconButton
              onClick={navigateToComments}
              icon={<FaCommentAlt className="w-6 h-6 text-[#2563eb]" />}
              aria-label="Comment on post"
              variant="ghost"
            />
            <Text>{post?.comments.length}</Text>
          </Box>

          {userId === post.creator.$id && (
            <Popover>
              <PopoverTrigger>
                <IconButton
                  icon={<FaTrash className="w-6 h-6 text-[#2563eb]" />}
                  aria-label="Delete post"
                  variant="ghost"
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverBody>
                  Are you sure you want to delete this post?
                </PopoverBody>
                <PopoverFooter>
                  <Button
                    onClick={handleDeletePost}
                    colorScheme="red"
                    isLoading={loading}
                  >
                    Delete
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          )}
        </Box>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
