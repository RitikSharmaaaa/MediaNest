import { useState } from 'react'
import Signup from './components/Signup'
import { BrowserRouter, createBrowserRouter, Route, Routes, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import { LogIn } from 'lucide-react'
import Login from './components/Login'
import EditProfile from './components/EditProfile'
// import { Route } from 'lucide-react'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/profile/:id',
        element:<Profile/>
      },
      {
        path:'account/edit',
        element:<EditProfile/>
      }
    ]
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  }
])

function App() {
  const [count, setCount] = useState(0);


  return (


      <>
        <RouterProvider router={browserRouter}/> 
      </>
      

  )
}

export default App
