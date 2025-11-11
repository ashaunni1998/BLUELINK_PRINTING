import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function EditImage({ product, setProduct }) {

    const [images, setImages] = useState(product.images || []);

    const fileInputRef = useRef(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const [newImageFile, setNewImageFile] = useState([])
    const [isChanged, setIsChanged] = useState(false)
    const [addedImage, setAddedImage] = useState(false)

    useEffect(() => {
        setIsChanged(JSON.stringify(images) !== JSON.stringify(product.images));
    }, [images, product.images]);

    const handleAddImages = (e) => {

        const files = Array.from(e.target.files);

        setNewImageFile((prevFiles) => [...prevFiles, ...files]);

        setAddedImage(true);
    };


    const handleRemoveImage = (index) => {
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
        setImages(product.images)
    }

    const handleUpdate = () => {
        fetchProduct()
    };

    async function fetchProduct() {
        console.log(1111, product.images, 2222, images);
        console.log('newImages', newImageFile);
        const formData = new FormData();

        newImageFile.forEach((file) => {
            formData.append('images', file); // 'newImages' should match your backend field name
        });
        formData.append('productId', product._id);

        formData.append('productImage', JSON.stringify(images));


        try {
            const response = await axios.put('http://localhost:3000/api/admin/product/updateImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            // Assuming response.data.data is an array of products
            const newImages = response.data.data;
            console.log(response.data);
            setProduct((prev) => ({
                ...prev,
                images: newImages
            }));
            setImages(newImages);
            setNewImageFile([])
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                <h2 className="text-xl font-semibold mb-4">Edit Images</h2>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className={`relative group border rounded-md overflow-hidden cursor-move transition-all duration-200 ${dragIndex === index ? 'opacity-50 scale-95' : ''
                                } ${dragOverIndex === index && dragIndex !== index ? 'border-blue-500 border-2 bg-blue-50' : ''
                                }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <img
                                src={url}
                                alt={`Product Image ${index + 1}`}
                                className="w-full h-40 object-cover pointer-events-none"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-sm opacity-80 hover:opacity-100 z-10"
                            >
                                ✕
                            </button>
                            <span className="absolute bottom-1 left-2 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                                #{index + 1}
                            </span>
                        </div>
                    ))}
                </div>
                {newImageFile.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">New Images to Upload:</p>
                        <ul className="list-disc pl-5">
                            {newImageFile.map((file, idx) => (
                                <li key={idx}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Upload + Update Buttons */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
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
                    <>{isChanged ? (
                        <button onClick={resetFormate}
                            className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Reset</button>
                    ) : null}</>

                    {isChanged || addedImage ? (
                    <button
                        onClick={handleUpdate}
                        className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Update Images
                    </button>
                     ) : null} 
                </div>
            </div>
        </div>
    );
}

export default EditImage;
