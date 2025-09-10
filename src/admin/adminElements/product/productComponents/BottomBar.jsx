import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';

function BottomBar({ apiPagination, setCurrentPage }) {
    const totalPages = Math.max(1, Math.ceil(apiPagination.totalItems / apiPagination.pageSize));
    const currentPage = apiPagination.currentPage;

    const startIndex = (currentPage - 1) * apiPagination.pageSize;
    const endIndex = Math.min(startIndex + apiPagination.pageSize, apiPagination.totalItems);

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                        {apiPagination.totalItems > 0
                            ? `Showing ${startIndex + 1} to ${endIndex} of ${apiPagination.totalItems} entries`
                            : 'No entries found'}
                    </div>

                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={goToPrevious}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                if (page > totalPages) return null;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4">
                    <div className="text-gray-600">
                        Showing{' '}
                        <span className="font-semibold text-gray-800">{apiPagination.totalItems}</span>{' '}
                        products (Page {currentPage} of {totalPages})
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm">
                        <span>Out of Stock: <strong>{apiPagination.outOfStock ?? 0}</strong></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BottomBar;
