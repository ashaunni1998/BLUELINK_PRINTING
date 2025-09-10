import React, { useEffect, useState } from 'react'
import { GET_ORDER_DETAILS_API } from '../../../apiServices/orderApi'

function OrderViewModal({ viewModal, setViewModal, selectedOrderId }) {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedOrderId) {
            fetchOrderDetails();
        }
    }, [selectedOrderId])

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await GET_ORDER_DETAILS_API(selectedOrderId);
            // console.log('Order details:', res.data);
            setOrderData(res.data);
        } catch (error) {
            console.log('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'shipped':
                return 'bg-sky-50 text-sky-700 border border-sky-200';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border border-slate-200';
        }
    }

    if (!viewModal) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-300 ease-out flex items-center justify-center p-3 sm:p-4"
            onClick={() => setViewModal(false)}>
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-4xl max-h-[95vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 px-4 sm:px-6 py-4 sm:py-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Order Details</h2>
                        </div>
                        <button
                            onClick={() => setViewModal(false)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {orderData && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm text-indigo-100 font-medium">Order ID:</span>
                            <code className="text-xs sm:text-sm bg-white/10 text-white px-2 py-1 rounded-lg font-mono">
                                {orderData._id}
                            </code>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 py-6 space-y-6 sm:space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-100"></div>
                                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-indigo-600 absolute top-0"></div>
                            </div>
                            <p className="mt-4 text-slate-600 font-medium">Loading order details...</p>
                        </div>
                    ) : orderData ? (
                        <>
                            {/* Order Status */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                            Order Status
                                        </h3>
                                        <span className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${getStatusColor(orderData.status)}`}>
                                            <div className="w-1.5 h-1.5 bg-current rounded-full mr-2 animate-pulse"></div>
                                            {orderData.status}
                                        </span>
                                    </div>
                                    <div className="text-left lg:text-right">
                                        <p className="text-sm text-slate-600 mb-1 font-medium">Total Amount</p>
                                        <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            ${orderData.totalPrice}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Timeline */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="group bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl p-4 sm:p-5 border border-blue-200/50 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-slate-900">Order Created</h4>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium pl-11">{formatDate(orderData.createdAt)}</p>
                                </div>
                                {orderData.deliveredAt && (
                                    <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-2xl p-4 sm:p-5 border border-emerald-200/50 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-slate-900">Delivered</h4>
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium pl-11">{formatDate(orderData.deliveredAt)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    Order Items
                                    <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                                        {orderData.orderItems?.length || 0}
                                    </span>
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {orderData.orderItems?.map((item, index) => (
                                        <div key={item._id || index} className="group bg-white border border-slate-200/50 rounded-2xl hover:shadow-lg hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden">

                                            {/* Main Item Info */}
                                            <div className="flex items-start gap-4 p-4 sm:p-5">
                                                <div className="flex-shrink-0 relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-slate-100 group-hover:border-indigo-200 transition-all duration-300"
                                                    />
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h4>
                                                            {item.title && (
                                                                <p className="text-xs sm:text-sm text-slate-500 font-medium">"{item.title}"</p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg sm:text-xl font-black text-indigo-600">${item.price}</p>
                                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>

                                                    {/* Custom Message/Content */}
                                                    {item.content && (
                                                        <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-indigo-200">
                                                            <p className="text-xs font-medium text-slate-600 mb-1">Custom Message:</p>
                                                            <p className="text-sm text-slate-700 italic">"{item.content}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Specifications */}
                                            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                                    {item.size && (
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100">
                                                            <p className="font-semibold text-blue-700 mb-1">Size</p>
                                                            <p className="text-blue-600">{item.size.name}</p>
                                                            {item.size.size && (
                                                                <p className="text-blue-500 text-xs">
                                                                    {typeof item.size.size === 'object'
                                                                        ? `${item.size.size.width} × ${item.size.size.height}`
                                                                        : item.size.size
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.paper && (
                                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100">
                                                            <p className="font-semibold text-green-700 mb-1">Paper</p>
                                                            <p className="text-green-600">{item.paper.name}</p>
                                                        </div>
                                                    )}

                                                    {item.finish && (
                                                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-2 border border-purple-100">
                                                            <p className="font-semibold text-purple-700 mb-1">Finish</p>
                                                            <p className="text-purple-600">{item.finish.name}</p>
                                                        </div>
                                                    )}

                                                    {item.corner && (
                                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2 border border-orange-100">
                                                            <p className="font-semibold text-orange-700 mb-1">Corner</p>
                                                            <p className="text-orange-600">{item.corner.name}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* User Images */}
                                            {item.userImage && item.userImage.length > 0 && (
                                                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                                    <p className="text-xs font-semibold text-slate-600 mb-2">Custom Images:</p>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {item.userImage.map((imgUrl, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                src={imgUrl}
                                                                alt={`Custom image ${imgIndex + 1}`}
                                                                className="w-24 h-24 sm:w-30 sm:h-30 object-cover rounded-lg border-2 border-slate-200 hover:border-indigo-300 transition-all duration-200 flex-shrink-0"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Product ID for reference */}
                                            <div className="px-4 sm:px-5 pb-3">
                                                <p className="text-xs text-slate-400">
                                                    Product ID: {item.product} | Order Item ID: {item._id}
                                                </p>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-4 sm:space-y-6 border-t border-slate-200 pt-6 sm:pt-8">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    Customer Information
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/30 rounded-2xl p-4 sm:p-6 border border-slate-200/50 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700 w-20">Name:</span>
                                        <span className="text-sm sm:text-base font-semibold text-slate-900 bg-white px-3 py-1.5 rounded-lg border">
                                            {orderData.user?.firstName} {orderData.user?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700 w-20">Email:</span>
                                        <span className="text-sm sm:text-base font-medium text-slate-900 bg-white px-3 py-1.5 rounded-lg border font-mono">
                                            {orderData.user?.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    Shipping Address
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/30 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
                                    {orderData.shippingAddress ? (
                                        <div className="space-y-3">
                                            <p className="font-bold text-slate-900 text-base sm:text-lg">{orderData.shippingAddress?.fullName}</p>
                                            <div className="space-y-2 text-sm text-slate-700">
                                                <p className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>
                                                        {orderData.shippingAddress?.unitNumber && `Unit ${orderData.shippingAddress.unitNumber}, `}
                                                        {orderData.shippingAddress?.streetNumber} {orderData.shippingAddress?.street}
                                                    </span>
                                                </p>
                                                <p className="pl-6">
                                                    {orderData.shippingAddress?.suburb}, {orderData.shippingAddress?.city}
                                                </p>
                                                <p className="pl-6">
                                                    {orderData.shippingAddress?.region}, {orderData.shippingAddress?.country} {orderData.shippingAddress?.postalCode}
                                                </p>
                                                {orderData.shippingAddress?.landmark && (
                                                    <p className="pl-6 text-slate-600">Near: {orderData.shippingAddress.landmark}</p>
                                                )}
                                                <p className="flex items-center gap-2 pl-6">
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="font-medium">{orderData.shippingAddress?.phone}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <p className="text-slate-600 font-medium">Shipping address is not provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    Payment Information
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/30 rounded-2xl p-4 sm:p-6 border border-slate-200/50 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-200/50">
                                        <span className="text-sm font-bold text-slate-700">Payment Method:</span>
                                        <span className="text-sm font-semibold text-slate-900 bg-white px-3 py-1.5 rounded-lg border">
                                            {orderData.paymentMethod}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-200/50">
                                        <span className="text-sm font-bold text-slate-700">Payment Status:</span>
                                        <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${orderData.paymentResult?.status === 'success'
                                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                                : 'text-amber-700 bg-amber-50 border border-amber-200'
                                            }`}>
                                            {orderData.paymentResult?.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                                        <span className="text-sm font-bold text-slate-700">Transaction ID:</span>
                                        <code className="text-sm text-slate-900 font-mono bg-white px-3 py-1.5 rounded-lg border">
                                            {orderData.paymentResult?.id}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4 sm:space-y-6 border-t border-slate-200 pt-6 sm:pt-8">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    Order Summary
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/30 rounded-2xl p-4 sm:p-6 border border-slate-200/50 space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                        <span className="text-sm font-medium text-slate-700">Subtotal:</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            ${(orderData.totalPrice - orderData.shippingPrice - orderData.taxPrice).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                        <span className="text-sm font-medium text-slate-700">Shipping:</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {orderData.shippingPrice === 0 ? (
                                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">Free</span>
                                            ) : (
                                                `$${orderData.shippingPrice}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                        <span className="text-sm font-medium text-slate-700">Tax:</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {orderData.taxPrice === 0 ? (
                                                <span className="text-slate-500">N/A</span>
                                            ) : (
                                                `$${orderData.taxPrice}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-200">
                                        <span className="text-base font-black text-slate-900">Total:</span>
                                        <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            ${orderData.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 sm:py-20">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-slate-600 font-bold text-lg">Failed to load order details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderViewModal