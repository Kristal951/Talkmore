import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./Contexts/UserContext";
import { useChatClientContext } from "./Contexts/ClientContext";
import { Chat } from "stream-chat-react";
import { Spinner, useColorMode } from "@chakra-ui/react";
import "./index.scss";
import { IoMenuSharp } from "react-icons/io5";

import { MdOutlineCancel } from "react-icons/md";
import MobileNav from "./components/others/MobileNav";
import { jwtDecode } from "jwt-decode";

const RootLayout = () => {
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const { chatClient, isClientReady, error, setChatClient } =
    useChatClientContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const root = window.document.documentElement;
    if (colorMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorMode]);

  console.log(colorMode)

  const Logout = () => {
    localStorage.clear();
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
    navigate("/Login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/Login");
    }
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        Logout();
      }
    }

    const payload = localStorage.getItem("appwritePayload");
    if (payload) {
      const user = JSON.parse(payload);

      setUserDetails({
        id: user?.$id,
        name: user?.name,
        tag: user?.tag,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        imgUrl: user?.imgURL,
        Bio: user?.Bio,
      });
    } else {
      navigate("/Login");
    }

    if (isClientReady && chatClient) {
      return;
    }

    if (error) {
      console.error("Chat client error:", error);
    }
  }, [isClientReady, chatClient, error, navigate, setUserDetails]);

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col dark:bg-darkBackground">
        <h2 className="font-bold text-xl">Something went wrong.</h2>
        <p>Please check your internet connection and try again</p>
      </div>
    );
  }

  if (!isClientReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center dark:bg-darkBackground">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Chat 
      client={chatClient} 
      theme={`str-chat__theme-${colorMode}`}
    >
      <div className="w-full h-screen flex relative dark:bg-darkBackground">
        <div className="menu-icon cursor-pointer hidden">
          {isSidebarOpen ? (
            <MdOutlineCancel size={28} onClick={toggleSidebar} />
          ) : (
            <IoMenuSharp size={28} onClick={toggleSidebar} />
          )}
        </div>
        <div className="flex w-max h-max">
          {isSidebarOpen && <MobileNav toggleSidebar={toggleSidebar} />}
        </div>

        <Sidebar />

        <section className="flex flex-1 h-full section ml-[70px] overflow-hidden dark:bg-darkBackground">
          <Outlet />
        </section>
      </div>
    </Chat>
  );
};

export default RootLayout;
