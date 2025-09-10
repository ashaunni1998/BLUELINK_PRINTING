import { useState, useEffect } from 'react';
import { X, Plus, Edit, Tag } from 'lucide-react';

import { ADD_CATEGORY, EDIT_CATEGORY } from '../../../apiServices/categoryApi'
import { toast } from 'react-toastify';

function AddCategoryModal({ isOpen, onClose, purpose = 'add', categoryData = null,
    setCategories, itemsPerPage, setCurrentPage, setPagination }) {

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});


    const isEditMode = purpose === 'edit';
    const modalConfig = {
        add: {
            title: 'Add New Category',
            subtitle: 'Create a new category for your products',
            icon: Plus,
            buttonText: 'Add Category',
            loadingText: 'Adding...',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        edit: {
            title: 'Edit Category',
            subtitle: 'Update category information',
            icon: Edit,
            buttonText: 'Update Category',
            loadingText: 'Updating...',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        }
    };

    const config = modalConfig[purpose] || modalConfig.add;
    const IconComponent = config.icon;

    // Populate form data when editing
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && categoryData) {
                setFormData({
                    name: categoryData.name || '',
                    description: categoryData.description || ''
                });
            } else {
                setFormData({
                    name: '',
                    description: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, isEditMode, categoryData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Category name must be at least 3 characters';
        }

        // Make description optional for better UX
        if (formData.description.trim() && formData.description.trim().length < 5) {
            newErrors.description = 'Description must be at least 5 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                name: formData.name.trim(),
                description: formData.description.trim(),
                ...(isEditMode && categoryData?._id && { id: categoryData._id })
            });
        }
    };

    const handleClose = () => {
        setFormData({ name: '', description: '' });
        setErrors({});
        onClose();
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
           
            if (purpose == 'add') {
                const res = await ADD_CATEGORY(formData);

                setCategories((prev) => {
                    if (setCurrentPage) setCurrentPage(1);
                    let updated = [res.categoryData, ...prev];
                    if (updated.length > itemsPerPage) {
                        updated = updated.slice(0, itemsPerPage);
                    }
                    return updated;
                });
                 setPagination((prev) => ({
                    ...prev,
                    totalItems: (prev.totalItems || 0) + 1,
                }));
               
                toast.success(res.message)
            } else {

                const reqData = { ...formData, categoryId: categoryData._id }

                const res = await EDIT_CATEGORY(reqData)
                // console.log(res)
                if (res.updated) {
                    categoryData.name = res.data.name
                    categoryData.description = res.data.description
                };
                toast.success(res.message);
            }

            handleClose();
        } catch (error) {
            // console.log(error.response.data.message);
            if (error.response.data.message == 'Category name already exists') {
                setErrors((priv) => ({ ...priv, name: error.response.data.message }))
            }
            if (error.response.data.message == 'Category name already exists. Please choose a different name.') {
                setErrors((priv) => ({ ...priv, name: error.response.data.message }))
            }
            toast.error(error.response.data.message)

            // console.error(`Error ${purpose}ing category:`, error);
            // Handle error (you might want to show an error message)
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`${config.iconBg} p-2 rounded-lg`}>
                            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <div>
                            <h2 id="modal-modal-title" className="text-xl font-semibold text-gray-800">
                                {config.title}
                            </h2>
                            <p id="modal-modal-description" className="text-sm text-gray-500">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Category Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Category Name *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter category name"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter category description (optional)"
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isEditMode
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {config.loadingText}
                                </>
                            ) : (
                                <>
                                    <IconComponent className="w-4 h-4" />
                                    {config.buttonText}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCategoryModal;