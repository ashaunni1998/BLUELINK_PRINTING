import { useState } from 'react';
import { X, Plus, Tag, Edit3, Save, XCircle } from 'lucide-react';
import {UPDATE_PRODUCT_DETAILS} from '../../../apiServices/productApi'

function ProductSpecificationModal({ isEdited, setCardOptions, openOptions, setOpenOptions,productOptions,productId }) {
   
    
    const [localOptions, setLocalOptions] = useState(productOptions);

    const [option] = useState({
        size: [
            { name: 'Standard', size: { width: '2.0', height: '3.5' } },
            { name: 'Normal', size: { width: '2.16', height: '3.3' } },
            { name: 'Square', size: { width: '2.56', height: '2.56' } },
        ],
        paper: [
            { name: 'Original', points: [] },
            { name: 'Super', points: [] },
            { name: 'Luxe', points: [] },
            { name: 'Special Finishes', points: [] }
        ],
        finish: [
            { name: 'Matte', description: '' },
            { name: 'Gloss', description: '' }
        ],
        corner: [
            { name: 'Square', description: '' },
            { name: 'Rounded', description: '' }
        ],
    })

    const [selectOption, setSelectOption] = useState({})
    const [editingItem, setEditingItem] = useState(null);
    const [tempEditData, setTempEditData] = useState({});
    const [loading,setLoading]= useState(false);

    if (!openOptions) return null;

    const handleChange = (type) => {
        if (type == selectOption.type) {
            setSelectOption({})
            return
        }
        const names = option[type];
        setSelectOption({ type, option: names })
    };
    const closePage = () => {
        // setLocalOptions({ size: [], paper: [], finish: [], corner: [] })
        setSelectOption({});
        setEditingItem(null);
        setTempEditData({});
        setOpenOptions(false)
    }

    const handleSave =async () => {
        // console.log(111111,localOptions);
        if(isEdited){
            const reqData={...localOptions,productId}
            setLoading(true)
            try {
                const res= await UPDATE_PRODUCT_DETAILS(reqData)
                // console.log(res);
                setLocalOptions(res.productData);
                 setOpenOptions(false)
            } catch (error) {
                console.log(error);
                
            }finally{
                setLoading(false)
            }
        }else{
            setCardOptions(localOptions);

            closePage();
        }
    };

    const fieldIcons = {
        size: '📏',
        paper: '📄',
        finish: '✨',
        corner: '📐'
    };

    const fieldColors = {
        size: 'from-blue-500 to-cyan-500',
        paper: 'from-green-500 to-emerald-500',
        finish: 'from-purple-500 to-pink-500',
        corner: 'from-orange-500 to-red-500'
    };

    const saveSelection = (field, item) => {

        setSelectOption({});
        setLocalOptions((prev) => {
            const existing = prev[field] || [];
            const isDuplicate = existing.some((el) => el.name === item.name);
            if (isDuplicate) return prev;
            return {
                ...prev,
                [field]: [...existing, item],
            };
        });
    }
     const startEditing = (field, index, item) => {
        setEditingItem({ field, index });
        setTempEditData({ ...item });
    };

    const saveEdit = () => {
        const { field, index } = editingItem;
        setLocalOptions((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => 
                i === index ? { ...tempEditData } : item
            )
        }));
        setEditingItem(null);
        setTempEditData({});
    };

     const cancelEdit = () => {
        setEditingItem(null);
        setTempEditData({});
    };
     const removeItem = (field, index) => {
        setLocalOptions((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const updateTempData = (key, value) => {
        setTempEditData(prev => ({ ...prev, [key]: value }));
    };
     const updateTempSize = (dimension, value,select) => {
        // console.log(1212,select);
        if(select.name=='Square'){
             setTempEditData(prev => ({
            ...prev,
            size: { width: value, height: value }
        }));
        return
        }
        setTempEditData(prev => ({
            ...prev,
            size: { ...prev.size, [dimension]: value }
        }));
    };

    const addPoint = () => {
        setTempEditData(prev => ({
            ...prev,
            points: [...(prev.points || []), '']
        }));
    };

    const updatePoint = (pointIndex, value) => {
        setTempEditData(prev => ({
            ...prev,
            points: prev.points.map((point, i) => i === pointIndex ? value : point)
        }));
    };

    const removePoint = (pointIndex) => {
        setTempEditData(prev => ({
            ...prev,
            points: prev.points.filter((_, i) => i !== pointIndex)
        }));
    };
    
    const DisplaySelection = (field) => {
        if (localOptions[field] && localOptions[field].length > 0) {
            return (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Selected {field}:</h4>
                    <div className="space-y-3">
                        {localOptions[field].map((item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                                className="bg-blue-100 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {editingItem?.field === field && editingItem?.index === index ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm">
                                                <span className="text-sm">{fieldIcons[field]}</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={tempEditData.name || ''}
                                                onChange={(e) => updateTempData('name', e.target.value)}
                                                className="font-medium text-gray-800 bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm flex-1"
                                                placeholder="Name"
                                            />
                                        </div>

                                        {/* Size-specific fields */}
                                        {field === 'size' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                                                    <input
                                                        type="text"
                                                        value={tempEditData.size?.width || ''}
                                                        onChange={(e) => updateTempSize('width', e.target.value,tempEditData)}
                                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                                        placeholder="Width"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
                                                    <input
                                                        type="text"
                                                        value={tempEditData.size?.height || ''}
                                                        onChange={(e) => updateTempSize('height', e.target.value,tempEditData.size)}
                                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                                        placeholder="Height"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Paper-specific fields */}
                                        {field === 'paper' && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-2">Points</label>
                                                <div className="space-y-2">
                                                    {(tempEditData.points || []).map((point, pointIndex) => (
                                                        <div key={pointIndex} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={point}
                                                                onChange={(e) => updatePoint(pointIndex, e.target.value)}
                                                                className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                                                placeholder={`Point ${pointIndex + 1}`}
                                                            />
                                                            <button
                                                                onClick={() => removePoint(pointIndex)}
                                                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={addPoint}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add Point
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Description field for finish and corner */}
                                        {(field === 'finish' || field === 'corner') && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                                <textarea
                                                    value={tempEditData.description || ''}
                                                    onChange={(e) => updateTempData('description', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm h-20 resize-none"
                                                    placeholder="Enter description..."
                                                />
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={saveEdit}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Save className="w-3 h-3" />
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <XCircle className="w-3 h-3" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Display Mode
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm">
                                                    <span className="text-sm">{fieldIcons[field]}</span>
                                                </div>
                                                <span className="font-medium text-gray-800 text-sm">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => startEditing(field, index, item)}
                                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-3 h-3 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(field, index)}
                                                    className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                                                    title="Remove"
                                                >
                                                    <X className="w-3 h-3 text-red-500" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Display additional info */}
                                        <div className="ml-8 space-y-1 text-xs text-gray-600">
                                            {item.size && (
                                                <div className="bg-blue-50 px-2 py-1 rounded inline-block">
                                                    {item.size.width}" × {item.size.height}"
                                                </div>
                                            )}
                                            {item.description && (
                                                <div className="bg-gray-100 px-2 py-1 rounded">
                                                    {item.description}
                                                </div>
                                            )}
                                            {item.points && item.points.length > 0 && (
                                                <div className="space-y-1">
                                                    <div className="font-medium text-gray-700">Points:</div>
                                                    {item.points.map((point, i) => (
                                                        point && (
                                                            <div key={i} className="bg-green-50 px-2 py-1 rounded text-xs">
                                                                • {point}
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-110 p-4"
            onClick={() => closePage()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Tag className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                {isEdited ? 'Edit' : 'Add'} Product Specifications
                            </h2>
                        </div>
                        <button
                            onClick={() => closePage()}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-slate-300 mt-2 text-sm">
                        Configure your product specifications by adding options for each category
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid gap-6">
                        {['size', 'paper', 'finish', 'corner'].map((field) => (
                            <div key={field} className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 bg-gradient-to-r ${fieldColors[field]} rounded-xl flex items-center justify-center text-white font-semibold shadow-lg`}>
                                        {fieldIcons[field]}
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-gray-800 capitalize text-lg">
                                            {field}
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Add {field} options for your cards
                                        </p>
                                    </div>
                                </div>

                                <div className="relative mb-4">
                                    <div
                                        type=""
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleChange(field);
                                        }}
                                        className="cursor-pointer w-full border-2 border-gray-200 hover:border-blue-500 px-4 py-3 rounded-xl transition-all duration-200 hover:outline-none hover:ring-4 hover:ring-blue-500/20 pl-12"
                                    >
                                        <p className='text-gray-600 hover:text-gray-800'> {`Select ${field} option and press Enter`}</p>
                                    </div>
                                    <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                <div className='mt-[-18px]'>
                                    {selectOption.type === field &&
                                        selectOption.option.map((item, index) => (
                                            <div
                                                key={`${field}-${item.name}-${index}`}
                                                onClick={() => { saveSelection(field, item) }}
                                                className="bg-white text-gray-800  p-1 rounded-md  shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-lg text-gray-600">{fieldIcons[field]}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-base">{item.name}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {DisplaySelection(field)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => closePage()}
                            className="order-2 sm:order-1 px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="order-1 sm:order-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                            {loading?"Loading...":isEdited ? 'Update Changes' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductSpecificationModal;