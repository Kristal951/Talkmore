import React, { useContext } from 'react';
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { CiChat2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { UserContext } from '../Contexts/UserContext';
import { useChatClientContext } from '../Contexts/ClientContext';
import './index.css';

const Sidebar = () => {
  const { setUserDetails } = useContext(UserContext);
  const { setChatClient , chatClient} = useChatClientContext();
  const navigate = useNavigate()

  const Logout=()=>{
    localStorage.removeItem('appwritePayload')
    localStorage.removeItem('chakra-ui-color-mode')
    localStorage.removeItem('streamPayload')
    localStorage.removeItem('token')
    localStorage.removeItem('emoji-mart.frequently')
    localStorage.removeItem('emoji-mart.last')

    setUserDetails({
      id: '',
      name: '',
      tag: '',
      email: '',
      phoneNumber: '',
      imgUrl: '',
    });

    if(chatClient){
      chatClient.disconnectUser()
    }
    setChatClient(null)
    navigate('/Login')
  }

  return (
    <div className='w-[70px] h-screen bg-[#4b5563] fixed bg-opacity-10 flex flex-col'>
      <div className="flex flex-col w-full items-center h-full gap-4 relative pt-6 p-2">
        <NavLink 
          to='/' 
          title='Home' 
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <IoHomeOutline className='w-[50px] h-full px-2 py-[10px]' color='#2563eb' />
        </NavLink>

        <NavLink 
          to='/Chat' 
          title='Chats' 
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <CiChat2 className='w-[50px] h-full px-2 py-[10px]' color='#2563eb' />
        </NavLink>

        <NavLink 
          to='/Profile' 
          title='Profile' 
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <FaRegUserCircle className='w-[50px] h-full px-2 py-[10px]' color='#2563eb' />
        </NavLink>

        <NavLink 
          to='/Settings' 
          title='Settings' 
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <IoSettingsOutline className='w-[50px] h-full px-2 py-[10px]' color='#2563eb' />
        </NavLink>

        <div title='Logout' className="flex cursor-pointer rounded-md items-center w-[80%] h-max hover:bg-[#4b5563] hover:bg-opacity-15 justify-center absolute bottom-6">
          <IoMdLogOut 
            className='w-[50px] h-full px-2 py-[10px]' 
            color='red' 
            onClick={Logout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
