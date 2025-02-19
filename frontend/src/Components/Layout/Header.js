import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import authContext from '../../Context/authContext';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../Context/cartContext';
import axios from 'axios';

const Header = () => {
  const { auth, setAuth } = useContext(authContext);
  const [cart, setCart] = useCart();
  const categories = useCategory();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpencat, setDropdownOpencat] = useState(false);

  const fetchCartItems = async () => {
    try {
      const token = auth?.token;
      if (!token) return;

      const cartRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/getCartProducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });



      const cartItems = cartRes.data.cartItems || [];
      setCart(cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Could not fetch cart items');
    }
  };

  useEffect(() => {
    if (auth?.token) fetchCartItems();

  }, [auth?.token]);

  // console.log(cart)

  const handleLogout = () => {
    toast.success('Logged Out Successfully');
    setAuth({ ...auth, user: null, token: '' });
    setCart([]);
    localStorage.removeItem('auth');
    localStorage.removeItem('cart');
    setDropdownOpen(false);
  };

  return (
    <div className='sticky top-0 z-1000'>
      <header className="bg-gray-900 text-white p-4 pr-8 ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-dark-gray-900 mr-2"></div>
            <span className="text-xl font-anta">ShopEase<span className='text-red-500'>.</span></span>
          </div>

          <SearchInput />

          <nav className="space-x-10 relative font-roboto">
            <NavLink to="/" exact className={`relative cursor-pointer ${location.pathname === '/' && 'p-1 rounded border-b-2 border-red-500 text-white'}`} activeClassName="font-bold">
              Home
            </NavLink>
            {/* Other navigation items */}
            <NavLink
              to="/cart"
              className={`relative cursor-pointer ${location.pathname === '/cart' && 'p-1 rounded border-b-2 border-red-500 text-white'}`}
              activeClassName="font-bold"
            >
              Cart <span className="absolute -top-4 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                {cart?.length || 0}
              </span>
            </NavLink>
            {!auth.user ? (
              <>
                <NavLink to="/register" className={`relative cursor-pointer ${location.pathname === '/register' && 'p-1 rounded border-b-2 border-red-500 text-white'}`} activeClassName="font-bold">
                  Register
                </NavLink>
                <NavLink to="/login" className={`relative cursor-pointer ${location.pathname === '/login' && 'p-1 rounded border-b-2 border-red-500 text-white'}`} activeClassName="font-bold">
                  Login
                </NavLink>
              </>
            ) : (
              <div className="relative inline-block text-left">
                <NavLink
                  className={`relative cursor-pointer ${location.pathname.startsWith('/dashboard') && 'p-1 rounded border-b-2 border-red-500 text-white'}`}
                  activeClassName="font-bold"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {auth?.user?.name}
                  <div className={`${dropdownOpen ? 'rotate-180' : 'rotate-0'} transition-transform absolute -right-4 top-1 h-4 w-4 text-white group-hover:text-gray-400`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </NavLink>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" activeClassName="font-bold">
                        Dashboard
                      </NavLink>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
      <div className="bg-red-600 w-full h-1"></div>
    </div>
  );
};

export default Header;
