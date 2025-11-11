import { useState } from 'react'
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import AddCategoryModal from '../categoryModal/AddCategoryModal'
import { DELETE_CATEGORY, UPDATE_CATEGORY_STATUS } from '../../../apiServices/categoryApi'
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../commonElements/ConformationModal'


function CategoryTable({ categories, loading, change, setChange, setSort, sort, setPagination }) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectCategoryData, setSelectCategoryData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCate, setSelectedCate] = useState(null);
    const [is_loading, setIsIsLoading] = useState(false);
    const [purpose, setPurpose] = useState('')

    const strict = ['68a3fbd48bb89752830da2ed', '68a3fbe18bb89752830da2f0', '68a3fbfb8bb89752830da2f3', '68a3fc068bb89752830da2f6', '68a3fc278bb89752830da2f9', '68a3fc3a8bb89752830da2fc', '68a3fc498bb89752830da2ff',]

    const editCategory = (category) => {
        setSelectCategoryData(category);
        setIsOpen(true);

    }

    const deleteCategory = (category) => {
        setPurpose('delete');
        setSelectedCate(category)
        setIsModalOpen(true)
    }

    function handleToggleCategoryStatus(category) {
        // console.log(222,category);

        setPurpose('block');
        setSelectedCate(category)
        setIsModalOpen(true)
    }

    function handleCancel() {
        setSelectCategoryData(null);
        setIsModalOpen(false)
        setPurpose('')
    }

    const handleConfirm = async () => {
        if (purpose == 'delete') {

            setIsIsLoading(true);
            try {
                await DELETE_CATEGORY(selectedCate._id)
                toast.success(`Category "${selectedCate.name}" deleted successfully!`)
                setChange(!change)
            } catch (error) {
                console.log(4444, error);

            } finally {
                setIsIsLoading(false)
                handleCancel()
            }

        } else {
            setIsIsLoading(true);
            try {

                const res = await UPDATE_CATEGORY_STATUS(selectedCate._id, !selectedCate.isListed)
                toast.success(res.message)
                selectedCate.isListed = !selectedCate.isListed

            } catch (error) {
                console.log(4444, error);

            } finally {
                setIsIsLoading(false)
                handleCancel()
            }
        }
    }


    const getSortIcon = (key) => {
        return key == '' ? <div className='bg-red-600 w-2 h-2 rounded-2xl'></div> :
            key == 'dissenting' ? <ChevronDown className="w-4 h-4 text-red-800" /> :
                <ChevronUp className="w-4 h-4 text-red-800" />
    };


    const handleSort = () => {
        if (sort == '') {
            setSort('dissenting')
        } else if (sort == 'dissenting') {
            setSort('assenting')
        } else {
            setSort('')
        }
    }
    // console.log(categories[1]); 

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <AddCategoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} purpose='edit'
                    categoryData={selectCategoryData} />
                <ConfirmationModal
                    title={
                        purpose === "delete"
                            ? "Delete Category"
                            : !selectedCate?.isListed
                                ? "Enable Listing"
                                : "Disable Listing"
                    }
                    message={
                        purpose === "delete"
                            ? `Are you sure you want to delete the category "${selectedCate?.name}"? \n ⚠️ All related products will be permanently deleted.`
                            : selectedCate
                                ? `Are you sure you want to ${!selectedCate.isListed ? "List" : "block"
                                } the category "${selectedCate.name}"?`
                                : ""
                    }
                    type={
                        purpose === "delete"
                            ? "danger"
                            : !selectedCate?.isListed
                                ? "success"
                                : "danger"
                    }
                    confirmText={purpose === "delete" ? "Delete" : "Yes, continue"}
                    isOpen={isModalOpen}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    loading={is_loading}
                />

                <div className="overflow-y-auto min-h-[500px]">
                    <table className="w-full ">
                        {/* Table Header */}
                        <thead className="bg-gray-300 border-b border-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left  hover:text-red-600 transition-colors font-medium text-blue-800"
                                >
                                    <div className="flex items-center gap-2">
                                        Category Name
                                    </div>
                                </th>
                                <th
                                    className="hidden md:flex px-6 py-4 text-left  hover:text-red-600 transition-colors font-medium text-blue-800"
                                >
                                    <div className="flex items-center gap-2">
                                        Description
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left cursor-pointer hover:text-red-600 transition-colors font-medium text-blue-800"
                                    onClick={() => handleSort()}
                                >
                                    <div className="flex items-center gap-2">
                                        Products {getSortIcon(sort)}

                                    </div>
                                </th>

                                <th
                                    className="px-6 py-4 text-left   hover:text-red-600 transition-colors font-medium text-blue-800"
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                    </div>
                                </th>
                                <th className="px-6 py-4 pl-[50px] text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                    Action
                                </th>
                                <th
                                    className="px-6 py-4 text-left  hover:text-red-600 transition-colors font-medium text-blue-800"
                                >
                                    <div className="flex items-center gap-2">
                                        Editing
                                    </div>
                                </th>


                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (<>
                                <tr>
                                    <td colSpan="7" className="px-3 sm:px-4 md:px-6 py-12 text-center">
                                        <div className="text-gray-400 mb-2">
                                            <Folder className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mx-auto animate-spin opacity-50" />
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-500 font-medium">Loading Category...</p>
                                    </td>
                                </tr>
                            </>) : (<>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr
                                            key={category._id}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all border-b-2 border-gray-100 duration-200 "
                                        >
                                            {/* Category Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-400 rounded-lg flex items-center justify-center">
                                                        <Folder className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{category.name}</div>
                                                        {/* <div className="text-xs text-gray-500">ID: {category.id}</div> */}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="hidden md:flex px-6 py-4">
                                                <div className="text-gray-600 text-sm max-w-xs break-words">
                                                    {category.description ? category.description : 'no description'}
                                                </div>
                                            </td>

                                            {/* Product Count */}
                                            <td className="px-6 py-4">
                                                <div className="text-gray-800 font-medium">
                                                    {category.productCount}
                                                    <span className="text-xs text-gray-500 ml-1">Product</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${category.isListed
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : 'bg-red-100 text-gray-600 border-red-200'
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full mr-2 ${category.isListed ? 'bg-green-500' : 'bg-red-400'
                                                            }`}
                                                    ></div>
                                                    {category.isListed ? 'Listed' : 'Blocked'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 ">
                                                <div className='flex text-center'>
                                                    <button
                                                        onClick={() => {
                                                            if (!strict.includes(category._id)) {
                                                                handleToggleCategoryStatus(category);
                                                            }
                                                        }}
                                                        disabled={strict.includes(category._id)}
                                                        className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium border transition-all duration-200 
        ${category.isListed
                                                                ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                                                                : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'}
        ${strict.includes(category._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
                                                    >
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${category.isListed ? 'bg-red-500' : 'bg-green-500'}`}
                                                        ></div>
                                                        {category.isListed ? 'Block' : 'List'}
                                                    </button>

                                                    <div
                                                        className={`flex items-center gap-2 ml-3 ${strict.includes(category._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        onClick={() => {
                                                            if (!strict.includes(category._id)) {
                                                                deleteCategory(category);
                                                            }
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white border border-red-800 hover:bg-red-700 transition-all">
                                                            Delete
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Edit */}
                                            <td className="px-6 py-4">
                                                <div
                                                    className={`flex items-center gap-2 ${strict.includes(category._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (!strict.includes(category._id)) {
                                                            editCategory(category);
                                                        }
                                                    }}
                                                >
                                                    <span className="inline-flex items-center px-4 py-2 rounded-md text-xs font-medium bg-blue-500 text-white border border-blue-800 hover:bg-blue-700 transition-all">
                                                        Edit
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
                            </>)}

                        </tbody>
                    </table>
                </div>
            </div >
        </>
    )
}

export default CategoryTable