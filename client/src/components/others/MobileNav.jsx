import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useRef } from 'react'
import { CiChat2 } from 'react-icons/ci'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdLogOut } from 'react-icons/io'
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/UserContext'
import { useChatClientContext } from '../../Contexts/ClientContext'

const MobileNav = ({toggleSidebar}) => {
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
        navigate('/Auth/Login');
      };
    

  return (
    <div className='w-[70px] h-screen bg-[#4b5563] fixed bg-opacity-10 flex-col hidden sidebar'>
      <div className="flex flex-col w-full items-center h-full gap-4 relative pt-6 p-2 sidebar-inner">
        <NavLink 
          to='/' 
          title='Home' 
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
          onClick={toggleSidebar}
        >
          <IoHomeOutline className='w-[50px] h-full px-2 py-[10px]' color='white' />
          <p className='titles hidden'>Home</p>
        </NavLink>

        <NavLink 
          to='/Chat' 
          title='Chats'
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
          onClick={toggleSidebar}
        >
          <CiChat2 className='w-[50px] h-full px-2 py-[10px]' color='white' />
          <p className='titles hidden'>Chat</p>
        </NavLink>

        <NavLink 
          to={`/profile/${userDetails.id}`} 
          title='Profile'
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
          onClick={toggleSidebar}
        >
          <FaRegUserCircle className='w-[50px] h-full px-2 py-[10px]' color='white' />
          <p className='titles hidden'>Profile</p>
        </NavLink>

        <NavLink 
          to='/Settings' 
          title='Settings'
          className={({ isActive }) => 
            `flex rounded-md items-center justify-center hover:bg-[#4b5563] hover:bg-opacity-15 navlinks ${isActive ? 'bg-[#4b5563] bg-opacity-15' : ''}`
          }
          onClick={toggleSidebar}
        >
          <IoSettingsOutline className='w-[50px] h-full px-2 py-[10px]' color='white' />
          <p className='titles hidden'>Settings</p>
        </NavLink>

        <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initRef} >
          <PopoverTrigger>
            <div 
              title='Logout' 
              className="flex cursor-pointer rounded-md items-center w-[80%] h-max hover:bg-[#4b5563] hover:bg-opacity-15 navlinks justify-center absolute bottom-6 logout-btn flex-row"
              onClick={onOpen}
            >
              <IoMdLogOut className='w-[50px] h-full px-2 py-[10px]' color='red' />
              <p className='titles hidden'>Logout</p>
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
  )
}

export default MobileNav