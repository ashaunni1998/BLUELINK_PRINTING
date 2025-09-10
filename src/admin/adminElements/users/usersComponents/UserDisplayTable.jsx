import { Blocks, User } from "lucide-react";

import ConfirmationModal from '../../../commonElements/ConformationModal'
import { useState } from "react";
import { USER_BLOCK_API } from '../../../apiServices/userApis'
import UserDataDisplay from "../userDisplayModal/UserDataDisplay";

function UserDisplayTable({ users, currentPage, itemsPerPage, loadingTable }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [userId, setUserID] = useState('')

    const startingNumber = (currentPage - 1) * itemsPerPage;

    const handleBlockClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            // console.log("Blocking/unblocking user:", selectedUser._id);
            await USER_BLOCK_API(selectedUser._id, !selectedUser.isBlocked)
            // console.log(res);
            selectedUser.isBlocked = !selectedUser.isBlocked

        } catch (err) {
            // console.error("Error:", err);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            setSelectedUser(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const viewUserData = (userId) => {
        setUserID(userId)
        setOpen(true)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <UserDataDisplay userId={userId} isOpen={open} setIsOpen={setOpen} />
            <ConfirmationModal
                title={selectedUser?.isBlocked ? "Activate User" : "Block User"}
                message={
                    selectedUser
                        ? `Are you sure you want to ${selectedUser.isBlocked ? "activate" : "block"
                        } user "${selectedUser.firstName} ${selectedUser.lastName}"?`
                        : ""
                }
                type={selectedUser?.isBlocked ? "success" : "danger"}
                confirmText="Yes, continue"
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={loading}
            />
            <div className="overflow-x-auto min-h-[500px]">
                <table className="w-full">
                    {/* Table Header */}
                    <thead className="bg-gray-300 border-b border-gray-200">
                        <tr>
                            <th className="w-16 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    No
                                </div>
                            </th>
                            <th className="w-48 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    User
                                </div>
                            </th>
                            <th className="w-56 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    Contact
                                </div>
                            </th>
                            <th className="w-32 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    Joined
                                </div>
                            </th>
                            <th className="w-28 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    Status
                                </div>
                            </th>
                            <th className="w-28 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    Action
                                </div>
                            </th>
                            <th className="w-28 px-3 sm:px-4 md:px-6 py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2">
                                    Details
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100">
                        {loadingTable ? (<>
                            <tr>
                                <td colSpan="7" className="px-3 sm:px-4 md:px-6 py-12 text-center">
                                    <div className="text-gray-400 mb-2">
                                        <User className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mx-auto animate-spin opacity-50" />
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-500 font-medium">Loading users...</p>
                                </td>
                            </tr>
                        </>) : (<>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b-2 border-gray-100"
                                    >
                                        {/* Row Number */}
                                        <td className="w-16 px-3 sm:px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="font-sm text-gray-800 text-sm sm:text-base">
                                                    {(index + 1 + startingNumber)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* User Name */}
                                        <td className="w-48 px-3 sm:px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="w-56 px-3 sm:px-4 md:px-6 py-4">
                                            <div className="text-gray-600 text-xs sm:text-sm truncate">
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Join Date */}
                                        <td className="w-32 px-3 sm:px-4 md:px-6 py-4">
                                            <div className="text-gray-600 text-xs sm:text-sm">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="w-32 px-3 sm:px-4 md:px-6 py-4">
                                            <div className="flex items-center justify-start">
                                                <span
                                                    className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${!user.isBlocked
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 sm:w-2 h-1.5 sm:h-2 mr-1 sm:mr-2 rounded-full ${!user.isBlocked ? 'bg-green-500' : 'bg-red-500'
                                                            }`}
                                                    ></span>
                                                    <span className="hidden sm:inline">{user.isBlocked ? 'Blocked' : 'Active'}</span>
                                                    <span className="sm:hidden">{user.isBlocked ? 'B' : 'A'}</span>
                                                </span>
                                            </div>
                                        </td>

                                        {/* action */}
                                        <td className="w-24 px-3  py-4">
                                            <button
                                                onClick={() => handleBlockClick(user)}
                                                className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 hover:cursor-pointer rounded-full text-xs font-semibold border transition-all duration-200 
                                               ${user.isBlocked
                                                        ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                                                    }`}
                                            >
                                                <span className="hidden xl:inline">{user.isBlocked ? 'Activate User' : 'Block User'}</span>
                                                <span className="xl:hidden">{user.isBlocked ? 'Activate' : 'Block'}</span>
                                            </button>
                                        </td>

                                        {/* Details */}
                                        <td className="w-24 px-3 sm:px-4 md:px-6 py-4">
                                            <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 cursor-pointer hover:from-blue-200 hover:to-indigo-200 transition-all"
                                                onClick={() => viewUserData(user._id)}>
                                                view
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (<>

                                <tr>
                                    <td colSpan="7" className="px-3 sm:px-4 md:px-6 py-12 text-center">
                                        <div className="text-gray-400 mb-2">
                                            <User className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mx-auto opacity-50" />
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-500 font-medium">No users found</p>
                                        <p className="text-xs sm:text-sm text-gray-400">Try adjusting your search criteria</p>
                                    </td>
                                </tr>

                            </>)}
                        </>)}
                    </tbody>
                </table>
            </div>
        </div >

    )
}

export default UserDisplayTable