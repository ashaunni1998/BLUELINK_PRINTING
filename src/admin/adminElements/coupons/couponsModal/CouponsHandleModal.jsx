import { useState, useEffect } from "react";
import { CREATE_COUPON, UPDATE_COUPON } from "../../../apiServices/couponApi"
import { toast } from "react-toastify";

function CouponsHandleModal({ showModal, editingCoupon, setShowModal, setCoupons }) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discount: "",
    minPrice: "",
    totalCoupon: "",
    expiryDate: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      discount: "",
      minPrice: "",
      totalCoupon: "",
      expiryDate: "",
      status: "active",
    });
    setErrors({});
  };

  useEffect(() => {
    if (editingCoupon) {
      const formattedCoupon = {
        ...editingCoupon,
        expiryDate: editingCoupon.expiryDate
          ? editingCoupon.expiryDate.split("T")[0]
          : ""
      };
      setFormData(formattedCoupon);
    } else {
      resetForm();
    }
  }, [showModal]);

  const validateForm = () => {
    let newErrors = {};

    // Coupon code validation
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required.";
    } else if (formData.code.trim().length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.code)) {
      newErrors.code = "Coupon code can only contain letters, numbers, - or _.";
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    // Discount validation
    if (!formData.discount) {
      newErrors.discount = "Discount is required.";
    } else if (isNaN(formData.discount) || formData.discount <= 0) {
      newErrors.discount = "Discount must be a number greater than 0.";
    }

    // Minimum Price validation
    if (!formData.minPrice) {
      newErrors.minPrice = "Minimum price is required.";
    } else if (isNaN(formData.minPrice) || formData.minPrice <= 0) {
      newErrors.minPrice = "Minimum price must be greater than 0.";
    }

    // Total Coupons validation
    if (!formData.totalCoupon) {
      newErrors.totalCoupon = "Total coupons is required.";
    } else if (isNaN(formData.totalCoupon) || formData.totalCoupon <= 0) {
      newErrors.totalCoupon = "Total coupons must be at least 1.";
    }

    // Expiry Date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // remove time
      const expiry = new Date(formData.expiryDate);
      if (expiry <= today) {
        newErrors.expiryDate = "Expiry date must be in the future.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true)
    // handle update or create
    if (editingCoupon) {
      try {

        const res = await UPDATE_COUPON(editingCoupon._id, formData);
        // console.log(1111, res);
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon._id === editingCoupon._id ? res.data : coupon
          )
        );
        toast.success("Coupon updated successfully!");
        setShowModal(false);
        resetForm();

      } catch (error) {
          // console.log(error);
          if (error.response && error.response.data && error.response.data.message) {
          toast.error(  error.response.data.message );
             if(error.response.data.message==='Coupon code must be unique'){
                setErrors({ code: error.response.data.message });
             }
          }
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const res = await CREATE_COUPON(formData);

        // console.log(2222, res);
        setCoupons((prev) => [res.data, ...prev]);

        toast.success("Coupon created successfully!");
        setShowModal(false);
        resetForm();


      } catch (error) {
        // console.log(444, error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrors({ code: error.response.data.message });
        }

      } finally {
        setLoading(false)
      }
      
    }

    
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-110"
          onClick={() => {setShowModal(false),resetForm()}}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Coupon Code + Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., SAVE20"
                  />
                  {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Summer Sale"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the coupon"
                  rows="3"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Discount + Min Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-sm">{errors.discount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, minPrice: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  {errors.minPrice && (
                    <p className="text-red-500 text-sm">{errors.minPrice}</p>
                  )}
                </div>
              </div>

              {/* Total Coupons + Expiry Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Coupons
                  </label>
                  <input
                    type="number"
                    value={formData.totalCoupon}
                    onChange={(e) =>
                      setFormData({ ...formData, totalCoupon: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                  {errors.totalCoupon && (
                    <p className="text-red-500 text-sm">{errors.totalCoupon}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  disabled={loading}
                  type="button"
                  onClick={() => {setShowModal(false),resetForm()}}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {loading ? "Loading...." : (<> {editingCoupon ? "Update Coupon" : "Create Coupon"}</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CouponsHandleModal;
