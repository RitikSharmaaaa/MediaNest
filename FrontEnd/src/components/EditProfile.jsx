import { setAuthUser } from '@/redux/authSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    bio: user.bio || '',
    gender: user.gender || '',
  });

  const [profileImage, setProfileImage] = useState(
    user.profilePicture || 'https://source.unsplash.com/300x300/?portrait'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('gender', formData.gender);
      if (selectedFile) {
        data.append('profilePicture', selectedFile);
      }

      const response = await axios.post(
        'http://localhost:9000/user/profile/edit',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate(`/profile/${response.data.user._id}`);
      } else {
        setErrorMsg('Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-gray-100 to-white py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <p className="font-medium text-gray-800">{user.username}</p>
            <label className="text-blue-500 text-sm cursor-pointer hover:underline">
              Change Profile Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bio */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            ></textarea>
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-full transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
