import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import authContext from '../../Context/authContext';

const UserMenu = () => {
  const { auth, setAuth } = useContext(authContext);
  const location = useLocation();

  return (
    <div className="flex flex-col w-full pt-2 shadow-md bg-white">
      {/* Header */}
      <h1 className="text-xl font-semibold pb-4 text-center text-gray-700 border-b border-gray-200 ">
        User Dashboard
      </h1>

      {/* Menu Items */}
      <NavLink
        to="/dashboard/user"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/user' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        Dashboard
      </NavLink>
      
      <NavLink
        to="/dashboard/user/profile"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/user/profile' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        Update Profile
      </NavLink>
      
      <NavLink
        to="/dashboard/user/all-orders"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out 
        ${location.pathname === '/dashboard/user/all-orders' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        All Orders
      </NavLink>
    </div>
  );
};

export default UserMenu;
