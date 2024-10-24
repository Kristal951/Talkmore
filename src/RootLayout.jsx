import React, { useContext, useEffect, } from 'react';
import Sidebar from './components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from './Contexts/UserContext';
import { ChatClientProvider } from './Contexts/ClientContext'; 

const RootLayout = () => {
    const { setUserDetails } = useContext(UserContext);
    const navigate = useNavigate();

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
    }, [navigate, setUserDetails]);

    return (
        <ChatClientProvider>
            <div className="w-full h-screen">
                <Sidebar />
                <section className="flex flex-1 h-full ml-[70px]">
                    <Outlet />
                </section>
            </div>
        </ChatClientProvider>
    );
};

export default RootLayout;
