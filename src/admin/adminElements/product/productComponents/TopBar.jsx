
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {SEARCH_PRODUCT} from '../../../apiServices/productApi'


function TopBar({ itemsPerPage, setItemsPerPage, setCurrentPage, setPurpose,setChange, setProducts }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            takeCategoryData()
        }, 1000); // Adjust delay as needed

        return () => {
            clearTimeout(handler); // Cleanup previous timeout on change
        };

    }, [searchTerm]);


    const takeCategoryData = async () => {

        const searchData = searchTerm.trim()
        if (isInitialLoad || !searchData) {
            if (!isInitialLoad) {
                setChange((priv)=>(!priv));
            }
            return;
        } else if (!searchData) {
            return
        } 
        try {
            const res = await SEARCH_PRODUCT(searchData)
            // console.log(res);
            setProducts(res.productData);
           
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <>
            <div className="mb-4 mt-[-10px]">
                <div className="bg- rounded-2xl px-4 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h1>
                                <p className="text-blue-500 text-sm sm:text-base">Manage your product inventory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
                        <div className="relative flex-1 w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, category, brand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-row xs:flex-row items-stretch xs:items-center gap-3 xs:gap-4 w-full sm:w-auto">
                            <div className="relative inline-block w-full xs:w-auto">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none w-full xs:w-auto px-2 py-2.5 border border-gray-300 text-sm rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all hover:shadow-md cursor-pointer min-w-[130px]"
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
                            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm w-full xs:w-auto text-sm sm:text-base"
                                onClick={() => setPurpose('add')}
                            >

                                <span className="truncate">Add Product</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar

