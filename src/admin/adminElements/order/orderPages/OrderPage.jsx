import { useEffect, useState } from 'react';


import OrderTopBar from '../orderComponents/OrderTopBar';
import OrderTable from '../orderComponents/OrderTable'
import BottomBar from '../orderComponents/BottomBar';

import { ALL_ORDER_API } from '../../../apiServices/orderApi';

function OrdersPage() {

    const [orders,setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('');  
    const [pagination, setPagination] = useState({});

    useEffect(()=>{
      takeUsersOrders();
    },[itemsPerPage, currentPage, sort]);

   
    const takeUsersOrders = async () => {
        setLoading(true);
        try {
            const res=await ALL_ORDER_API(itemsPerPage, currentPage, sort);
            // console.log(1111,res.orderData.pagination);
            setPagination(res.orderData.pagination);
            setOrders(res.orderData?.data);
        } catch (error) {
            console.log('Error fetching orders:', error);
            
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
               
                 <OrderTopBar setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} sort={sort} setSort={setSort}/>
                {/* Proper Aligned Table */}

                <OrderTable orders={orders} loading={loading} setOrders={setOrders}/>
                
                <BottomBar currentPage={currentPage} setCurrentPage={setCurrentPage} orders={orders} itemsPerPage={itemsPerPage} pagination={pagination}/>
                
            </div>
        </div>
    );
}



export default OrdersPage;  