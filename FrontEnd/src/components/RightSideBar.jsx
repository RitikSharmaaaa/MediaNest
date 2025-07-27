import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const suggestedUsers = useSelector((store) => store.auth.suggestedUsers || []);
  console.log("Suggested Users:", suggestedUsers);

  return (
    <aside
      className="hidden xl:flex flex-col w-80 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto px-4"
      aria-label="Right Sidebar"
    >
      <div className="flex items-center justify-between mb-6">
        <Link to={`/profile/${user?._id}`} className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePicture}
              alt="your-avatar"
              className="rounded-full w-12 h-12 object-cover"
            />
            <div className="truncate">
              <p className="font-semibold text-sm truncate">{user?.username}</p>
            </div>
          </div>
        </Link>

        <button className="text-blue-500 font-semibold text-xs hover:opacity-70 whitespace-nowrap">
          Switch
        </button>
      </div>

      {/* Suggestions */}
      <section className="mb-6">
        <div className="flex justify-between mb-3 text-gray-500 text-sm font-semibold">
          <p>Suggested for you</p>
          <button className="hover:text-gray-800">See All</button>
        </div>
        <ul className="space-y-4">
          {suggestedUsers?.map((user, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${user?._id}`} className="flex items-center space-x-3">

                <img
                  src={user?.profilePicture || null } // Or user.profilePicture depending on your backend
                  alt={user.username}
                  className="rounded-full w-8 h-8 object-cover"
                />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{user?.username}</p>
                  
                </div>
                </Link>
              </div>
             
              <button className="text-blue-500 text-xs font-semibold hover:opacity-70 whitespace-nowrap">
                Follow
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-[10px] text-gray-400 leading-4">
        <p className="mb-1">
          About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language
        </p>
        <p>© 2025 INSTACLONE by Ritik</p>
      </footer>
    </aside>
  );
};

export default RightSideBar;
