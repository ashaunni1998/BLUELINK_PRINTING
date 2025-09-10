import { useState } from 'react'
import { Package, Eye, Edit, Star, EyeOff, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmationModal from '../../../commonElements/ConformationModal';
import { UPDATE_PRODUCT_LISTING,DELETE_PRODUCT } from '../../../apiServices/productApi'
import { toast } from 'react-toastify';

function ProductTable({ products, loading, setProductDataForEditing, setPurpose,setChange,setProductSort,productSort }) {

    const [is_loading, setIsIsLoading] = useState(false);
    const [modalPurpose, setModalPurpose] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Helper function to format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

   const createRating = (rating) => {
    // rating = { count: number, total: number }
    const maxTotal = 60;

    const avg = rating.count > 0 ? (rating.total / maxTotal) * 5 : 0;
    const fullStars = Math.floor(avg);
    const hasHalfStar = avg - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1 text-sm text-gray-700">
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
                {hasHalfStar && (
                    <Star key="half" className="w-3 h-3 text-yellow-400 fill-current opacity-50" />
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
                ))}
                <span className="ml-1 text-xs text-gray-600">{ Math.abs( avg.toFixed(1))} / 5</span>
            </div>
            
        </div>
    );
};

 
    const handleToggleListing = (product) => {
        setModalPurpose('listing');
        setSelectedProduct(product)
        setIsModalOpen(true)
        // console.log('Toggle listing for product:', product);
    };
    const deleteProduct = (product) => {
        setModalPurpose('delete');
        setSelectedProduct(product)
        setIsModalOpen(true)
    }
    const handleConfirm =async () => {
        if (modalPurpose == 'delete') {
            setIsIsLoading(true)
            try {
              await DELETE_PRODUCT(selectedProduct._id);
               toast.success(`Product "${selectedProduct.name}" has been deleted successfully.`);
               setChange((priv)=>(!priv))
            } catch (error) {
               console.log(error);
               
            } finally {
                setIsIsLoading(false)
                handleCancel()
            }
        } else {
            setIsIsLoading(true)
            
            try {

                const res = await UPDATE_PRODUCT_LISTING(selectedProduct._id, !selectedProduct.isListed);

                selectedProduct.isListed=!selectedProduct.isListed
               
                 toast.success(res.message)

            } catch (error) {
                console.log(444, error);

            } finally {
                setIsIsLoading(false)
                handleCancel()
            }
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
        setModalPurpose('')
    }

    const getSortIcon = (key) => {
        return key == '' ? <div className='bg-red-600 w-2 h-2 rounded-2xl'></div> :
            key == 'descending' ? <ChevronDown className="w-4 h-4 text-red-800" /> :
                <ChevronUp className="w-4 h-4 text-red-800" />
    };

const tableSorting = () => {
    if (productSort === '') {
        setProductSort('descending');
    } else if (productSort === 'descending') {
        setProductSort('ascending');
    } else {
        setProductSort('');
    }
};

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ConfirmationModal
                title={
                    modalPurpose === "delete"
                        ? "Delete Product"
                        : !selectedProduct?.isListed
                            ? "Enable Listing"
                            : "Disable Listing"
                }
                message={
                    modalPurpose === "delete"
                        ? `Are you sure you want to delete the Product "${selectedProduct?.name}"?`
                        : selectedProduct
                            ? `Are you sure you want to ${!selectedProduct.isListed ? "List" : "block"
                            } the Product "${selectedProduct.name}"?`
                            : ""
                }
                type={
                    modalPurpose === "delete"
                        ? "danger"
                        : !selectedProduct?.isListed
                            ? "success"
                            : "danger"
                }
                confirmText={modalPurpose === "delete" ? "Delete" : "Yes, continue"}
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={is_loading}
            />
            <div className="overflow-x-auto min-h-[500px]">
                <table className="w-full min-w-[800px]">
                    {/* Table Header */}
                    <thead className="bg-gray-300 border-b border-gray-200">
                        <tr>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base">
                                    Product
                                </div>
                            </th>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800 hidden sm:table-cell">
                                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base">
                                    Category
                                </div>
                            </th>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base">
                                    Price & Rating
                                </div>
                            </th>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left hover:text-red-600  cursor-pointer transition-colors font-medium text-blue-800"
                            onClick={tableSorting}>
                                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base">
                                    Stock {getSortIcon(productSort)}
                                </div>
                            </th>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left hover:text-red-600 transition-colors font-medium text-blue-800">
                                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base">
                                    Status
                                </div>
                            </th>
                            <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-medium text-blue-800 hover:text-red-600">
                                <span className="text-xs sm:text-sm lg:text-base">Actions</span>
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-2 sm:px-4 lg:px-6 py-8 sm:py-12 text-center">
                                    <div className="text-gray-400 mb-2">
                                        <Package className="w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 mx-auto animate-spin opacity-50" />
                                    </div>
                                    <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium">Loading Product...</p>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b-2 border-gray-100"
                                        >
                                            {/* Product Name */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        {product.images && product.images[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-white text-[8px] sm:text-xs">No Image</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base truncate">{product.name}</div>
                                                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">Subtitle: {product.subtitle}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category - Hidden on mobile */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                                <div className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                                                    {product.category.name}
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                <div className="text-gray-800 font-bold text-xs sm:text-sm lg:text-base">
                                                    {formatPrice(product.price)}
                                                </div>
                                                {createRating(product.rating)}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                <div className="text-gray-800 font-medium text-xs sm:text-sm lg:text-base">
                                                    {product.stock}
                                                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 hidden sm:inline">units</span>
                                                </div>
                                            </td>

                                            {/* Status - Hidden on mobile and tablet */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                <button
                                                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border transition-all hover:shadow-sm cursor-pointer ${product.isListed
                                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 hover:from-green-200 hover:to-emerald-200'
                                                        : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200 hover:from-red-200 hover:to-rose-200'
                                                        }`}
                                                    onClick={() => handleToggleListing(product)}
                                                >
                                                    {product.isListed ? (
                                                        <>
                                                            <Eye className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                                            Listed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                                            Unlisted
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <button
                                                        className="inline-flex items-center justify-center p-1 sm:p-1.5 lg:px-3 lg:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all cursor-pointer"
                                                        onClick={() => {
                                                            setProductDataForEditing(product);
                                                            setPurpose('edit')
                                                        }}
                                                    >
                                                        <Edit className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                                                        <span className="hidden lg:inline ml-1">Edit</span>
                                                    </button>
                                                    <button className="inline-flex items-center justify-center p-1 sm:p-1.5 lg:px-3 lg:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200 hover:from-red-200 hover:to-rose-200 transition-all cursor-pointer"
                                                        onClick={() => deleteProduct(product)}>
                                                        <Trash2 className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                                                        <span className="hidden lg:inline ml-1">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-2 sm:px-4 lg:px-6 py-8 sm:py-12 text-center">
                                            <div className="text-gray-400 mb-2">
                                                <Package className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 mx-auto opacity-50" />
                                            </div>
                                            <p className="text-gray-500 font-medium text-xs sm:text-sm lg:text-base">No products found</p>
                                            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Try adjusting your search criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductTable