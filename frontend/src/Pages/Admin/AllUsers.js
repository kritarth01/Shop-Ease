import React, { useContext } from 'react';
import Layout from '../../Components/Layout/Layout';
import AdminMenu from '../../Components/Layout/AdminMenu';

const AllUsers = () => {
  return (
    <Layout>
      <div className="grid grid-cols-3  h-screen gap-8">
        
        <div>
          <AdminMenu />
        </div>

        <div className="col-span-2 pAt-4">
          <h2>Users</h2>
        </div>
      </div>
    </Layout>
  );
};

export default AllUsers;
