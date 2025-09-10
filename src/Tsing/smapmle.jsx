import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Folder, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

function Category() {
  // Sample category data - replace with your actual data
  const [categories] = useState([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      parentCategory: 'Technology',
      productCount: 156,
      createdDate: '2023-01-15',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and apparel items',
      parentCategory: 'Fashion',
      productCount: 89,
      createdDate: '2023-03-22',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Books',
      description: 'Educational and entertainment books',
      parentCategory: 'Education',
      productCount: 234,
      createdDate: '2023-02-10',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Home & Garden',
      description: 'Home improvement and gardening supplies',
      parentCategory: 'Lifestyle',
      productCount: 67,
      createdDate: '2023-04-05',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Sports',
      description: 'Sports equipment and accessories',
      parentCategory: 'Recreation',
      productCount: 123,
      createdDate: '2023-01-30',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Beauty',
      description: 'Cosmetics and personal care items',
      parentCategory: 'Health',
      productCount: 78,
      createdDate: '2023-05-12',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Automotive',
      description: 'Car parts and accessories',
      parentCategory: 'Transportation',
      productCount: 45,
      createdDate: '2023-06-20',
      status: 'Active'
    },
    {
      id: 8,
      name: 'Toys',
      description: 'Children toys and games',
      parentCategory: 'Entertainment',
      productCount: 92,
      createdDate: '2023-07-08',
      status: 'Inactive'
    },
    {
      id: 9,
      name: 'Kitchen',
      description: 'Kitchen appliances and utensils this is my mani discripitn you cant te',
      parentCategory: 'Home',
      productCount: 134,
      createdDate: '2023-08-15',
      status: 'Active'
    },
    {
      id: 10,
      name: 'Music',
      description: 'Musical instruments and audio equipment',
      parentCategory: 'Entertainment',
      productCount: 56,
      createdDate: '2023-09-12',
      status: 'Active'
    },
    {
      id: 11,
      name: 'Jewelry',
      description: 'Jewelry and accessories',
      parentCategory: 'Fashion',
      productCount: 89,
      createdDate: '2023-10-05',
      status: 'Active'
    },
    {
      id: 12,
      name: 'Pet Supplies',
      description: 'Pet food and accessories',
      parentCategory: 'Animals',
      productCount: 67,
      createdDate: '2023-11-18',
      status: 'Inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.parentCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Sort filtered categories
  const sortedCategories = useMemo(() => {
    if (!sortConfig.key) return filteredCategories;

    return [...filteredCategories].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredCategories, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = sortedCategories.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ?
      <ChevronUp className="w-4 h-4 text-pink-400" /> :
      <ChevronDown className="w-4 h-4 text-pink-400" />;
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 mt-[-10px]">
          <div className="bg- rounded-2xl px-4 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                  <p className="text-blue-500">Manage your product categories</p>
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
                  placeholder="Search by category name, description, or parent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative inline-block">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none w-full px-4 py-2.5 pr-12 border border-gray-300 text-sm rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all hover:shadow-md cursor-pointer min-w-[130px]"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
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
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Proper Aligned Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:text-pink-600 transition-colors font-medium text-blue-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Category Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:text-pink-600 transition-colors font-medium text-blue-800"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-2">
                      Description {getSortIcon('description')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:text-pink-600 transition-colors font-medium text-blue-800"
                    onClick={() => handleSort('productCount')}
                  >
                    <div className="flex items-center gap-2">
                      Products {getSortIcon('productCount')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:text-pink-600 transition-colors font-medium text-blue-800"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-blue-800">
                    Parent Category
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-blue-800">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {currentCategories.length > 0 ? (
                  currentCategories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      {/* Category Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                            <Folder className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{category.name}</div>
                            <div className="text-xs text-gray-500">ID: {category.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="text-gray-600 text-sm max-w-xs truncate">{category.description}</div>
                      </td>

                      {/* Product Count */}
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-medium">
                          {category.productCount}
                          <span className="text-xs text-gray-500 ml-1">items</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          category.status === 'Active'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
                            : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            category.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          {category.status}
                        </span>
                      </td>

                      {/* Parent Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200">
                          {category.parentCategory}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 cursor-pointer hover:from-blue-200 hover:to-indigo-200 transition-all">
                            Edit
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200 cursor-pointer hover:from-orange-200 hover:to-yellow-200 transition-all">
                            View
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-2">
                        <Folder className="w-12 h-12 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-500 font-medium">No categories found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedCategories.length)} of {sortedCategories.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{currentCategories.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{sortedCategories.length}</span> categories (Page {currentPage} of {totalPages})
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span>Active: {categories.filter(c => c.status === 'Active').length}</span>
              <span>Inactive: {categories.filter(c => c.status === 'Inactive').length}</span>
              <span>Total Products: {categories.reduce((sum, c) => sum + c.productCount, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;