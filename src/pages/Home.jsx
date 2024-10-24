import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
    const { userDetails } = useContext(UserContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAllPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/post/getPosts', {
                timeout: 24000,
                timeoutErrorMessage: 'Error fetching Posts',
            });

            if (res.data && Array.isArray(res.data.posts.documents)) {
                setPosts(res.data.posts.documents);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAllPosts = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/post/getPosts', {
                    timeout: 24000,
                    timeoutErrorMessage: 'Error fetching Posts',
                });

                if (res.data && Array.isArray(res.data.posts.documents)) {
                    setPosts(res.data.posts.documents);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };
        getAllPosts();
    }, []);

    return (
        <div className='w-full h-screen'>
            <div className="w-full h-[60px] p-2 shadow-md z-[999] gap-6 bg-[#4b5563] bg-blend-saturation bg-opacity-10 left-[70px] flex fixed items-center flex-row top-0">
                <div className="flex w-[150px] h-[80%] border-[1px] border-black"></div>
                <div className="flex right-40 items-center justify-center absolute">
                    <Button colorScheme='blue' variant='solid' onClick={() => navigate('/CreatePost')}>
                        Create A Post
                    </Button>
                </div>
                <div className="flex w-2/5 gap-2 rounded-md bg-[#4b5563] p-2 relative left-16 flex-row bg-opacity-15 h-max justify-center items-center">
                    <div className="flex">
                        <FaSearch />
                    </div>
                    <input
                        type='search'
                        className='w-full rounded-md p-[3px] border-0 focus:outline-none'
                        placeholder='Search anything'
                    />
                </div>
                <div className="flex w-[50px] h-[50px] absolute right-20 cursor-pointer">
                    <img
                        src={userDetails?.imgUrl || '/default-profile.png'}
                        alt={userDetails ? `${userDetails.name}'s profile picture` : 'default profile pic'}
                        className='rounded-full w-full h-full'
                        title={userDetails.name}
                    />
                </div>
            </div>


            <div className="w-full h-full flex flex-col items-center justify-center">
                {error && (
                    <div className="flex flex-col items-center justify-center text-red-500">
                        <p>{error}</p>
                        <Button colorScheme="red" onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner size="xl" />
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className='text-xl font-bold'>No posts yet. Be the first to create a post!</p>
                        <Button colorScheme='blue' onClick={() => navigate('/CreatePost')}>Create A Post</Button>
                    </div>
                )}
                <div className="flex w-full overflow-y-scroll items-center pt-16 flex-col">
                    {!loading && posts.length > 0 && Array.isArray(posts) && posts.map((post) => (
                        <PostCard key={post.$id} post={post} />
                    ))}
                </div>
 
            </div>
        </div>
    );
};

export default Home;
