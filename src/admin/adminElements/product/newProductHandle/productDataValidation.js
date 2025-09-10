

export const validateForm = (formData, setErrors, isEdit, imagePreviews) => {
  const newErrors = {};

  // Name
  if (!formData.name || formData.name.trim().length < 3) {
    newErrors.name = "Product name must be at least 3 characters long";
  }

  // Brand
  if (!formData.subtitle || formData.subtitle.trim().length < 5) {
    newErrors.subtitle = "subtitle must be at least 5 characters long";
  }

  // Price
  const price = parseFloat(formData.price);
  if (!formData.price || isNaN(price) || price <= 0) {
    newErrors.price = "Enter a valid positive price";
  }

  // Stock
  const stock = parseInt(formData.stock);
  if (!formData.stock && formData.stock !== 0) {
    newErrors.stock = "Stock is required";
  } else if (isNaN(stock) || stock < 1) {
    newErrors.stock = "Enter a valid stock (1 or more)";
  }

  // Category
  if (
    !formData.category ||
    (typeof formData.category === 'object' && !formData.category._id) ||
    (typeof formData.category === 'string' && formData.category.trim() === "")
  ) {
    newErrors.category = "Select a valid category";
  }

  // Description
  if (!formData.description || formData.description.trim().length < 10) {
    newErrors.description = "Description must be at least 10 characters long";
  }

  // Images (only if not editing)
  if (!isEdit) {
  if (!imagePreviews || imagePreviews.length === 0) {
    newErrors.images = "At least one product image is required";
  } else if (imagePreviews.length > 10) {
    newErrors.images = "You can upload a maximum of 10 images";
  }
}

  // Set errors and return validity
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
