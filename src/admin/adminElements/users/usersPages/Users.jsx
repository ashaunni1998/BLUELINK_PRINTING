import React, { useEffect, useState } from 'react';


import Title from '../usersComponents/Title';
import TopBar from '../usersComponents/TopBar';
import UserDisplayTable from '../usersComponents/UserDisplayTable';
import BottomBar from '../usersComponents/BottomBar';

import { TAKE_USER_API } from '../../../apiServices/userApis'

function Users() {


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ currentPage: currentPage, pageSize: itemsPerPage, totalItems: 0, totalPages: 1 });

  // Filter users based on search term

  useEffect(() => {
    takeUserData()
  }, [currentPage, itemsPerPage, changed])


  const takeUserData = async () => {
    setLoading(true)
    try {
      const res = await TAKE_USER_API(currentPage, itemsPerPage);
      // console.log(20000, res);
      setUsers(res.users)
      setPagination(res.pagination)
    } catch (error) {
      // console.log(40000, error);

    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <Title />

        <TopBar
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          setUsers={setUsers}
          changed={changed} setChanged={setChanged} />

        {/* Proper Aligned Table */}

        <UserDisplayTable users={users} currentPage={currentPage}
          itemsPerPage={itemsPerPage} loadingTable={loading} />
        {/* Pagination */}
        <BottomBar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          sortedUsers={users}
          itemsPerPage={itemsPerPage}
          pagination={pagination} />


      </div>
    </div>
  );
}

export default Users;