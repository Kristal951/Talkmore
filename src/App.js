import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUp from './Auth/SignUp'
import Login from './Auth/Login'
import Home from './pages/Home'
import RootLayout from './RootLayout'
import { UserProvider } from './Contexts/UserContext'
import { ChakraProvider } from '@chakra-ui/react'
import CreatePostForm from './components/PostComponents/CreatePostForm'
import { ChatClientProvider } from './Contexts/ClientContext'
import ChatScreen from './pages/ChatScreen'
import PostComments from './components/PostComponents/PostComments'
import Profile from './pages/Profile'
import { VideoClientProvider } from './Contexts/VideoClientContext'
import VideoCallScreen from './pages/VideoCallScreen'

const App = () => {
  return (
    <VideoClientProvider>
      <ChatClientProvider>
        <ChakraProvider>
          <UserProvider>
            <Router>
              <Routes>
                <Route>
                  <Route path='/Login' element={<Login/>}/>
                  <Route path='/SignUp' element={<SignUp/>}/>
                </Route>
                <Route element={<RootLayout/>}>
                  <Route index element={<Home/>}/>
                  <Route path='/CreatePost' element={<CreatePostForm/>}/>
                  <Route path='/Chat' element={<ChatScreen/>}/>
                  <Route path="/post/:postId/comments" element={<PostComments />} />
                  <Route path="/profile/:userID" element={<Profile/>} />
                  <Route path="/VideoCall/:callID" element={<VideoCallScreen/>} />
                </Route>
              </Routes>
            </Router>
          </UserProvider>
        </ChakraProvider>
      </ChatClientProvider>
    </VideoClientProvider>
  )
}

export default App