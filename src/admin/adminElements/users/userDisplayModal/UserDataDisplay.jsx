import { useEffect, useState } from 'react';
import { TAKE_USER_DETAILS } from '../../../apiServices/userApis';

const UserDataDisplay = ({ userId, isOpen, setIsOpen }) => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (isOpen && userId) {
            takeUserData();
        }
    }, [isOpen, userId]);

    const takeUserData = async () => {
        setLoading(true);
        try {
            const res = await TAKE_USER_DETAILS(userId);
           
            setUser(res.user.user);
            setAddresses(res.user.addresses)
        } catch (error) {
            console.error('Failed to load user data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    
    const getStatusBadge = (condition, trueText, falseText) => (
        <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${condition
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
        >
            {condition ? trueText : falseText}
        </span>
    );

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
                onClick={handleModalClick}
            >
                <div className="bg-gradient-to-r from-blue-800 to-red-600 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                    <h2 id="modal-title" className="text-2xl font-bold mb-2">User Details</h2>
                    <p className="text-blue-100 text-sm">Complete user information and status</p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading user data...</span>
                        </div>
                    ) : user && addresses ? (
                        // <></>
                        // ✅ Everything from here down remains as-is (user info content)
                        <div className="w-full mx-auto  bg-white ">
                            <div className="space-y-6">
                                {/* User Profile Header */}
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-semibold text-gray-800 mb-1">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-gray-600 mb-1">{user.email}</div>
                                        <div className="text-gray-500 text-sm mb-1">Country: {user.country}</div>
                                        <div className="text-gray-500 text-sm ">
                                            Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-gray-500 text-sm mb-3">
                                            Last Update: {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                            {getStatusBadge(!user.isBlocked, "Active", "Blocked")}
                                            {getStatusBadge(user.isVerified, "Verified", "Not Verified")}
                                        </div>
                                    </div>
                                </div>

                                {/* Addresses Section */}
                                <div className="border-t pt-6">
                                    <div className="font-semibold text-gray-700 mb-4 text-lg flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Addresses ({addresses.length})
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div className="text-gray-400 text-center py-8 bg-gray-50 rounded-lg">
                                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            No addresses found.
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                            {addresses.map((addr, idx) => (
                                                <div key={addr._id || idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-blue-700 text-lg">
                                                                {addr.addressType || "Address"}
                                                            </span>
                                                            {addr.isDefault && (
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2 font-medium">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-gray-700 font-medium mb-1">
                                                        {addr.fullName} • <span className="text-blue-600">{addr.phone}</span>
                                                    </div>

                                                    <div className="text-gray-600 text-sm leading-relaxed">
                                                        {addr.unitNumber && `Unit ${addr.unitNumber}, `}
                                                        {addr.streetNumber && `${addr.streetNumber} `}
                                                        {addr.street}
                                                        <br />
                                                        {addr.suburb}, {addr.city}, {addr.region}
                                                        <br />
                                                        {addr.country} - {addr.postalCode}
                                                    </div>

                                                    {addr.landmark && (
                                                        <div className="text-gray-500 text-xs mt-2 italic">
                                                            📍 Landmark: {addr.landmark}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No user data found.
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDataDisplay;
