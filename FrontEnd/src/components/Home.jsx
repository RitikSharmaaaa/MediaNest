import React from 'react';
import Feed from './Feed';
import RightSideBar from './RightSideBar';
import { Outlet } from 'react-router-dom';
import useGetAllPost from '@/hooks/useGetAllPost';

const Home = () => {
    useGetAllPost();
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSideBar />
        </div>
    )
};

export default Home;
