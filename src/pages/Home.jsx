import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import PostCard from '../components/PostComponents/PostCard';
import './index.scss'
import { IoMenuSharp } from "react-icons/io5";
import LOGO from '../assets/images/comp2.png'

const Home = () => {
   
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {userDetails} = useContext(UserContext)

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

    const handleDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
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

            <div className="w-full h-[60px] p-2 shadow-md gap-6 bg-[#4b5563] bg-opacity-10 backdrop-blur-lg border-[1px] border-[rgba(255,255,255,0.18)] left-[70px] flex fixed items-center flex-row top-0 topbar">
                {/* <div className="flex w-[300px] h-[100%] border-[1px] border-black logo-contianer"> */}
                <Link to="/" className='h-full'>
                    <img src={LOGO} alt="Logo" className='object-contain h-full'/>
                </Link>
                  
                {/* </div> */}
                
                <div className="flex right-40 items-center justify-center absolute create-post-btn-1">
                    <Button colorScheme='blue' variant='solid' onClick={() => navigate('/CreatePost')}>
                        Create A Post
                    </Button>
                </div>
                <div className="right-40 items-center justify-center absolute bg-blue-600 p-[5px] text-white rounded-md hidden create-post-btn">
                    <button onClick={() => navigate('/CreatePost')}>
                        Add Post
                    </button>
                </div>
                <div className="flex w-2/5 gap-2 rounded-md bg-white shadow-md p-2 relative left-16 flex-row h-max justify-center items-center searchbar">
                    <div className="flex">
                        <FaSearch />
                    </div>
                    <input
                        type='search'
                        className='w-full rounded-md bg-[#4b5563] bg-opacity-15 p-[5px] border-0 focus:outline-none'
                        placeholder='Search anything'
                    />
                </div>
                <div className="flex w-[50px] h-[50px] absolute right-20 cursor-pointer profile-img">
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
                <div className="flex w-full overflow-y-scroll gap-10 items-center pt-16 flex-col post-card-container">
                    {!loading && posts.length > 0 && Array.isArray(posts) && posts.map((post) => (
                        <PostCard key={post.$id} post={post} onDelete={handleDelete}/>
                    ))}
                </div>
 
            </div>
        </div>
    );
};

export default Home;
