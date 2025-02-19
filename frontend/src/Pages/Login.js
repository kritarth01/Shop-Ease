import React, { useContext, useState } from 'react';
import authContext from '../Context/authContext';
import { useCart } from '../Context/cartContext'; 
import Layout from '../Components/Layout/Layout';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { auth, setAuth } = useContext(authContext);
  const [cart, setCart] = useCart(); 

  const navigate = useNavigate();
  const location = useLocation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password });
      if (res && res.data.success) {
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem('auth', JSON.stringify(res.data));
        toast.success(res.data.message);
  
        setTimeout(() => {
          navigate(location.state || '/');
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  
  return (
    <Layout>
      <div className="register bg-gradient-to-t from-gray-200 via-gray-300 to-gray-400 pt-36 pb-36">
        <form onSubmit={handleSubmit} className="max-w-md shadow-black shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto bg-gray-600 text-white">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-300 appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-300 appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className='text-sm mt-1 mb-2 cursor-pointer' onClick={() => navigate("/resetPassword")}>
            Forgot password?
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold pb-2 pt-1 px-3 rounded focus:outline-none focus:shadow-outline shadow-black shadow-md"
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-center mt-2">
            Don't have an account? <Link to="/register" className='pl-2 text-red-600'>Register</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
