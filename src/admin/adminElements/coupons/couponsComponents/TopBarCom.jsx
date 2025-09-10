import React, { useState } from 'react'
import { Plus, Calendar, Tag, Users, Eye } from 'lucide-react';
import CouponsHandleModal from '../couponsModal/CouponsHandleModal';



function TopBarCom({setCoupons,topData}) {

    const [showModal, setShowModal] = useState(false);

    const handleAdd = () => {

        setShowModal(true);
    };

    return (
        <>
            <CouponsHandleModal showModal={showModal} editingCoupon={null} setShowModal={setShowModal} setCoupons={setCoupons} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
                        <p className="text-gray-600 mt-1">Create, manage and track your promotional coupons</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="inline-flex cursor-pointer items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Coupon
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Coupons</p>
                            <p className="text-2xl font-bold text-gray-900">{topData.totalCoupons}</p>
                        </div>
                        <Tag className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Active Coupons</p>
                            <p className="text-2xl font-bold text-green-600">{topData.activeCoupons}</p>
                        </div>
                        <Eye className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">All Coupons</p>
                            <p className="text-2xl font-bold text-purple-600">{topData.AllCoupons}</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Expired</p>
                            <p className="text-2xl font-bold text-red-600">{topData.expired}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-red-600" />
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default TopBarCom