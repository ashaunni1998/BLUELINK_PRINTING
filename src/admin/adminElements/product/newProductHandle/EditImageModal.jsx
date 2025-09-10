import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UPDATE_PRODUCT_IMAGE } from '../../../apiServices/productApi'
import CropImage from './CropImage';

function EditImage({ product, setProduct, isOpen, onClose }) {
    const [images, setImages] = useState(product?.images || []);
    const fileInputRef = useRef(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [newImageFile, setNewImageFile] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [addedImage, setAddedImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cropFile, setCropFile] = useState(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [cropIndex, setCropIndex] = useState(null);

    useEffect(() => {
        setIsChanged(JSON.stringify(images) !== JSON.stringify(product?.images));
    }, [images, product?.images, newImageFile]);

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        setNewImageFile((prevFiles) => [...prevFiles, ...files]);
        setAddedImage(true);
    };

    const handleRemoveImage = (index) => {
        if ((images.length + newImageFile.length) <= 1) {
            toast.error("At least one image is required.");
            return;
        }
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (e, index) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) return;

        const newImages = [...images];
        const temp = newImages[dragIndex];
        newImages[dragIndex] = newImages[dropIndex];
        newImages[dropIndex] = temp;

        setImages(newImages);
        setDragIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        setDragOverIndex(null);
    };

    const resetFormate = () => {
        setImages(product?.images || []);
    };

    const handleUpdate = () => {
        fetchProduct()
    };
    async function fetchProduct() {
        // console.log(1111, product.images, 2222, images);
        console.log('newImages', newImageFile);
        const formData = new FormData();

        newImageFile.forEach((file) => {
            formData.append('images', file); // 'newImages' should match your backend field name
        });
        formData.append('productId', product._id);

        formData.append('productImage', JSON.stringify(images));

        setLoading(true)
        try {
            const response = await UPDATE_PRODUCT_IMAGE(formData);
            const newImages = response.data;

            setProduct((prev) => ({
                ...prev,
                images: newImages
            }));
            setImages(newImages);
            setNewImageFile([]);
            setAddedImage(false)
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveNewImage = (index) => {
        if ((images.length + newImageFile.length) <= 1) {
            toast.error("At least one image is required.");
            return;
        }
        setNewImageFile((prevFiles) => prevFiles.filter((_, i) => i !== index));

        if (newImageFile.length <= 1) {
            setAddedImage(false)
        }
    };

    if (!isOpen) return null; // 🛑 Don't render the modal if it's not open

    const newCropImage = (file, index) => {
        // console.log(file ,index);
        
        setCropFile(file)
        setCropIndex(index)
        setShowCropModal(true)
    }

    const handleCropComplete = (croppedImageFile) => {
        setNewImageFile(prev =>
            prev.map((file, idx) =>
                idx === cropIndex ? croppedImageFile.file : file
            )
        );
        setCropFile(null);
        setShowCropModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-110 p-4 animate-fadeIn"> 
            <CropImage
                key={cropFile?.url || cropFile?.file?.name || Math.random()}
                imageFile={cropFile}
                isOpen={showCropModal}
                setIsOpen={setShowCropModal}
                onCropComplete={handleCropComplete}
            />
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-slideIn">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:rotate-90"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-2xl font-bold mb-2">Edit Product Images</h2>
                    <p className="text-blue-100 text-sm">Drag to reorder • Click × to remove images</p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-320px)] sm:max-h-[calc(95vh-200px)]">
                    {/* Current Images Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Current Images</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {images.length} image{images.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {images.map((url, index) => (
                                    <div
                                        key={index}
                                        className={`relative group border-2 rounded-xl overflow-hidden cursor-move transition-all duration-300 hover:shadow-lg ${dragIndex === index
                                            ? 'opacity-50 scale-95 rotate-2 shadow-2xl'
                                            : ''
                                            } ${dragOverIndex === index && dragIndex !== index
                                                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="aspect-square relative">
                                            <img
                                                src={url}
                                                alt={`Product Image ${index + 1}`}
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            disabled={loading}
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Image Number & Main Label */}
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                                                #{index + 1}
                                            </span>
                                            {index === 0 && (
                                                <span className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                    Main
                                                </span>
                                            )}
                                        </div>

                                        {/* Drag Indicator */}
                                        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-lg">No images available</p>
                            </div>
                        )}
                    </div>

                    {/* New Images Section */}
                    {newImageFile.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">New Images to Upload</h3>
                                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                                    +{newImageFile.length} new
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {newImageFile.map((file, idx) => (
                                    <div key={idx}>
                                        <div className="relative border-2 border-green-200 rounded-xl overflow-hidden group bg-green-50/50 hover:shadow-lg transition-all duration-200">
                                            <div className="aspect-square relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                disabled={loading}
                                                onClick={() => handleRemoveNewImage(idx)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 shadow-lg"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            {/* New Badge */}
                                            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                                                NEW
                                            </div>

                                            {/* Filename */}
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium block truncate backdrop-blur-sm">
                                                    {file.name}
                                                </span>
                                            </div>

                                        </div>
                                        <div>
                                            <button
                                                disabled={loading}
                                                className="mt-2 mb-2 inline-flex items-center px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-semibold rounded shadow hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    newCropImage(file, idx);
                                                }}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18V6a2 2 0 012-2h12M6 6L18 18M6 18h12a2 2 0 002-2V6" />
                                                </svg>
                                                Crop Image
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                        {/* Add Images Button */}
                        <button
                            disabled={loading}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Images
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleAddImages}
                            className="hidden"
                        />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {isChanged && (
                                <button
                                    disabled={loading}
                                    onClick={resetFormate}
                                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset
                                </button>
                            )}

                            {(isChanged || addedImage) && (
                                <button
                                    disabled={loading}
                                    onClick={handleUpdate}
                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                                >

                                    {loading ? 'Loading...' : 'Update Images'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
export default EditImage;