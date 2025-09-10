import { ChevronLeft, ChevronRight } from 'lucide-react';

function BottomBar({ setCurrentPage, currentPage, sortedUsers, pagination }) {
    const { pageSize, totalItems, totalPages } = pagination;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Pagination handlers
    const goToPage = (page) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
            {/* {totalPages > 1 && ( */}
                <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to{' '}
                            {Math.min(endIndex, totalItems)} of{' '}
                            <strong>{totalItems}</strong> entries
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
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
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
    );
}

export default BottomBar;