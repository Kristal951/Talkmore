import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUp from './Auth/SignUp'
import Login from './Auth/Login'
import Home from './pages/Home'
import RootLayout from './RootLayout'
import { UserProvider } from './Contexts/UserContext'
import { ChakraProvider } from '@chakra-ui/react'
import CreatePostForm from './components/CreatePostForm'
import { ChatClientProvider } from './Contexts/ClientContext'
import ChatScreen from './pages/ChatScreen'

const App = () => {
  return (
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
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </ChakraProvider>
    </ChatClientProvider>
  )
}

export default App