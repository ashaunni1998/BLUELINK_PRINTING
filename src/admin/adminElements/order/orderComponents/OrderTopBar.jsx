import { useState, useRef, useEffect } from 'react'
import { Search, Filter, ChevronDown, Check } from 'lucide-react';

function OrderTopBar({ setCurrentPage, itemsPerPage, setItemsPerPage, sort, setSort }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const filterDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    const sortOptions = [
        { id: 'date-desc', label: 'Newest First', value: 'date-desc' },
        { id: 'date-asc', label: 'Oldest First', value: 'date-asc' },
        { id: 'processing-ord', label: 'Processing Order', value: 'processing-ord-asc' },
        { id: 'delivered', label: 'Delivered Orders', value: 'delivered' },
        { id: 'not-delivered', label: 'Pending Delivery', value: 'not-delivered' },
        { id: 'unpaid', label: 'Unpaid Orders', value: 'unpaid' },
    ];

    const toggleSortDropdown = () => {
        setIsSortOpen(!isSortOpen);
        setIsFilterOpen(false); 
    };

    const handleSortChange = (sortValue) => {
        setSort(sortValue);
        setIsSortOpen(false);
    };

    const getSortLabel = () => {
        const selectedSort = sortOptions.find(option => option.value === sort);
        return selectedSort ? selectedSort.label : 'Sort by';
    };

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        
        if (isSortOpen || isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortOpen, isFilterOpen]); 

    return (
        <>
            {/* Header */}
            <div className="mb-4 mt-[-10px]">
                <div className="bg- rounded-2xl px-4 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                                <p className="text-blue-500">Track and manage customer orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by order ID, customer, email, or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Items per page selector */}
                            <div className="relative inline-block">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none w-full px-4 py-2.5 pr-12 border border-gray-300 text-sm rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all hover:shadow-md cursor-pointer min-w-[130px]"
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={15}>15 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>

                                {/* Custom stylish dropdown arrow */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full p-1 shadow-sm">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={toggleSortDropdown}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm"
                                >
                                    <Filter className="w-4 h-4" />
                                    {getSortLabel()}
                                    {selectedFilters.length > 0 && (
                                        <span className="bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full">
                                            {selectedFilters.length}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isSortOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="p-3 border-b border-gray-100">
                                            <h3 className="font-medium text-gray-900">Sort Orders</h3>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="p-2">
                                                {sortOptions.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        onClick={() => handleSortChange(option.value)}
                                                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer group transition-colors"
                                                    >
                                                        <span className="text-sm text-gray-700">{option.label}</span>
                                                        {sort === option.value && (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderTopBar