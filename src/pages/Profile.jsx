import React, { useContext, useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { AvatarBadge, Avatar, TabList, Tab, TabPanels, TabPanel, Tabs, Spinner } from '@chakra-ui/react';
import { getUserPosts } from '../lib/AppriteFunction';
import UserPostCard from '../components/PostComponents/UserPostCard';
import useUserStatus from '../hooks/useUserStatus';
import { useNavigate, useParams } from 'react-router-dom';
import './index.scss'
import { UserContext } from '../Contexts/UserContext';
import { CiEdit } from "react-icons/ci";
import EditProfileForm from '../components/others/EditProfileForm';


const Profile = () => {
    const { userID } = useParams();
    const { client } = useChatContext();
    const [streamUser, setStreamUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [userPosts, setUserPosts] = useState([]);
    const { userDetails } = useContext(UserContext);
    const isOnline = useUserStatus(userID);
    const navigate = useNavigate() 

    useEffect(() => {
        const getCurrentUserPosts = async () => {
            if (userID) {
                try {
                    setLoading(true)
                    const posts = await getUserPosts(userID);
                    setUserPosts(posts);
                } catch (error) {
                    setLoading(false)
                    console.error('Error fetching user posts:', error);
                }finally{
                    setLoading(false)
                }
            }
        };

        const getCurrentUser = async () => {
            try {
                setLoading(true)
                const response = await client.queryUsers({ id: { $eq: userID } }, { limit: 1 });
                setStreamUser(response.users[0]);
                console.log(response.users[0])
            } catch (error) {
                setLoading(false)
                console.error('Error fetching Stream user:', error);
            }finally{
                setLoading(false)
            }
        };

        getCurrentUser();
        getCurrentUserPosts();
    }, [client, userID]);

    if(loading){
        return(
            <div className="w-full h-screen flex justify-center items-center">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className='w-full h-screen overflow-hidden'>
            {/* <EditProfileForm/> */}
                <div className="w-full h-max flex flex-col items-center justify-center">
                    <div className="flex w-[300px] h-max p-6 flex-col items-center justify-center relative ">
                        <Avatar
                            src={streamUser && streamUser.image}
                            size='2xl'
                            className='cursor-pointer'
                            title={streamUser && streamUser.name}
                        >
                            {isOnline && (
                                <AvatarBadge boxSize='1em' bg='green.500'/>
                            )}
                        </Avatar>
                        <div className="flex p-2 flex-col items-center justify-center">
                            <h3 className='text-xl font-bold p-1'>{streamUser && streamUser.name}</h3>
                            <p className='text-gray-400 text-center'>{streamUser && streamUser.tag}</p>
                            <div className='flex items-center justify-center'>
                                <p>{streamUser && streamUser.bio}</p>
                            </div>

                            <div 
                                className="flex absolute right-6 top-6 w-[40px] h-[40px] cursor-pointer hover:bg-gray-200 hover:rounded-full p-2" 
                                onClick={()=> navigate(`/Profile/edit/${userID}`)}
                            >
                                <CiEdit className='w-full h-full'/>
                            </div>
                        </div>
                        
                    </div>
                </div>

            <div className="w-full h-full p-2">
                <Tabs isFitted variant='enclosed'>
                    <TabList mb='1em'>
                        <Tab><p className='font-bold text-xl' title='user posts'>Posts</p></Tab>
                        <Tab><p className='font-bold text-xl' title='starred posts'>Starred</p></Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <div className="flex flex-wrap flex-row h-[500px] w-full p-2 gap-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray scrollbar-rounded">
                                {userPosts.length > 0 ? (
                                    userPosts.map((post, i) => (
                                        <UserPostCard post={post} key={i} />
                                    ))
                                ) : (
                                    <p>No posts available</p>
                                )}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <p>Starred posts will appear here.</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
