import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  getCommentsByPostID,
  getPostByID,
} from "../../lib/AppriteFunction";
import PostCard from "./PostCard";
import { Spinner, Textarea, useToast } from "@chakra-ui/react";
import { UserContext } from "../../Contexts/UserContext";
import CommentCard from "./CommentCard";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setFetching(true);
      setError(null);
      try {
        const fetchedPost = await getPostByID(postId);
        const fetchedComments = await getCommentsByPostID(postId);

        if (!fetchedPost) {
          throw new Error("Post not found");
        }

        setPost(fetchedPost);
        setComments(fetchedComments?.documents || []);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
        setError("Failed to load post. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      setPosting(true);
      try {
        const newComment = await addComment({
          postId,
          userId,
          content: comment,
        });

        setComments((prev) => [...prev, newComment]);
        setComment("");

        toast({
          title: "Comment Added",
          description: "Your comment has been successfully posted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error adding comment:", error);
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setPosting(false);
      }
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center w-full justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 flex items-center w-full justify-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll p-2">
      <div className="flex w-[50%] h-full flex-col">
        <PostCard key={post.$id} post={post} />

        <div className="flex w-full flex-col h-max mt-4 p-1">
          <Textarea
            placeholder="Write a comment..."
            size="lg"
            rows={4}
            className="w-full focus:ring-1 ring-primary"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end items-center mt-2">
            <button
              type="submit"
              className="p-2 bg-primary text-white rounded-lg hover:scale-110 transition duration-300 disabled:opacity-50"
              onClick={handleAddComment}
              disabled={posting}
            >
              {posting ? "Commenting..." : "Comment"}
            </button>
          </div>
        </div>

        <div className="flex w-[80%] flex-col h-full">
          <h2 className="text-2xl font-bold mt-5 ml-2 mb-2 text-primary">
            Comments
          </h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.$id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 mt-2">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
