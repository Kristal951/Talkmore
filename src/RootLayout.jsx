import React, { useContext, useEffect, } from 'react';
import Sidebar from './components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from './Contexts/UserContext';
import {useChatClientContext } from './Contexts/ClientContext'; 
import { Chat } from 'stream-chat-react';
import { Spinner} from '@chakra-ui/react';

const RootLayout = () => {
    const { setUserDetails } = useContext(UserContext);
    const navigate = useNavigate();
    const { chatClient, isClientReady, error } = useChatClientContext();

    useEffect(() => {
        const payload = localStorage.getItem('appwritePayload');
        if (payload) {
            const user = JSON.parse(payload);

            setUserDetails({
                id: user.$id,
                name: user.name,
                tag: user.tag,
                email: user.email,
                phoneNumber: user.phoneNumber,
                imgUrl: user.imgURL,
            });
        } else {
            navigate('/Login');
        }

        if (isClientReady && chatClient) {
           return 
        }

        if (error) {
            console.error('Chat client error:', error);
        }
    }, [isClientReady, chatClient, error, navigate, setUserDetails]);

    if (error) {
        return(
            <div className='w-full h-screen flex justify-center items-center flex-col'>
                <h2 className='font-bold text-xl'>Something went wrong.</h2>
                <p>Please check your internet connection and try again</p>
            </div> 
        )
    }

    if (!isClientReady) {
        return <div className='w-full h-screen flex items-center justify-center'>
            <Spinner size="lg"/>
        </div>;
    }

    return (
            <Chat client={chatClient}>
                <div className="w-full h-screen">
                    <Sidebar />
                    <section className="flex flex-1 h-full ml-[70px]">
                        <Outlet />
                    </section>
                </div>
            </Chat>
    );
};

export default RootLayout;
