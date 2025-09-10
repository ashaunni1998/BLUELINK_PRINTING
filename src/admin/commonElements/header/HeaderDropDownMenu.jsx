import { useEffect, useRef, useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../ConformationModal';
import { LOGOUT_API } from '../../apiServices/logInApi';
import { toast } from 'react-toastify';
import ProfileModal from './ProfileModal';


function HeaderDropDownMenu({ setIsProfileOpen, isProfileOpen }) {

    const menuRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [urlParse, setUrlParse] = useState(true)
    const [ ProfileModalIsOpen , setProfileModalIsOpen ] = useState(false);

    const takeAdminName = () => {
        return user?.adminName
            ? user.adminName.length > 6
                ? user.adminName.slice(0, 6) + '...'
                : user.adminName
            : 'Admin';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsProfileOpen]);


    const handleMenuClick = (item) => {
        if (item === 'signOut') {
            // Open confirmation modal
            setIsModalOpen(true);
        } else if (item === 'settings') {
            // toast.error('settings clicked')
            setUrlParse(!urlParse)
            navigate({
                pathname: '/admin/',
                search: `?settings=${urlParse}`
            }, { replace: true });
            setIsProfileOpen(false);
        } else {
             setProfileModalIsOpen(true)
            // console.log('User clicked:', item);
            setIsProfileOpen(false);
        }
    };

    const handleConfirmSignOut = () => {
        setLoading(true)
        LOGOUT_API()
            .then(() => {
                console.log('User logged out successfully');
                dispatch(logOut());
                navigate('/admin/login');
                setIsProfileOpen(false);
                setIsModalOpen(false);
                toast.success('Logout Successful.')
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            }).finally(() => {
                setLoading(false)
            });

    };

    const handleCancelSignOut = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>

            <ProfileModal ProfileModalIsOpen={ProfileModalIsOpen} setProfileModalIsOpen={setProfileModalIsOpen}/>

            <ConfirmationModal
                title="Sign Out Confirmation"
                message="Are you sure you want to sign out?"
                type="warning"
                confirmText="Yes, Sign Out"
                isOpen={isModalOpen}
                onConfirm={handleConfirmSignOut}
                onCancel={handleCancelSignOut}
                loading={loading}
            />

            {/* Profile Button */}
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 mb-1 ">
                    {takeAdminName()} 
                </span> 
                <div className='h-full flex items-center justify-center'>
                    <div className='bg-red-500 w-3 h-3 rounded-full'></div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                    <div
                        onClick={() => handleMenuClick('profile')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                        <User size={16} className="mr-3" />
                        Profile
                    </div>
                    <div
                        onClick={() => handleMenuClick('settings')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                        <Settings size={16} className="mr-3" />
                        Settings
                    </div>
                    <hr className="my-1 border-gray-200" />
                    <div
                        onClick={() => handleMenuClick('signOut')}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeaderDropDownMenu;
