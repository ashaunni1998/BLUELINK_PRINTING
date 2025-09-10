import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';


function BottomBar({ setCurrentPage, currentPage, pagination }) {

    const totalPages = pagination.totalPages
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;


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
    return (

        <>
            {/* Pagination */}
            {/* {totalPages > 1 && ( */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {pagination.totalItems > 0 ? (
                            <>
                                Showing {startIndex + 1} to{" "}
                                {Math.min(startIndex + pagination.pageSize, pagination.totalItems)} of{" "}
                                {pagination.totalItems} entries
                            </>
                        ) : (
                            "No entries to display"
                        )}
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
        </>
    )
}

export default BottomBar