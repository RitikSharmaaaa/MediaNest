import React, { use, useState } from 'react';
import { User, Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';


export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });



  const [isLoding,setIsLoding] = useState(false);

  const navigate  = useNavigate();
  const dispatch = useDispatch();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
          setIsLoding(true);
    const response = await axios.post('http://localhost:9000/user/register', formData,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log(response);
    if(response.data.success){
       toast(response.data.message);
        // Redirect to login page or home page after successful signup
        dispatch(setAuthUser(response.data.user));
        navigate('/');
       
    }
    // Optionally reset the form:
    setFormData({ username: '', email: '', password: '' });

  } catch (error) {
    toast(error.response.data.message);
    console.error('Signup failed:', error.response?.data || error.message);
  }
  finally{
    setIsLoding(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Sign Up</h2>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <User className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full bg-transparent focus:outline-none text-gray-900"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <Mail className="text-gray-500 mr-2" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full bg-transparent focus:outline-none text-gray-900"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <Lock className="text-gray-500 mr-2" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full bg-transparent focus:outline-none text-gray-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition duration-200"
        >
          Create Account
        </button>
        <div className='text-center'>
          Already have an account <Link className="text-blue-600" to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}
