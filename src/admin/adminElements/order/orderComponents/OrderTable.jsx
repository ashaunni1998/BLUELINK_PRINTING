
import { Package, Calendar } from 'lucide-react';

import { UPDATE_ORDER_STATUS_API } from '../../../apiServices/orderApi'
import ConfirmationModal from '../../../commonElements/ConformationModal'
import OrderViewModal from '../orderModal/OrderViewModal';

import { useState } from 'react';


function OrderTable({ orders, loading,setOrders }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [upLoading, setUpLoading] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [viewModal,setViewModal]=useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200';
            case 'shipped':
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200';
            case 'processing':
                return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200';
            case 'pending':
                return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200';
            case 'create':
                return 'bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 border-cyan-200';
            default:
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-400';
            case 'shipped':
                return 'bg-blue-400';
            case 'processing':
                return 'bg-yellow-400';
            case 'pending':
                return 'bg-purple-400';
            case 'cancelled':
                return 'bg-red-400';
            case 'create':
                return 'bg-cyan-400';
            default:
                return 'bg-gray-400';
        }
    };

    const formatOrderData = (order) => {
        return {
            id: order._id?.slice(-8) || 'N/A', // Show last 8 characters of _id
            fullId: order._id,
            customerName: order.user?.firstName + " " + order.user?.lastName || 'N/A',
            customerEmail: order.user?.email || 'N/A',
            totalAmount: order.totalPrice || 0,
            orderDate: order.createdAt,
            status: order.status || 'Unknown',
            paymentMethod: order.paymentMethod || 'Not specified',
            itemsCount: order.orderItems?.length || 0,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered
        };
    };

    const updateStatus = (order) => {

        setSelectedOrder(order);
        if (order.status == "Processing") {
            setNewStatus("Shipped");
            setIsModalOpen(true);
        } else if (order.status == "Shipped") {
            setNewStatus("Delivered");
            setIsModalOpen(true);
        }

    };

    const handleConfirmUpdate = async () => {
        setUpLoading(true);
        try {
           await UPDATE_ORDER_STATUS_API(selectedOrder._id, newStatus);
             
           setOrders((prevOrders) =>{
            return prevOrders.map((ord) => {
                if (ord._id === selectedOrder._id) {
                    return { ...ord, status: newStatus };
                }
                return ord;
            });
           })
            setSelectedOrder(null);
            
            setIsModalOpen(false)
        } catch (error) {
            console.log('Error updating order status:', error);
            
        }finally{
            setUpLoading(false);
        }
    };

    const handleCancelUpdate =async () => {
        
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ConfirmationModal
                    title="Update Order Status"
                    message={`Are you sure you want to update the order status to "${newStatus}"?`}
                    type="success"
                    confirmText="Yes, Update"
                    isOpen={isModalOpen}
                    onConfirm={handleConfirmUpdate}
                    onCancel={handleCancelUpdate}
                    loading={upLoading}
                />
                {viewModal && <OrderViewModal setViewModal={setViewModal} viewModal={viewModal} selectedOrderId={selectedOrder._id}/>}
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full min-w-[800px]">
                        {/* Table Header */}
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="px-3 sm:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                    <div className="flex items-center gap-2">
                                        <span className="hidden sm:inline">Order ID</span>
                                        <span className="sm:hidden">ID</span>
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                    <div className="flex items-center gap-2">
                                        Customer
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                    <div className="flex items-center gap-2">
                                        Amount
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800 hidden md:table-cell">
                                    <div className="flex items-center gap-2">
                                        <span className="hidden lg:inline">Order Date</span>
                                        <span className="lg:hidden">Date</span>
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                    <div className="flex items-center gap-2">
                                        Status
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left font-medium hover:text-red-600 text-blue-800 hidden lg:table-cell">
                                    <span className="hidden xl:inline">Payment Status</span>
                                    <span className="xl:hidden">Payment</span>
                                </th>
                                <th className="px-3 sm:px-6 py-4 text-left font-medium hover:text-red-600 text-blue-800">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 border-b border-gray-100">
                            {loading ? (
                                <>
                                    <tr>
                                        <td colSpan="7" className="px-2 sm:px-4 lg:px-6 py-8 sm:py-12 text-center">
                                            <div className="text-gray-400 mb-2">
                                                <Package className="w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 mx-auto animate-spin opacity-50" />
                                            </div>
                                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium">Loading Orders...</p>
                                        </td>
                                    </tr>
                                </>
                            ) : (<>
                                {orders && orders.length > 0 ? (
                                    orders.map((order, index) => {
                                        const formattedOrder = formatOrderData(order);
                                        return (
                                            <tr
                                                key={formattedOrder.fullId || index}
                                                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                            >
                                                {/* Order ID */}
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                                                #{formattedOrder.id}
                                                            </div>
                                                            <div className="text-xs text-gray-500 hidden sm:block">
                                                                {formattedOrder.itemsCount} {formattedOrder.itemsCount === 1 ? 'item' : 'items'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-gray-800 text-sm sm:text-base truncate">
                                                                {formattedOrder.customerName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 max-w-[120px] sm:max-w-xs truncate hidden sm:block">
                                                                {formattedOrder.customerEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-semibold text-gray-800 text-sm sm:text-base">
                                                            {formatCurrency(formattedOrder.totalAmount)}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Order Date - Hidden on mobile */}
                                                <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-blue-500 hidden lg:block" />
                                                        <div className="text-gray-700 font-medium text-sm">
                                                            {formatDate(formattedOrder.orderDate)}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-3 sm:px-6 py-4">
                                                    <button onClick={() => updateStatus(order)}
                                                        className={`inline-flex cursor-pointer items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(formattedOrder.status)}`}>
                                                        <div className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${getStatusDotColor(formattedOrder.status)}`}></div>
                                                        <span className="hidden sm:inline">{formattedOrder.status}</span>
                                                        <span className="sm:hidden">{formattedOrder.status.charAt(0).toUpperCase()}</span>
                                                    </button>
                                                </td>

                                                {/* Payment Status - Hidden on smaller screens */}
                                                <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${formattedOrder.isPaid
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                                            }`}>
                                                            {formattedOrder.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                                        </span>
                                                        {formattedOrder.paymentMethod && (
                                                            <span className="text-xs text-gray-500 truncate">
                                                                {formattedOrder.paymentMethod}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <button onClick={()=>{setViewModal(true),setSelectedOrder(order)}}
                                                         className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 cursor-pointer hover:from-blue-200 hover:to-indigo-200 transition-all">
                                                            <span className="hidden sm:inline">View</span>
                                                            <span className="sm:hidden">👁</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="text-gray-400 mb-2">
                                                <Package className="w-8 h-8 sm:w-12 sm:h-12 mx-auto opacity-50" />
                                            </div>
                                            <p className="text-gray-500 font-medium text-sm sm:text-base">No orders found</p>
                                            <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default OrderTable