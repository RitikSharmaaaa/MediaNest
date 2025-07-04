import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      setLoading(true);
      const response = await axios.post('http://localhost:9000/user/login', formData,{
        headers:{
          'Content-Type': 'application/json'
        },
        withCredentials:true
      });
      // console.log(response);
      if (response.data.success) {
        console.log(response.data.user);
        dispatch(setAuthUser(response.data.user));
        toast.success(response.data.message);
        navigate('/');
      }
      setFormData({ email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      console.error('Login failed:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">Log In</h2>

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

        {/* Submit Button */}
        {loading ? (
          <Button disabled className="w-full bg-blue-600 text-white py-2 rounded-md font-medium">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </Button>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Login
          </button>
        )}

        <div className="text-center">
          Don’t have an account?{' '}
          <Link className="text-blue-600" to="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
