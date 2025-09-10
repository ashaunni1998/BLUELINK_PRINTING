import { useEffect, useState } from 'react';
import { Upload, X, ImageIcon, Package, DollarSign, Tag, Archive, Building, Edit } from 'lucide-react';
import { TAKE_PRODUCT_CATEGORY, SUBMIT_NEW_PRODUCT, UPDATE_PRODUCT_DATA } from '../../../apiServices/productApi';
import { toast } from 'react-toastify';
import EditImage from '../newProductHandle/EditImageModal';
import CropImage from '../newProductHandle/CropImage'

import { validateForm } from '../newProductHandle/productDataValidation'
import ProductSpecificationModal from '../newProductHandle/ProductSpecificationModal';

function ProductManagement({ purpose = 'add', productData, setPurpose, setProductData, setChange }) {
    const isEdit = purpose === 'edit';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        subtitle: '',
        stock: '',
        category: null,
        images: []
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [cropFile, setCropFile] = useState(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [cropIndex, setCropIndex] = useState(null);
    const [productOptions, setProductOptions] = useState({
        size: productData?.size || [],
        paper: productData?.paper || [],
        finish: productData?.finish || [],
        corner: productData?.corner || []
    });
    const [openOptions, setOpenOptions] = useState(false)

    useEffect(() => {
        if (isEdit && productData) {
            setFormData({
                name: productData.name || '',
                description: productData.description || '',
                price: productData.price || '',
                subtitle: productData.subtitle || '',
                stock: productData.stock || '',
                category: productData.category || null,
                images: productData.images || []
            });

            // For edit mode, show existing images as previews
            if (productData.images && productData.images.length > 0) {
                setImagePreviews(productData.images.map(url => ({ url, isExisting: true })));
            }
        }
    }, [isEdit, productData]);

    useEffect(() => {
        const takeCategory = async () => {
            try {
                const res = await TAKE_PRODUCT_CATEGORY()
                // console.log(2222, res.categoryData);
                setAllCategory(res.categoryData)

            } catch (error) {
                console.log(4444, error);

            }
        }

        takeCategory()
    }, [])
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({})
        if (name === 'stock') {
            if (value === '' || /^[0-9]+$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newPreview = {
                        url: event.target.result,
                        file: file,
                        isExisting: false
                    };

                    setImagePreviews(prev => [...prev, newPreview]);
                    setImageFiles(prev => [...prev, file]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(formData, setErrors, isEdit, imagePreviews)) return;


        if (isEdit) {
            let takeCategoryId;
            if (typeof formData.category === 'object') {
                takeCategoryId = formData.category._id;
            } else {
                takeCategoryId = formData.category;
            }

            const submitData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                category: takeCategoryId,
                subtitle: formData.subtitle,
                stock: formData.stock,
                productId: productData._id
            };
            setLoading(true)
            try {
                await UPDATE_PRODUCT_DATA(submitData)
                setPurpose('display')
                toast.success(`Product "${formData.name}" updated successfully!`);
            } catch (error) {
                toast.error(error.response.data.message)
                // console.log(error);

            } finally {
                setLoading(false)
            }
            // Make PUT request with FormData for file upload
        } else {

            const fd = new FormData();

            // Append simple fields
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('subtitle', formData.subtitle);
            fd.append('stock', formData.stock);

            // Append category (string ID)
            if (typeof formData.category === 'object') {
                fd.append('category', formData.category._id);
            } else {
                fd.append('category', formData.category);
            }

            imageFiles.forEach((file) => {
                fd.append('images', file); // backend should handle array of files
            });

            console.log(productOptions);
            Object.entries(productOptions).forEach(([key, value]) => {
                value.forEach(val => fd.append(`${key}[]`, JSON.stringify(val ? val : null)));
            });

            setLoading(true)

            try {
                await SUBMIT_NEW_PRODUCT(fd)
                setChange((priv) => (!priv))
                setPurpose('display')
                toast.success(`Product "${formData.name}" added successfully!`);
            } catch (error) {
                console.log(error);

                toast.error(error.response.data.message)
                if (error.response.data.message == 'Product name already exists. Please choose a different name.') {
                    setErrors((priv) => ({ ...priv, name: error.response.data.message }))
                }
            } finally {
                setLoading(false)
            }
            // console.log('Add New Product:');
        }
    };

    function displayOption(allCategory) {

        if (!productData?.category?._id) {
            return allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>
                    {cat.name}
                </option>
            ));
        };

        let filterCategory;

        filterCategory = allCategory.filter(
            (cat) => cat._id !== productData.category._id
        );
        return filterCategory.map((cat) => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
        ));
    }
    const handleCropComplete = (croppedImageFile) => {
        // console.log('New cropped image:', croppedImageFile);
        setImagePreviews(prev =>
            prev.map((img, idx) =>
                idx === cropIndex
                    ? { ...img, url: croppedImageFile.url, file: croppedImageFile.file }
                    : img
            )
        );
        setImageFiles(prev =>
            prev.map((file, idx) =>
                idx === cropIndex
                    ? croppedImageFile.file
                    : file
            )
        );
        setCropFile(null);
        setShowCropModal(false);
    };


    const imageCropIng = (index) => {
        const preview = imagePreviews[index];
        // If you store the File object in preview.file, use it; otherwise, fallback to preview.url
        const fileOrUrl = preview.file || preview.url;
        setCropIndex(index);
        setShowCropModal(true);
        setCropFile(fileOrUrl);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 ">
            <ProductSpecificationModal isEdited={isEdit} setCardOptions={setProductOptions} productId={productData?._id}
                openOptions={openOptions} setOpenOptions={setOpenOptions} productOptions={productOptions} />
            <CropImage
                key={cropFile?.url || cropFile?.file?.name || Math.random()} // force remount
                imageFile={cropFile}
                isOpen={showCropModal}
                setIsOpen={setShowCropModal}
                onCropComplete={handleCropComplete}
            />
            <div className=" m-6 ">
                <EditImage
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    product={productData}
                    setProduct={setProductData}
                    onCropComplete={handleCropComplete}
                />
                {/* Header */}
                <div className="left-center mb-8 ml-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-gray-600">
                        {isEdit ? 'Update your product information' : 'Create a new product listing'}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white  shadow-xl overflow-hidden">
                    <div className="bg-blue-600 p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Package className="w-5 h-5 mr-2" />
                            Product Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Product Name */}
                                <div className="group">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 mr-2 text-blue-900" />
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter product name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* subtitle */}
                                <div className="group">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Building className="w-4 h-4 mr-2 text-red-600" />
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        placeholder="Enter subtitle name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all duration-200 outline-none"
                                        value={formData.subtitle}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>}
                                </div>

                                {/* Price and Stock */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4 mr-2 text-blue-900" />
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Archive className="w-4 h-4 mr-2 text-red-600" />
                                            Stock
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            placeholder="0"
                                            min="0"
                                            step="1"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all duration-200 outline-none"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="group">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 mr-2 text-blue-900" />
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category?.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                                    >
                                        {!isEdit ? <option value="">Select a category</option> :
                                            <option value={productData.category}>{productData.category?.name}</option>}
                                        {displayOption(allCategory)}

                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>



                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Description */}
                                <div className="group">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Package className="w-4 h-4 mr-2 text-red-600" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter product description"
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all duration-200 outline-none resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>

                                {/* Image Upload */}
                                <div className="group">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <ImageIcon className="w-4 h-4 mr-2 text-blue-900" />
                                        Product Images
                                    </label>

                                    {/* Upload Area */}
                                    {!isEdit ? (<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-900 transition-colors duration-200">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                Click to upload images or drag and drop
                                            </span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, GIF up to 10MB
                                            </span>
                                        </label>
                                    </div>) : (
                                        <button
                                            type="button"
                                            className="my-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 "
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setShowModal(true)
                                            }}
                                        >
                                            <ImageIcon className="w-5 h-5 mr-2" />
                                            Manage Images
                                        </button>
                                    )}
                                    {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index}>
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview.url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-44 h-44 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        {isEdit || <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>}

                                                        {preview.isExisting && (
                                                            <div className="absolute bottom-1 left-1 bg-blue-900 text-white text-xs px-1 py-0.5 rounded">
                                                                {index == 0 ? 'main' : 'Current'}
                                                            </div>

                                                        )}
                                                    </div>
                                                    {!isEdit && (<>
                                                        <button
                                                            className="mt-2 mb-2 inline-flex items-center px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-semibold rounded shadow hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                imageCropIng(index)
                                                            }}
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18V6a2 2 0 012-2h12M6 6L18 18M6 18h12a2 2 0 002-2V6" />
                                                            </svg>
                                                            Crop Image
                                                        </button>
                                                    </>)}

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className="w-full flex items-center justify-center pt-8">
                            <button
                                type="button"
                                onClick={() => { setOpenOptions(true) }}
                                className="bg-blue-700 hover:bg-blue-800 cursor-pointer text-white font-medium py-3 px-16 rounded-lg transition duration-300"
                            >
                                {isEdit ? 'Edit' : 'Add'} Product Specifications
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-4 bg-red-500  text-white font-semibold rounded-lg hover:from-blue-800 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={() => {
                                    setPurpose('display');
                                    // setProductData(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                type="submit"
                                className={`w-full sm:ml-8 mt-4 md:mt-0 sm:w-auto px-8 py-4 bg-blue-700  text-white font-semibold rounded-lg hover:from-blue-800 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
                                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Loading...' : (<>{isEdit ? 'Update Product' : 'Add Product'}</>)}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default ProductManagement;