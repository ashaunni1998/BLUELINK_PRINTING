import React from 'react';
import { useSelector } from 'react-redux';

function ProfileModal({ ProfileModalIsOpen, setProfileModalIsOpen }) {
    const userData = useSelector((state) => state.admin);

    if (!ProfileModalIsOpen) return null;

    const adminData = {
        adminId: userData?.adminId || "",
        adminName: userData?.adminName || "",
        email: userData?.email || ""
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                e.preventDefault()
                setProfileModalIsOpen(false)
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden "
            onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M20 8H16V4L20 8Z" />
                        </svg>
                        Profile
                    </h2>
                    <button
                        onClick={() => setProfileModalIsOpen(false)}
                        className=" cursor-pointer text-white hover:text-gray-200 p-1 hover:bg-white/10 rounded-full transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Avatar and Name */}
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md ring-2 ring-blue-100">
                            <span className="text-white font-semibold text-lg">
                                {adminData.adminName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {adminData.adminName}
                        </h3>
                        <p className="text-sm text-gray-500">Administrator</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                            <span className="text-gray-600 font-medium">ID:</span>
                            <span className="ml-2 font-mono text-gray-800 break-all">
                                {adminData.adminId}
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                            <span className="text-gray-600 font-medium">Email:</span>
                            <span className="ml-2 text-gray-800 break-all">
                                {adminData.email}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className=" text-center pt-2">
                        {/* <div></div> */}
                        {/* <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                            Edit
                        </button> */}
                        <button
                            onClick={() => setProfileModalIsOpen(false)}
                            className="flex-1 cursor-pointer bg-red-400 w-[50%] m-2 hover:bg-red-500  text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;