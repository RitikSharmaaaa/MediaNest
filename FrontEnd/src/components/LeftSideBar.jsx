import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MoreHorizontal } from 'lucide-react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css'; // make sure to install this
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

import CreatePost from './CreatePost';
import { setAuthUser, setSuggestedUsers } from '@/redux/authSlice';
import { setPostUser, setSelectedPost } from '@/redux/postSlice';

const LeftSideBar = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const logOutHandler = async () => {
    try {
      const response = await axios.get('http://localhost:9000/user/logout', {
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPostUser([]));
        dispatch(setSelectedPost(null));

        dispatch(setSuggestedUsers([]));
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
    } else if (item.text === 'Create') {
      setOpen(true);
    }else if(item.text === 'Profile') {
      navigate(`/profile/${user.user?._id}`);
    }
    else if (item.text === 'Home') {
      navigate('/');
    }
     else {
      toast(`${item.text} clicked`);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 z-10 flex-col px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div className="flex flex-col">
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
        <CreatePost open={open} setOpen={setOpen} />
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-300 flex justify-around items-center h-14 shadow-inner">
        {/* First 4 items only (Home to Notification) */}
        {sideBarItems.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={() => submitHandler(item)}
            className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none"
            aria-label={item.text}
          >
            {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
          </button>
        ))}

        {/* Menu button for Create, Profile, Logout */}
        <Menu
          menuButton={
            <MenuButton className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none">
              <MoreHorizontal className="w-6 h-6" />
            </MenuButton>
          }
          transition
          direction="top"
          align="end"
          arrow
        >
          {sideBarItems.slice(5).map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => submitHandler(item)}
              className="text-sm px-2 py-1 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
};

export default LeftSideBar;
