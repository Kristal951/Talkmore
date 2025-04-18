import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostByID, getCommentsByPostID, addComment } from '../../lib/AppriteFunction';
import { UserContext } from '../../Contexts/UserContext';
import PostCommentCard from './CommentCard';
import { Avatar, Button, Spinner, useToast } from '@chakra-ui/react';
import './index.scss';

const PostComments = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const toast = useToast();
  const userId = userDetails.id;

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const fetchedPost = await getPostByID(postId);
        const fetchedComments = await getCommentsByPostID(postId);
        setPost(fetchedPost);
        setComments(fetchedComments.documents);
      } catch (error) {
        console.log('Error fetching post or comments:', error);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (content.trim()) {
      setLoading(true);
      try {
        const comment = await addComment({
          postId,
          userId,
          content
        });
        setComments([...comments, comment]);
        setContent('');
      } catch (error) {
        console.log('Error adding comment:', error);
        toast({
          title: "Unable to add comment",
          description: "There was an error posting your comment. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!post) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const fileType = post.mimeType;

  return (
    <div className="flex-row flex w-full max-h-screen gap-6 relative overflow-hidden post-comment-container">
      <div className="flex w-[50%] h-screen">
        <div className="flex w-full h-max gap-2 border shadow-xl p-4 m-4 bg-white flex-col rounded-lg">
          <div className="flex w-full flex-row h-[50px] justify-between items-center">
            <div className="flex flex-row">
              <Link to={`/profile/${post.creator.$id}`}>
                <Avatar
                  src={post.creator.imgURL}
                  alt="creator"
                  className="w-[50px] h-[50px] rounded-full"
                />
              </Link>
              <div className="flex items-start flex-col">
                <p className="font-bold">{post.creator.name}</p>
                <p className="text-sm text-[#4b5563] opacity-50">{post.creator.tag}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start">
            {fileType.includes('image') ? (
              <img
                src={post.imgURL}
                alt="post media"
                className="w-full h-[430px] z-10 object-cover rounded-md"
              />
            ) : (
              <video controls className="w-full h-[450px] z-10 object-cover rounded-md">
                <source src={post.vidURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <h2 className="text-2xl font-semibold mt-2">{post.caption}</h2>
            <p className="text-gray-600 mt-1">{post.description}</p>

            <div className="mt-2 w-full h-max flex flex-row gap-2 justify-between items-center">
              <div className="flex flex-row gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded-md text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[45%] justify-between h-screen absolute right-0 p-2">
        <div className="w-full max-h-[90%] overflow-y-auto">
          <h3 className="text-xl font-bold p-4">Comments</h3>
          {comments.length ? (
            <div className="flex flex-col gap-4 h-[90%] overflow-y-scroll p-2">
              {comments.map((comment, index) => (
                <PostCommentCard comment={comment} key={comment.$id || index} />
              ))}
            </div>
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>

        <div className="mt-4 w-full h-max flex gap-3 flex-row">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-[80%] p-2 border rounded-md"
            rows={1}
            placeholder="Add your comment"
          />
          <Button
            onClick={handleAddComment}
            variant="solid"
            disabled={loading}
            colorScheme='blue'
          >
            {loading ? <Spinner size="sm" /> : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
