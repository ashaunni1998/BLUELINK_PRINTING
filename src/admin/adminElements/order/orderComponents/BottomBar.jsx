import React from 'react'
import {  ChevronLeft, ChevronRight } from 'lucide-react';

function BottomBar({currentPage, setCurrentPage, orders, itemsPerPage, pagination}) {
    // Use pagination object from API response
    const { totalFilteredOrders, totalPages, processingOrders } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredOrders);

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Function to get page numbers to display (max 5 pages)
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            // If total pages is 5 or less, show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // Calculate start and end page when total pages > 5
            const halfPages = Math.floor(maxPagesToShow / 2);
            
            if (currentPage <= halfPages + 1) {
                // If current page is near the beginning
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage >= totalPages - halfPages) {
                // If current page is near the end
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                // If current page is in the middle
                startPage = currentPage - halfPages;
                endPage = currentPage + halfPages;
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const pageNumbers = getPageNumbers();

    return (
        <>
            {/* Pagination */}
            {/* {totalPages > 1 && ( */}
                <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {endIndex} of { totalFilteredOrders} entries
                            
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
                                {pageNumbers.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === page
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
            {/* )} */}

            {/* Results Summary */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                        Showing <span className="font-semibold text-gray-800">{orders.length}</span> of{' '}
                        <span className="font-semibold text-gray-800">{totalFilteredOrders}</span> orders (Page {currentPage} of {totalPages})
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                        {/* <span>Delivered: {orders.filter(o => o.status === 'Delivered').length}</span> */}
                        <span>Processing: {processingOrders}</span>
                        {/* <span>Pending: {orders.filter(o => o.status === 'Pending').length}</span> */}
                        {/* <span>Total Revenue: {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}</span> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BottomBar