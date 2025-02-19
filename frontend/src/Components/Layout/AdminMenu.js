import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import authContext from '../../Context/authContext';

const AdminMenu = () => {
  const { auth, setAuth } = useContext(authContext);
  const location = useLocation();

  return (
    <div className="flex flex-col w-full pt-2  bg-gray-300">
      {/* Header */}
      <h1 className="text-xl font-semibold pb-4 text-center text-gray-700 border-b border-gray-200">
        Admin Dashboard
      </h1>

      {/* Menu Items */}
      <NavLink
        to="/dashboard/admin"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/admin' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        Dashboard
      </NavLink>
      
      <NavLink
        to="/dashboard/admin/create-category"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/admin/create-category' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        Create Category
      </NavLink>

      <NavLink
        to="/dashboard/admin/create-products"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/admin/create-products' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        Create Products
      </NavLink>

      <NavLink
        to="/dashboard/admin/products"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out border-b border-gray-200
        ${location.pathname === '/dashboard/admin/products' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        All Products
      </NavLink>

      <NavLink
        to="/dashboard/admin/all-orders"
        className={`py-3 px-6 text-center text-gray-600 font-medium transition duration-200 ease-in-out rounded-b-lg
        ${location.pathname === '/dashboard/admin/all-orders' ? 'bg-red-600 text-white font-semibold border-l-4 border-red-800' : 'hover:bg-gray-100'}`}
      >
        All Orders
      </NavLink>
    </div>
  );
};

export default AdminMenu;
