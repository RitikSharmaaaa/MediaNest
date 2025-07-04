import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp
} from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import CreatePost from './CreatePost'
import { setAuthUser } from '@/redux/authSlice';
import { setPostUser } from '@/redux/postSlice';



const LeftSideBar = () => {

  const [open,setOpen] = useState(false);

  const user = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const sideBarItems = [
    { icon: <Home className="w-5 h-5" />, text: 'Home' },
    { icon: <Search className="w-5 h-5" />, text: 'Search' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Explore' },
    { icon: <MessageCircle className="w-5 h-5" />, text: 'Message' },
    { icon: <Heart className="w-5 h-5" />, text: 'Notification' },
    { icon: <PlusSquare className="w-5 h-5" />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-3xl overflow-hidden">
          <AvatarImage src={user.user?.profilePicture} />
          <AvatarFallback className="bg-gray-200 text-sm">CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile'
    },
    { icon: <LogOut className="w-5 h-5" />, text: 'LogOut' }
  ];

  const navigate = useNavigate();


  const logOutHandler = async () => {
    try {
      const response = await axios.get('http://localhost:9000/user/logout', {
        withCredentials: true
      });

      console.log(response);
      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPostUser([]));
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const submitHandler = (item) => {
    if (item.text === 'LogOut') {
      logOutHandler();
    } 
    else if(item.text==='Create'){
      setOpen(true);
    }
    
    else {
      toast(`${item.text} clicked`);
      // You can navigate to specific pages here
      // if (item.text === 'Home') navigate('/');
    }

  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className='flex flex-col'>
        <h1 className='my-8 pl-3 font-bold text-xl' >LOGO</h1>
        <div>
          {sideBarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => submitHandler(item)}
              className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span className="text-gray-800 font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        

        <CreatePost open={open} setOpen={setOpen}/>

      </div>
    </div>
  );
};

export default LeftSideBar;
