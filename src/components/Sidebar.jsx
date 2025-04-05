import React, { useContext, useRef } from 'react';
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { CiChat2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { UserContext } from '../Contexts/UserContext';
import { useChatClientContext } from '../Contexts/ClientContext';
// import './index.scss';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react';

const Sidebar = () => {
  const { setUserDetails, userDetails } = useContext(UserContext);
  const { setChatClient, chatClient } = useChatClientContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initRef = useRef();

  const Logout = () => {
    localStorage.removeItem('appwritePayload');
    localStorage.removeItem('chakra-ui-color-mode');
    localStorage.removeItem('streamPayload');
    localStorage.removeItem('token');
    localStorage.removeItem('emoji-mart.frequently');
    localStorage.removeItem('emoji-mart.last');

    setUserDetails({
      id: '',
      name: '',
      tag: '',
      email: '',
      phoneNumber: '',
      imgUrl: '',
    });

    if (chatClient) {
      chatClient.disconnectUser();
    }
    setChatClient(null);
    navigate('/Login');
  };

  return (
    <>
    <div className='w-[20%] h-screen bg-white dark:bg-darkBackground2 p-6 transition-colors fixed border-r-[1px] border-primary flex flex-col'>
      <div className="flex flex-col w-full items-start h-full gap-4 relative pt-6 p-2">
        <NavLink 
          to='/' 
          title='Home' 
          className={({ isActive }) => 
            `flex rounded-md items-center w-full justify-start hover:bg-[#4b5563] hover:bg-opacity-15 font-sans text-xl navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15 font-bold ' : ''}`
          }
        >
          <IoHomeOutline className='w-[50px] h-full px-2 py-[10px] text-primary'/>
          <p className='titles text-primary '>Home</p>
        </NavLink>

        <NavLink 
          to='/Chat' 
          title='Chats'
          className={({ isActive }) => 
            `flex rounded-md items-center w-full justify-start hover:bg-[#4b5563] hover:bg-opacity-15 text-xl navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <CiChat2 className='w-[50px] h-full px-2 py-[10px] text-primary'/>
          <p className='titles text-primary'>Chat</p>
        </NavLink>

        <NavLink 
          to={`/profile/${userDetails.id}`} 
          title='Profile'
          className={({ isActive }) => 
            `flex rounded-md items-center w-full justify-start hover:bg-[#4b5563] text-xl hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <FaRegUserCircle className='w-[50px] h-full px-2 py-[10px] text-primary'/>
          <p className='titles text-primary'>Profile</p>
        </NavLink>

        <NavLink 
          to='/Settings' 
          title='Settings'
          className={({ isActive }) => 
            `flex rounded-md items-center w-full justify-start hover:bg-[#4b5563] text-xl hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
        >
          <IoSettingsOutline className='w-[50px] h-full px-2 py-[10px] text-primary'/>
          <p className='titles  text-primary'>Settings</p>
        </NavLink>

        <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initRef} >
          <PopoverTrigger>
            <div 
              title='Logout' 
              className="flex cursor-pointer rounded-md items-center w-[80%] h-max hover:bg-[#4b5563] hover:bg-opacity-15 navlinks absolute bottom-6 logout-btn flex-row"
              onClick={onOpen}
            >
              <IoMdLogOut className='w-[50px] h-full px-2 py-[10px]' color='red' />
              <p className='titles text-primary'>Logout</p>
            </div>
          </PopoverTrigger>
          <PopoverContent style={{ zIndex: 9999 }}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Confirmation</PopoverHeader>
            <PopoverBody>Are you sure you want to logout?</PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end">
              <Button ref={initRef} colorScheme="blue" onClick={Logout}>
                Yes
              </Button>
              <Button variant="ghost" ml={3} onClick={onClose}>
                No
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </div>
   </>
  );
};

export default Sidebar;
