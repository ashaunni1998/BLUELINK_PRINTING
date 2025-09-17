import { useEffect, useState } from 'react';

import SideBarComponent from '../mainComponents/SideBarComponent';
import { Home, Users, Tag, Package, ShoppingCart, Settings, TicketPercent, } from 'lucide-react';

//pages
// import DashboardPage from '../adminElements/dashboard/dashboardPages/Dashboard'
import DashboardPage from '../../adminElements/dashboard/dashboardPages/Dashboard'

import UsersPage from '../../adminElements/users/usersPages/Users'
import Category from '../../adminElements/category/categoryPages/Category'
import Product from '../../adminElements/product/productPage/ProductPage'
import OrderPage from "../../adminElements/order/orderPages/OrderPage.jsx";
import CouponsPage from '../../adminElements/coupons/couponsPage/MainPage'
import SettingsPage from '../../adminElements/settings/settingPages/MainPage'


import { useLocation } from 'react-router-dom';

function HandlingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', icon: Home, count: null },
    { name: 'Users', icon: Users, count: null },
    { name: 'Category', icon: Tag, count: null },
    { name: 'Product', icon: Package, count: null },
    {name: 'Coupons', icon: TicketPercent, count: null }, 
    { name: 'Orders', icon: ShoppingCart, count: null },
    { name: 'Settings', icon: Settings, count: null },
  ];

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keys = Array.from(query.keys());

    if (keys.length > 0) {
      const firstKey = keys[0].toLowerCase();

      const matchedItem = menuItems.find(
        (item) => item.name.toLowerCase() === firstKey
      );

      if (matchedItem) {
        setActiveItem(matchedItem.name);
      }
    }
  }, [location.search]);


  const renderActivePage = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardPage />
      case 'Users':
        return <UsersPage />
      case 'Category':
        return <Category/>
      case 'Product':
        return <Product/>
      case 'Coupons':
        return <CouponsPage/>
      case 'Orders':
        return <OrderPage/> 
      case 'Settings':
        return <SettingsPage/>
      default:
        return <DashboardPage /> 
    }
  }

  return (
    <div className="flex min-h-screen bg-white w-full ">
      {isSidebarOpen||<div onClick={() => setIsSidebarOpen(true)} className="fixed cursor-pointer lg:hidden p-3 bg-blue-100 border-b  border-gray-200 rounded-md ml-4 mt-4 z-100">
        <button
          className="cursor-pointer flex items-center space-x-2 text-sm font-medium text-gray-700 "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
        }

      {/* Mobile Overlay with Animation */}
      {isSidebarOpen && (
        <div
          className={`
            fixed inset-0 bg-[rgba(0,0,0,0.6)] z-20 lg:hidden
            transition-opacity duration-300 ease-in-out
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <SideBarComponent setIsSidebarOpen={setIsSidebarOpen} setActiveItem={setActiveItem} isSidebarOpen={isSidebarOpen} menuItems={menuItems} activeItem={activeItem} />
      <main className="flex-1 flex flex-col min-h-screen lg:ml-0 w-full">
        {renderActivePage()}
      </main>
    </div>
  );
}

export default HandlingPage;


