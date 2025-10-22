import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { UserProvider } from "./Contexts/UserContext";
import { ChatClientProvider } from "./Contexts/ClientContext";
import { VideoClientProvider } from "./Contexts/VideoClientContext";

import AuthLayout from "./Auth/AuthLayout";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

import RootLayout from "./RootLayout";
import Home from "./pages/Home";
import ChatScreen from "./pages/ChatScreen";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VideoCallScreen from "./pages/VideoCallScreen";
import AudioCallScreen from "./pages/AudioCallScreen";

import CreatePostForm from "./components/PostComponents/CreatePostForm";
import PostComments from "./components/PostComponents/PostComments";
import PostDetails from "./components/PostComponents/PostDetails";
import PostCard from "./components/PostComponents/PostCard";
import EditProfileForm from "./components/others/EditProfileForm";
import CreateChannel from "./components/ChatComponents/CreateChannel";
import ChannelInfo from "./components/ChatComponents/ChannelInfo";
import Index from "./components/Notifications/Index";
import { HelmetProvider } from "react-helmet-async";
import ProfileQRCode from "./components/others/ProfileQRCode";
import ChatContainer from "./components/ChatComponents/ChatContainer";
import { ChatUIProvider } from "./Contexts/ChatContext";

const App = () => {
  return (
    <HelmetProvider> 
      <ChatUIProvider>
      <VideoClientProvider>
        <ChatClientProvider>
          <ChakraProvider>
            <UserProvider>
              <Router>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/Auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to="SignUp" replace />} />
                    <Route path="Login" element={<Login />} />
                    <Route path="SignUp" element={<SignUp />} />
                  </Route>

                  {/* Main Application */}
                  <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="CreatePost" element={<CreatePostForm />} />

                    <Route path="Chat" element={<ChatScreen />}>
                      <Route path=":CID" element={<ChatContainer />} />
                      <Route path="createChannel" element={<CreateChannel />} />
                      <Route path=":CID/Info" element={<ChannelInfo />} />
                    </Route>

                    <Route
                      path="post/:postId/comments"
                      element={<PostComments />}
                    />
                    <Route
                      path="post/:postId/details"
                      element={<PostDetails />}
                    />
                    <Route path="post/:postId" element={<PostCard />} />

                    <Route path="profile/:userId" element={<Profile />} />
                    <Route
                      path="Profile/edit/:userId"
                      element={<EditProfileForm />}
                    />
                    <Route
                      path="Profile/notifications/:userId"
                      element={<Index />}
                    />
                    <Route
                      path="Profile/QRCode/:userId"
                      element={<ProfileQRCode />}
                    />
                    <Route
                      path="VideoCall/:callID"
                      element={<VideoCallScreen />}
                    />
                    <Route
                      path="AudioCall/:callID"
                      element={<AudioCallScreen />}
                    />

                    {/* Utility */}
                    <Route path="Search/:query" element={<Search />} />
                    <Route path="Settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Router>
            </UserProvider>
          </ChakraProvider>
        </ChatClientProvider>
      </VideoClientProvider>
      </ChatUIProvider>
    </HelmetProvider>
  );
};

export default App;
