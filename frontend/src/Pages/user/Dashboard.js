import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import authContext from '../../Context/authContext';
import UserMenu from '../../Components/Layout/UserMenu';

const Dashboard = () => {
  const { auth, setAuth } = useContext(authContext);

  return (
    <Layout>
      <div className="flex h-screen bg-gray-300">

        <div className="w-1/6 border-r ">
          <UserMenu />
        </div>
        <div className="w-5/6 pl-8 text-xl font-Nunito bg-gradient-to-t from-gray-200 via-gray-300 to-gray-400">
          <h2 className="font-bold  my-8 py-1  border-red-600 border-2 w-fit rounded px-2 shadow-lg">User Information:</h2>

          <div className='mb-4'>
            <div className='name w-48 inline-block'>
              Admin Name :
            </div>
            <div className='w-fit inline-block'>
              {auth?.user?.name}
            </div>
          </div>

          <div className='mb-4'>
            <div className='email inline-block w-48 '>
              Email :
            </div>
            <div className='inline-block'>
              {auth?.user?.email}
            </div>
          </div>

          <div className='number mb-4'>
            <div className='inline-block w-48'>
              Contact Number:
            </div>
            <div className='inline-block'>
              {auth?.user?.phone}
            </div>
          </div>

          <div className='number mb-4'>
            <div className='inline-block w-48'>
              Address:
            </div>
            <div className='inline-block'>
              {auth?.user?.address}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
