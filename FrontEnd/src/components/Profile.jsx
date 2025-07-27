import { Bookmark, Grid3X3, Heart, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import useGetProfile from '@/hooks/useGetProfile';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  useGetProfile(userId);

  const currentUser = useSelector((store) => store.auth.user);
  const userProfile = useSelector((store) => store.auth.userProfile) || {};

  const isOwnProfile = currentUser?._id === userProfile?._id;
  const [activeTab, setActiveTab] = useState('Posts');

  const getTabContent = () => {
    if (activeTab === 'Posts') {
      return userProfile.posts || [];
    } else if (activeTab === 'Saved') {
      return userProfile.bookmarks || [];
    }
    return [];
  };

  return (
    <div className="md:ml-[16%] px-4 md:px-10 max-w-6xl mx-auto pt-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <img
          src={
            userProfile.profilePicture ||
            'https://source.unsplash.com/300x300/?portrait'
          }
          alt="profile"
          className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
        />

        <div className="mt-4 md:mt-0 w-full">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h2 className="text-xl md:text-2xl font-semibold">
              {userProfile.username || 'Username'}
            </h2>

            {isOwnProfile ? (
              <>
                <Link to="/account/edit" >
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Edit Profile
                </button>
                </Link>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Ad Tools
                </button>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Archive
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                  {userProfile?.isFollowed ? 'Following' : 'Follow'}
                </button>
                <button className="px-4 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                  Message
                </button>
              </>
            )}
          </div>

          <div className="flex gap-8 text-sm md:text-base mb-2">
            <span>
              <strong>{userProfile.posts?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{userProfile.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{userProfile.followings?.length || 0}</strong> following
            </span>
          </div>

          <div className="text-sm md:text-base">
            <p className="font-medium">{userProfile.username}</p>
            <p className="text-gray-600">
              {userProfile.bio || 'This is a sample bio.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t mt-8 pt-4">
        <div className="flex justify-center gap-8 text-gray-500 text-sm md:text-base font-semibold">
          {['Posts', ...(isOwnProfile ? ['Saved'] : [])].map((tab) => {
            const Icon = tab === 'Posts' ? Grid3X3 : Bookmark;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1 cursor-pointer px-2 py-1 border-b-2 ${
                  activeTab === tab
                    ? 'text-black border-black'
                    : 'border-transparent hover:text-black'
                }`}
              >
                <Icon size={18} />
                <span>{tab}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {getTabContent().length > 0 ? (
          getTabContent().map((post, index) => (
            <div
              key={post._id || index}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 h-72 bg-white"
            >
              <img
                src={
                  post.image ||
                  'https://via.placeholder.com/500?text=Image+not+available'
                }
                alt={post.caption || `post-${index}`}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-xl"
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/500?text=Broken+Image';
                  e.target.classList.add('opacity-40');
                  console.error('Failed to load image:', post.image);
                }}
              />

              {/* Hover overlay button */}
              <div
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl cursor-pointer"
              >
                <button
                  type="button"
                  className="flex items-center gap-8 bg-black bg-opacity-60 text-white px-6 py-3 rounded-full font-semibold text-lg select-none"
                  onClick={() => {
                    // You can add click handler logic here if needed
                    console.log('Overlay clicked for post:', post._id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Heart size={24} />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={24} />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No {activeTab.toLowerCase()} to show.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
