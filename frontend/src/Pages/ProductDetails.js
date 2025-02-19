import React, { useEffect, useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import axios from 'axios';
import authContext from '../Context/authContext'
import { useCart } from '../Context/cartContext';
import toast from 'react-hot-toast';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';

const ProductDetails = () => {
    const [product, setProduct] = useState({});
    const param = useParams();
    const [cart, setCart] = useCart();
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

    useEffect(() => {
        if (param?.slug) getProduct();
    }, [param?.slug]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${param.slug}`);
            setProduct(data.product);
        } catch (error) {
            console.log("Error while getting single product in more details button");
        }
    };
    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-400" />
                ))}
                {halfStar && <FaStarHalfAlt className="text-yellow-400" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
                ))}
                <span className="text-gray-500 ml-2">({rating} / 5)</span>
            </div>
        );
    };

    return (
        <Layout>
            <div className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-semibold mb-8 ml-8 px-4 py-2 text-gray-800">Product Details</h1>
                <div className="flex flex-col lg:flex-row max-w-screen-xl w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                   
                    <div className="w-full lg:w-1/2 p-6 flex items-center justify-center bg-gray-200 border-r border-gray-300">
                        <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            className="max-w-full max-h-full object-cover"
                        />
                    </div>

                    <div className="w-full lg:w-1/2 p-8 bg-gray-50">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900">{product.name}</h1>
                        <p className="text-2xl text-red-600 font-semibold mb-4">Price: ₹{product.price}</p>

                        <div className="flex items-center mb-4">
                            {renderRatingStars(product.rating || 4.2)}
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">{product.description}</p>

                        <p className="text-sm text-gray-600 mb-4">Quantity: {product.quantity} units available</p>
                        {product.category && (
                            <p className="text-sm text-gray-600 mb-6">Category: {product.category.name}</p>
                        )}
                        <button
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition duration-200"
                            onClick={() => handleCartButton(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
