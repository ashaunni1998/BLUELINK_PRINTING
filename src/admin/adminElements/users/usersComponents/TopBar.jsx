
import { Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { USER_SEARCH_API } from '../../../apiServices/userApis'


function TopBar({ itemsPerPage, setItemsPerPage, setCurrentPage, setUsers, changed, setChanged }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        setIsInitialLoad(false);
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            takeUserData()
        }, 1000); // Adjust delay as needed

        return () => {
            clearTimeout(handler); // Cleanup previous timeout on change
        };

    }, [searchTerm]);

    const takeUserData = async () => {

        const searchData = searchTerm.trim()
        if (isInitialLoad || !searchData) {
            if (!isInitialLoad) { // Only call setChanged if it's not the initial load
                setChanged(!changed);
            }
            return;
        } else if (!searchData) {
            return
        }
        try {
            const res = await USER_SEARCH_API(searchData)
            setUsers(res.users);
        } catch (error) {

        }
    }
    return (
        <>
            {/* Search and Filter Section */}
            <div className="mb-6 ">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or email."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 ">
                            <div className="relative inline-block ">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none w-full px-4 py-2 pr-10 border hover:cursor-pointer border-gray-300 text-sm rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                                >
                                    {/* <option value={5}>5 per page</option> */}
                                    <option value={10}>10 per page</option>
                                    <option value={15}>15 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>

                                {/* Custom dropdown arrow */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <button className=" hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar