import React, { useContext, useState } from 'react'
import Layout from '../Components/Layout/Layout'
import searchContext from '../Context/searchContext'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../Context/cartContext'
import authContext from '../Context/authContext'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'

export default function Search() {
  const { values, setValues } = useContext(searchContext)
  const navigate = useNavigate()
  const [cart, setCart] = useCart()
  const { auth } = useContext(authContext)

  
  const handleCartButton = async (p) => {
   
    try {
        const token = auth.token;
        if (!token) {
            toast.error('User is not authenticated');
            return;
        }
        
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token');
            return;
        }

        const cartItems = cart || [];
        const itemExists = cartItems.some(item => item._id === p._id);


        if (itemExists) {
            toast.success('Item already in the cart');
            return;
        }


        const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/product/addToCart`,
            { productId: p._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(response)

        if (response.data.success) {
          localStorage.setItem('cart', JSON.stringify([...cart, p]))
          setCart([...cart, p]);
            toast.success('Item added to Cart Successfully');
        } else {
            toast.error(response.data.message || 'Failed to add item to the cart');
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error('Error adding item to cart');
    }
};

  return (
    <Layout>
      <div className="border-2 shadow-lg text-lg m-8 w-fit px-2 py-1 border-red-600 rounded font-bold font-Nunito">
        {values?.result.length < 1 ? "No Result Found" : `Found Results : ${values.result.length} `}
      </div>
      <div className='flex flex-wrap '>
        {
          values?.result && values?.result.map((p) => (
            <div className="shadow-lg font-Nunito border-2 border-gray-300 rounded-sm overflow-hidden flex flex-col  hover:translate-y-[-5px] transition duration-300 ease-in-out w-60 s m-5 mx-6">
              {/* Product Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} className="w-full h-full object-cover absolute inset-0" />
              </div>

              {/* Product Details */}
              <div className="bg-gray-300">

                <div className="pt-2 pb-1 px-4 flex justify-between">
                  {/* Product Name */}
                  <h2 className="text-gray-800 text-md ">{p.name}</h2>

                  {/* Product Price */}
                  <p className="text-red-500 font-semibold">$ {p.price}</p>
                </div>
                <p className="pl-4 text-gray-700 text-sm">{p.description.length > 20 ? `${p.description.substring(0, 30)}...` : p.description}</p>

                {/* Buttons */}
                <div className='flex justify-center'>
                  <button className='px-2 py-1 bg-red-600 rounded-tl rounded-br  text-gray-200 mr-1 my-2' onClick={() => navigate(`/product-details/${p.slug}`)}>More Details</button>
                  <button className='px-2 py-1 bg-gray-900 rounded-bl rounded-br text-gray-200  my-2' onClick={() => handleCartButton(p)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))


        }
      </div>
    </Layout>
  )
}
