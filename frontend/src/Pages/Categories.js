import React from 'react';
import useCategory from '../hooks/useCategory';
import Layout from '../Components/Layout/Layout';
import { NavLink } from 'react-router-dom';

export default function Categories() {
    const categories = useCategory();
    return (
        <Layout title="ALL Categories">
            <div className="min-h-screen flex items-center justify-center  p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                    {categories.map((c) => (
                        <NavLink
                            key={c.slug}
                            className="flex items-center justify-center border-2 border-gray-100 text-white font-semibold bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700 w-full h-32 rounded-lg text-xl shadow-lg hover:bg-gray-700 transition-all duration-200 ease-in-out overflow-hidden"
                            to={`/category/${c.slug}`}
                        >
                            <span className="text-center">{c.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
