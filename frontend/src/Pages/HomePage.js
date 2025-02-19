import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../Components/Layout/Layout'
import authContext from '../Context/authContext'
import { useCart } from '../Context/cartContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

import { MoonLoader } from 'react-spinners'


export default function HomePage() {
  const { auth } = useContext(authContext)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [totalP, setTotalP] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [cart, setCart] = useCart()
  const navigate = useNavigate()

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/categories`)
      if (data?.success) {
        setCategories(data.categories)
      }

    } catch (error) {
      console.log(error)
      console.log("Erroe in getting categories - Home Page")
    }
  }

  useEffect(() => {
    getCategories()
    getTotalCount()
  }, [])

  const getProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
      setLoading(false)
      if (data?.success) {
        setProducts(data.products)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      console.log("Erroe in getting products - Home Page")
    }
  }


  const handleFilter = (value, id) => {
    let all = [...checked]
    if (value) {
      all.push(id)
    } else {
      all = all.filter((c) => c !== id)
    }

    setChecked(all)
  }

  useEffect(() => {
    if (checked.length) filterProduct()
  }, [checked])

  useEffect(() => {
    if (!checked.length) getProducts()
  }, [checked.length])



  const filterProduct = async () => {
    try {
      setFilterLoading(true)
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/filter-product`, { checked })
      setFilterLoading(false)
      console.log(data)
      setProducts(data?.products)

    } catch (error) {
      console.log(error)
      console.log("Erroe in filtering Products - Home Page")
    }
  }

  const getTotalCount = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/total-count`)
      setTotalP(data?.total)
    } catch (error) {
      console.log(error)
    }

  }

  const loadMore = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
      setLoading(false)
      setProducts([...products, ...data?.products]);

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (page === 1) return
    loadMore()

  }, [page])

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
    <div>
      <Layout title={"Best Offers - ShopEase"}>
        {
          loading ? <div className='flex justify-center items-center h-screen'><MoonLoader color="#FF0200" size={45} /></div> : (
            <>
              <div className="container mx-auto bg-gray-100">
                <div className="flex min-h-screen">
                  <div className='relative  w-1/5  border-gray-300 shadow-md'>

                  <div className="flex flex-col sticky top-20  border-r ">
                    <div className="text-center text-2xl font-semibold font-Nunito pt-8 text-gray-800 ">
                      Filter By Category
                    </div>

                    <div className="flex flex-col mt-6 px-6">
                      {categories?.map((c) => (
                        <label key={c._id} className="flex items-center space-x-3 mb-3">
                          <input
                            type="checkbox"
                            onChange={(e) => handleFilter(e.target.checked, c._id)}
                            className="form-checkbox text-red-600 h-5 w-5 border-gray-400 focus:ring-red-500 focus:ring-2"
                          />
                          <span className="text-gray-700 text-lg">{c.name}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      className="bg-red-600 rounded-full px-4 py-2 mx-6 mt-6 text-white font-medium font-roboto shadow-md hover:bg-red-700 transition-all duration-200"
                      onClick={() => window.location.reload()}
                      >
                      Reset Filters
                    </button>
                      </div>
                  </div>




                  <div className="w-5/6 pt-8 bg-gradient-to-t from-gray-200 via-gray-300 to-gray-400 ">
                    {filterLoading ? (
                      <div className="flex justify-center items-center w-full h-64">
                        <MoonLoader color="#FF0200" size={45} />
                      </div>
                    ) : (
                      <div className="flex flex-wrap">
                        {products &&
                          products.map((p) => (
                            <div
                              key={p._id}
                              className="shadow-lg font-Nunito border-2 border-gray-300 rounded-sm overflow-hidden flex flex-col hover:translate-y-[-5px] transition duration-300 ease-in-out w-60 m-5 mx-6 "
                            >

                              <div className=" w-full h-56 overflow-hidden">
                                <img
                                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                  alt={p.name}
                                  className="w-full h-full object-cover  inset-0"
                                />
                                
                              </div>


                              <div className="bg-gray-300">

                                <div className="pt-2 pb-1 px-4 flex justify-between">

                                  <h2 className="text-gray-800 text-md">{p.name}</h2>

                                  <p className="text-red-500 font-semibold">₹ {p.price}</p>
                                </div>
                                <p className="pl-4 text-gray-700 text-sm">
                                  {p.description.length > 20 ? `${p.description.substring(0, 25)}...` : p.description}
                                </p>

                                <div className="flex justify-center">
                                  <button
                                    className="px-2 py-1 bg-red-600 rounded-tl rounded-br text-gray-200 mr-1 my-2"
                                    onClick={() => navigate(`/product-details/${p.slug}`)}
                                  >
                                    More Details
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-gray-900 rounded-bl rounded-br text-gray-200 my-2"
                                    onClick={() => handleCartButton(p)}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {!filterLoading && products && products.length < totalP && (
                      <button
                        className="bg-yellow-400 px-2 py-1 m-2 ml-4 rounded font-frek hover:bg-yellow-500 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                      >
                        {loading ? "Loading..." : "Load More"}
                      </button>
                    )}
                  </div>


                </div>
              </div>
            </>)
        }


      </Layout >
    </div >
  )
}

