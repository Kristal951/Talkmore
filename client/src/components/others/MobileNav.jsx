import {
  Avatar,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import { CiChat2 } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { useChatClientContext } from "../../Contexts/ClientContext";

const MobileNav = ({ toggleSidebar }) => {
  const { setUserDetails, userDetails } = useContext(UserContext);
  const { setChatClient, chatClient } = useChatClientContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initRef = useRef();

  const Logout = () => {
    localStorage.removeItem("appwritePayload");
    localStorage.removeItem("chakra-ui-color-mode");
    localStorage.removeItem("streamPayload");
    localStorage.removeItem("token");
    localStorage.removeItem("emoji-mart.frequently");
    localStorage.removeItem("emoji-mart.last");

    setUserDetails({
      id: "",
      name: "",
      tag: "",
      email: "",
      phoneNumber: "",
      imgUrl: "",
    });

    if (chatClient) {
      chatClient.disconnectUser();
    }
    setChatClient(null);
    navigate("/Auth/Login");
  };

  return (
    <div className="w-[70%] h-screen bg-white border-r-primary border-[2px] z-50 top-0 fixed bg-opacity-10 flex-col left-0 flex md:hidden">
      <div className="flex flex-col bg-white w-full items-start h-full gap-4 relative pt-6 p-2">
        <NavLink
          to="/"
          title="Home"
          className={({ isActive }) =>
            `flex rounded-md items-center w-full hover:bg-green-50 hover:bg-opacity-15 navlinks ${
              isActive ? "bg-green-50 font-bold" : ""
            }`
          }
          onClick={toggleSidebar}
        >
          <IoHomeOutline className="w-[50px] h-full px-2 py-[10px] text-primary" />
          <p className="titles text-primary text-base">Home</p>
        </NavLink>

        <NavLink
          to="/Chat"
          title="Chats"
          className={({ isActive }) =>
            `flex rounded-md items-center w-full hover:bg-green-50 hover:bg-opacity-15 navlinks ${
              isActive ? "bg-green-50 font-bold" : ""
            }`
          }
          onClick={toggleSidebar}
        >
          <CiChat2 className="w-[50px] h-full px-2 py-[10px] text-primary" />
          <p className="titles text-primary text-base">Chat</p>
        </NavLink>

        <NavLink
          to={`/profile/${userDetails.id}`}
          title="Profile"
          className={({ isActive }) =>
            `flex rounded-md items-center w-full hover:bg-green-50 hover:bg-opacity-15 navlinks ${
              isActive ? "bg-green-50 font-bold" : ""
            }`
          }
          onClick={toggleSidebar}
        >
          <FaRegUserCircle className="w-[50px] h-full px-2 py-[10px] text-primary" />
          <p className="titles text-primary text-base">Profile</p>
        </NavLink>

        <NavLink
          to="/Settings"
          title="Settings"
          className={({ isActive }) =>
            `flex rounded-md items-center w-full hover:bg-green-50 hover:bg-opacity-15 navlinks ${
              isActive ? "bg-green-50 font-bold" : ""
            }`
          }
          onClick={toggleSidebar}
        >
          <IoSettingsOutline className="w-[50px] h-full px-2 py-[10px] text-primary" />
          <p className="titles text-primary text-base">Settings</p>
        </NavLink>

        <div className="flex flex-row w-max h-max  absolute bottom-4 items-center">
          <div className="w-full flex justify-center">
            <Link
              to={`/profile/${userDetails?.id}`}
              className="flex items-centercursor-pointer"
              onClick={toggleSidebar}
            >
              <Avatar name={userDetails?.name} src={userDetails?.imgUrl} />
            </Link>
          </div>

          {/* Logout Button - Popover Trigger */}
          <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initRef}>
            <PopoverTrigger>
              <div
                title="Logout"
                className="flex cursor-pointer rounded-md items-center w-[80%] h-max hover:bg-green-50 navlinks"
                onClick={onOpen}
              >
                <IoMdLogOut
                  className="w-[50px] h-full px-2 py-[10px]"
                  color="red"
                />
                <p className="titles text-red-500">Logout</p>
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
    </div>
  );
};

export default MobileNav;
