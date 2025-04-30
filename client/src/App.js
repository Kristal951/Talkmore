import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { UserProvider } from './Contexts/UserContext';
import { ChatClientProvider } from './Contexts/ClientContext';
import { VideoClientProvider } from './Contexts/VideoClientContext';

import AuthLayout from './Auth/AuthLayout';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';

import RootLayout from './RootLayout';
import Home from './pages/Home';
import ChatScreen from './pages/ChatScreen';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import VideoCallScreen from './pages/VideoCallScreen';
import AudioCallScreen from './pages/AudioCallScreen';

import CreatePostForm from './components/PostComponents/CreatePostForm';
import PostComments from './components/PostComponents/PostComments';
import PostDetails from './components/PostComponents/PostDetails';
import PostCard from './components/PostComponents/PostCard';
import EditProfileForm from './components/others/EditProfileForm';
import CreateChannel from './components/ChatComponents/CreateChannel';
import ChannelInfo from './components/ChatComponents/ChannelInfo';
import Index from './components/Notifications/Index';
import ProfileQRCode from './components/others/ProfileQRCode';

const App = () => {

  return (
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
                  
                  {/* Chat */}
                  <Route path="Chat" element={<ChatScreen />} />
                  <Route path="Chat/channel/:cid" element={<ChatScreen />} />
                  <Route path="Chat/createChannel" element={<CreateChannel />} />
                  <Route path="Chat/:channelID/Info" element={<ChannelInfo />} />

                  {/* Post */}
                  <Route path="post/:postId/comments" element={<PostComments />} />
                  <Route path="post/:postId/details" element={<PostDetails />} />
                  <Route path="post/:postId" element={<PostCard />} />

                  {/* Profile */}
                  <Route path="profile/:userId" element={<Profile />} />
                  <Route path="Profile/edit/:userId" element={<EditProfileForm />} />
                  <Route path="Profile/notifications/:userId" element={<Index />} />

                  {/* Calls */}
                  <Route path="VideoCall/:callID" element={<VideoCallScreen />} />
                  <Route path="AudioCall/:callID" element={<AudioCallScreen />} />

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
  );
};

export default App;
