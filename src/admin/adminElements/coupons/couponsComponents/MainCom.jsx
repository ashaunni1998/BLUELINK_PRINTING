import { useState } from 'react'
import { Edit2, Trash2, Copy, Calendar, Tag, Percent, DollarSign } from 'lucide-react';
import CouponsHandleModal from '../couponsModal/CouponsHandleModal';
import { DELETE_COUPON } from '../../../apiServices/couponApi'
import ConfirmationModal from '../../../commonElements/ConformationModal';
import { toast } from 'react-toastify';



function MainCom({ coupons, setCoupons, loading }) {

    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [upLoading, setUpLoading] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState(null);

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setIsModalOpen(true);
        setSelectedCouponId(id);
       
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'disabled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const handleConfirmUpdate = async () => {
        setUpLoading(true)      
        try {
            await DELETE_COUPON(selectedCouponId);
            setCoupons((prev) => prev.filter((coupon) => coupon._id !== selectedCouponId));
            // console.log(2222,res);
            toast.success("Coupon deleted successfully")
            setIsModalOpen(false);
            
        } catch (error) {
            console.log(error);
            
        }finally{
            setUpLoading(false)
           
        }
    }
    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setSelectedCouponId(null);
    }

    return (
        <>
            <ConfirmationModal
                title="Delete Coupon"
                message="Are you sure you want to permanently delete this coupon? This action cannot be undone."
                type="danger"
                confirmText="Delete"
                isOpen={isModalOpen}
                onConfirm={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
                loading={upLoading}
            />
            <CouponsHandleModal showModal={showModal} editingCoupon={editingCoupon} setShowModal={setShowModal} setCoupons={setCoupons} />
            {loading ? <div className="text-center py-20 text-gray-500">Loading coupons...</div>
                : (<>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <div key={coupon._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{coupon.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                                                    {coupon.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>
                                        </div>
                                    </div>

                                    {/* Coupon Code */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4 border-2 border-dashed border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-lg font-bold text-gray-900">{coupon.code}</span>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                title="Copy code"
                                            >
                                                <Copy className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Discount Info */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            {coupon.type === 'percentage' ? (
                                                <Percent className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            )}
                                            <span className="text-2xl font-bold text-gray-900">
                                                {coupon.discount}
                                            </span>
                                            <span className="text-sm text-gray-600">OFF</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Min. Amount: ${coupon.minPrice}
                                        </div>
                                    </div>

                                    {/* Usage Progress */}


                                    {/* Expiry Date */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(coupon)}
                                            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="flex-1 flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {coupons.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons found</h3>
                            <p className="text-gray-600 mb-6">Create your first coupon to get started with promotional campaigns</p>
                        </div>
                    )}
                </>)}

        </>
    )
}

export default MainCom