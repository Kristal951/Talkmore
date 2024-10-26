import React, { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { AvatarBadge, Avatar, TabList, Tab, TabPanels, TabPanel, Tabs, Spinner } from '@chakra-ui/react';
import { getUserPosts } from '../lib/AppriteFunction';
import UserPostCard from '../components/PostComponents/UserPostCard';
import useUserStatus from '../hooks/useUserStatus';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { userID } = useParams();
    const { client } = useChatContext();
    const [streamUser, setStreamUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [userPosts, setUserPosts] = useState([]);
    const isOnline = useUserStatus(userID); // Use custom hook to check online status

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
                console.log(streamUser);
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
            {streamUser && 
                <div className="w-full h-max flex flex-col items-center justify-center relative">
                    <div className="flex w-max h-max p-6 flex-col items-center justify-center">
                        <Avatar
                            src={streamUser.image}
                            size='lg'
                            className='cursor-pointer'
                            title={streamUser.name}
                        >
                            {isOnline && (
                                <AvatarBadge boxSize='1.25em' bg='green.500'/>
                            )}
                        </Avatar>
                        <h3 className='text-xl font-bold p-1'>{streamUser.name}</h3>
                        <p className='text-gray-400'>{streamUser.tag}</p>
                    </div>
                </div>
            }

            <div className="w-full h-full p-6">
                <Tabs isFitted variant='enclosed'>
                    <TabList mb='1em'>
                        <Tab><p className='font-bold text-xl' title='user posts'>Posts</p></Tab>
                        <Tab><p className='font-bold text-xl' title='starred posts'>Starred</p></Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <div className="flex flex-row h-max w-full gap-8 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray scrollbar-track-gray scrollbar-rounded">
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
