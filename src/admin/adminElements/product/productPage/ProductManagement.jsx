// src/admin/adminElements/product/productPage/ProductManagement.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Archive,
  Building,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  TAKE_PRODUCT_CATEGORY,
  SUBMIT_NEW_PRODUCT,
  UPDATE_PRODUCT_DATA,
} from "../../../apiServices/productApi";

import EditImage from "../newProductHandle/EditImageModal";
import CropImage from "../newProductHandle/CropImage";
import ProductSpecificationModal from "../newProductHandle/ProductSpecificationModal";
import { validateForm } from "../newProductHandle/productDataValidation";

/**
 * ProductManagement.jsx
 * - Clean, professional minimal layout
 * - Clear labels, placeholders, helper text
 * - Price tiers only on this page (qty / single / double / weight g / shipping)
 * - Image upload dropzone + thumbnails + reorder + crop hook
 *
 * Replace your file with this. Keep CropImage/EditImage/SpecificationModal as-is.
 */

// --- Small subcomponents to keep markup clean ---
function FieldLabel({ children, required = false }) {
  return (
    <label className="block text-sm font-semibold text-gray-800">
      {children} {required && <span className="text-red-600 ml-1">*</span>}
    </label>
  );
}

function SmallHelper({ children }) {
  return <p className="text-xs text-gray-500 mt-1">{children}</p>;
}

function ImageThumb({ preview, idx, onRemove, onCrop, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  return (
    <div className="relative rounded-lg overflow-hidden border bg-white shadow-sm">
      <img src={preview.url} alt={`preview-${idx}`} className="w-full h-36 object-cover" />
      <div className="absolute top-2 right-2 flex gap-2">
        <button type="button" onClick={() => onRemove(idx)} className="bg-red-600 text-white p-1 rounded-md shadow">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="absolute left-2 bottom-2 flex gap-2">
        {!preview.isExisting && (
          <button onClick={() => onCrop(idx)} className="bg-white/90 px-2 py-1 rounded text-xs shadow">
            Crop
          </button>
        )}
        <div className="bg-white/90 px-2 py-1 rounded text-xs">{idx === 0 ? "Main" : "Image"}</div>
      </div>

      <div className="absolute right-2 bottom-2 flex flex-col gap-1">
        <button onClick={() => onMoveUp(idx)} disabled={!canMoveUp} className={`p-1 rounded ${canMoveUp ? "bg-white/90" : "bg-gray-100 cursor-not-allowed"}`}>
          <ChevronUp className="w-4 h-4" />
        </button>
        <button onClick={() => onMoveDown(idx)} disabled={!canMoveDown} className={`p-1 rounded ${canMoveDown ? "bg-white/90" : "bg-gray-100 cursor-not-allowed"}`}>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// --- Main component ---
export default function ProductManagement({ purpose = "add", productData = {}, setPurpose, setProductData, setChange }) {
  const isEdit = purpose === "edit";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // Images
  const [imagePreviews, setImagePreviews] = useState([]); // { url, file?, isExisting? }
  const [imageFiles, setImageFiles] = useState([]);

  // Categories
  const [categories, setCategories] = useState([]);

  // Product specification options (size/paper/finish/corner)
  const [productOptions, setProductOptions] = useState({
    size: productData?.size || [],
    paper: productData?.paper || [],
    finish: productData?.finish || [],
    corner: productData?.corner || [],
  });

  // Price tiers (only on this page)
  const [priceTiers, setPriceTiers] = useState(
    Array.isArray(productData?.priceTiers)
      ? productData.priceTiers.map((pt) => ({
          qty: pt.qty ?? "",
          priceSingle: pt.priceSingle ?? "",
          priceDouble: pt.priceDouble ?? "",
          weightGrams: pt.weightGrams ?? "",
          shippingCharge: pt.shippingCharge ?? "",
        }))
      : []
  );

  // UI
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Modals & crop
  const [openSpecModal, setOpenSpecModal] = useState(false);
  const [showEditImages, setShowEditImages] = useState(false);
  const [cropFile, setCropFile] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // Drag & drop refs
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  // Sync product data on edit
  useEffect(() => {
    if (isEdit && productData) {
      setFormData({
        name: productData.name || "",
        subtitle: productData.subtitle || "",
        description: productData.description || "",
        price: productData.price ?? "",
        stock: productData.stock ?? "",
        category: productData.category?._id ?? productData.category ?? "",
      });

      if (Array.isArray(productData.images)) {
        setImagePreviews(productData.images.map((u) => ({ url: u, isExisting: true })));
      }

      setProductOptions({
        size: productData?.size || [],
        paper: productData?.paper || [],
        finish: productData?.finish || [],
        corner: productData?.corner || [],
      });

      if (Array.isArray(productData.priceTiers)) {
        setPriceTiers(
          productData.priceTiers.map((pt) => ({
            qty: pt.qty ?? "",
            priceSingle: pt.priceSingle ?? "",
            priceDouble: pt.priceDouble ?? "",
            weightGrams: pt.weightGrams ?? "",
            shippingCharge: pt.shippingCharge ?? "",
          }))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, isEdit]);

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        const res = await TAKE_PRODUCT_CATEGORY();
        setCategories(res.categoryData || []);
      } catch (err) {
        console.error("Category load failed", err);
      }
    })();
  }, []);

  // Drag & drop handlers
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDrop = (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      handleIncomingFiles(files);
    };
    const onDragOver = (e) => e.preventDefault();
    el.addEventListener("drop", onDrop);
    el.addEventListener("dragover", onDragOver);
    return () => {
      el.removeEventListener("drop", onDrop);
      el.removeEventListener("dragover", onDragOver);
    };
  }, []);

  // Handle files (drag/drop or input)
  function handleIncomingFiles(files) {
    const imgFiles = files.filter((f) => f.type && f.type.startsWith("image/"));
    imgFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((p) => [...p, { url: ev.target.result, file: f, isExisting: false }]);
        setImageFiles((p) => [...p, f]);
      };
      reader.readAsDataURL(f);
    });
  }
  function onFileInputChange(e) {
    const files = Array.from(e.target.files || []);
    handleIncomingFiles(files);
    e.target.value = null; // allow same file again
  }

  function removeImage(idx) {
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
    setImageFiles((p) => p.filter((_, i) => i !== idx));
  }
  function moveUp(idx) {
    if (idx <= 0) return;
    setImagePreviews((p) => {
      const arr = [...p];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
    setImageFiles((p) => {
      const arr = [...p];
      if (arr.length > idx) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  }
  function moveDown(idx) {
    setImagePreviews((p) => {
      const arr = [...p];
      if (idx >= arr.length - 1) return arr;
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return arr;
    });
    setImageFiles((p) => {
      const arr = [...p];
      if (idx >= arr.length - 1) return arr;
      if (arr.length > idx) [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return arr;
    });
  }

  // Crop open
  function openCrop(idx) {
    const preview = imagePreviews[idx];
    if (!preview) return;
    setCropIndex(idx);
    setCropFile(preview.file || preview.url);
    setShowCropModal(true);
  }

  function onCropComplete(cropped) {
    // cropped -> { url, file }
    if (typeof cropIndex === "number") {
      setImagePreviews((p) => p.map((it, i) => (i === cropIndex ? { url: cropped.url, file: cropped.file, isExisting: false } : it)));
      setImageFiles((p) => p.map((f, i) => (i === cropIndex ? cropped.file : f)));
    }
    setCropIndex(null);
    setCropFile(null);
    setShowCropModal(false);
  }

  // Price tiers helpers
  function addTier() {
    setPriceTiers((p) => [...p, { qty: "", priceSingle: "", priceDouble: "", weightGrams: "", shippingCharge: "" }]);
  }
  function updateTier(idx, key, val) {
    setPriceTiers((p) => p.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  }
  function removeTier(idx) {
    setPriceTiers((p) => p.filter((_, i) => i !== idx));
  }

  const totalWeight = priceTiers.reduce((s, t) => s + Number(t.weightGrams || 0), 0);

  // Form change
  function onFormChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm(formData, setErrors, isEdit, imagePreviews)) {
      return;
    }

    if (isEdit) {
      // update basic fields
      const submit = {
        name: formData.name,
        subtitle: formData.subtitle,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category: typeof formData.category === "object" ? formData.category._id : formData.category,
        productId: productData._id,
        priceTiers,
      };
      setLoading(true);
      try {
        await UPDATE_PRODUCT_DATA(submit);
        toast.success("Product updated successfully");
        setPurpose?.("display");
        setChange?.((p) => !p);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Update failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    // add new product (FormData)
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("subtitle", formData.subtitle);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);
    fd.append("category", typeof formData.category === "object" ? formData.category._id : formData.category);

    imageFiles.forEach((f) => fd.append("images", f));

    // product options arrays (JSON)
    Object.entries(productOptions || {}).forEach(([key, arr]) => {
      if (Array.isArray(arr)) {
        arr.forEach((v) => fd.append(`${key}[]`, JSON.stringify(v)));
      }
    });

    fd.append("priceTiers", JSON.stringify(priceTiers));

    setLoading(true);
    try {
      await SUBMIT_NEW_PRODUCT(fd);
      toast.success("Product added successfully");
      setPurpose?.("display");
      setChange?.((p) => !p);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Add failed";
      toast.error(msg);
      if (msg && msg.includes("Product name already exists")) {
        setErrors((prev) => ({ ...prev, name: msg }));
      }
    } finally {
      setLoading(false);
    }
  }

  // Render categories options
  function categoryOptions() {
    return categories.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name}
      </option>
    ));
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Specification modal */}
      <ProductSpecificationModal
        isEdited={isEdit}
        productId={productData?._id}
        openOptions={openSpecModal}
        setOpenOptions={setOpenSpecModal}
        productOptions={productOptions}
        setCardOptions={(opts) =>
          setProductOptions({
            size: opts?.size ?? productOptions.size,
            paper: opts?.paper ?? productOptions.paper,
            finish: opts?.finish ?? productOptions.finish,
            corner: opts?.corner ?? productOptions.corner,
          })
        }
      />

      {/* Crop & Edit modals */}
      <CropImage imageFile={cropFile} isOpen={showCropModal} setIsOpen={setShowCropModal} onCropComplete={onCropComplete} />
      <EditImage isOpen={showEditImages} onClose={() => setShowEditImages(false)} product={productData} setProduct={setProductData} onCropComplete={onCropComplete} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{isEdit ? "Edit product" : "Add new product"}</h1>
          <p className="mt-1 text-sm text-gray-600">Fill required fields. Price tiers appear on product detail and used for shipping/weight logic.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: main fields */}
            <div className="space-y-4">
              <div>
                <FieldLabel required>Product name</FieldLabel>
                <input aria-label="Product name" name="name" value={formData.name} onChange={onFormChange}
                       placeholder="e.g. Business Cards - Standard" className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-indigo-600" />
                <SmallHelper>Give a clear product name (min 3 chars).</SmallHelper>
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <FieldLabel>Subtitle</FieldLabel>
                <input name="subtitle" value={formData.subtitle} onChange={onFormChange} placeholder="Short subtitle (optional)" className="mt-1 block w-full rounded-md border-gray-300 p-3" />
                <SmallHelper>Shown under the product name.</SmallHelper>
              </div>

              <div>
                <FieldLabel required>Category</FieldLabel>
                <select name="category" value={formData.category || ""} onChange={onFormChange} className="mt-1 block w-full rounded-md border-gray-300 p-3">
                  <option value="">{isEdit ? "Keep current or choose another" : "Select category"}</option>
                  {isEdit && productData?.category?._id && <option value={productData.category._id}>{productData.category.name} (current)</option>}
                  {categoryOptions()}
                </select>
                <SmallHelper>Select the most appropriate category.</SmallHelper>
                {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Base price ($)</FieldLabel>
                  <input name="price" type="number" value={formData.price} onChange={onFormChange} step="0.01" min="0" placeholder="0.00" className="mt-1 block w-full rounded-md border-gray-300 p-3" />
                  <SmallHelper>Primary product price (used if no tiers apply).</SmallHelper>
                </div>
                <div>
                  <FieldLabel required>Stock</FieldLabel>
                  <input name="stock" type="number" value={formData.stock} onChange={onFormChange} min="0" placeholder="0" className="mt-1 block w-full rounded-md border-gray-300 p-3" />
                  <SmallHelper>Number of items available in inventory.</SmallHelper>
                </div>
              </div>
            </div>

            {/* RIGHT: description + images */}
            <div className="space-y-4">
              <div>
                <FieldLabel required>Description</FieldLabel>
                <textarea name="description" rows="6" value={formData.description} onChange={onFormChange} placeholder="Write a clear description for customers." className="mt-1 block w-full rounded-md border-gray-300 p-3" />
                <SmallHelper>Explain key details: paper, finish, turnaround time, etc.</SmallHelper>
              </div>

              <div>
                <FieldLabel>Product images</FieldLabel>
                <div ref={dropRef} className="mt-2 border-2 border-dashed rounded-lg p-6 text-center bg-white cursor-pointer">
                  <input ref={fileRef} id="imageUpload" type="file" accept="image/*" multiple onChange={onFileInputChange} className="hidden" />
                  <label htmlFor="imageUpload" className="flex items-center justify-center gap-3 cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-500" />
                    <div className="text-sm text-gray-700">Click to upload or drag & drop images (PNG/JPG/GIF). Max 10MB each.</div>
                  </label>
                </div>
                <SmallHelper>Tip: first image will be the main thumbnail shown to customers.</SmallHelper>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((p, i) => (
                      <ImageThumb
                        key={i}
                        preview={p}
                        idx={i}
                        onRemove={removeImage}
                        onCrop={openCrop}
                        onMoveUp={moveUp}
                        onMoveDown={moveDown}
                        canMoveUp={i > 0}
                        canMoveDown={i < imagePreviews.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Tiers area */}
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Price Tiers</h3>
                <p className="text-sm text-gray-500">Define quantity-based pricing. Shown on product detail and used for checkout weight/shipping.</p>
              </div>
              <div>
                <button type="button" onClick={addTier} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-600 text-white">
                  <Plus className="w-4 h-4" /> Add tier
                </button>
              </div>
            </div>

            <div className="mt-4 border rounded overflow-hidden">
              <div className="grid grid-cols-5 bg-gray-100 text-xs font-semibold text-gray-700 p-3">
                <div className="pl-2">Qty</div>
                <div>Single-side ($)</div>
                <div>Double-side ($)</div>
                <div>Weight (g)</div>
                <div>Shipping ($)</div>
              </div>

              <div className="p-3 space-y-3">
                {priceTiers.length === 0 ? (
                  <div className="text-sm italic text-gray-500">No tiers defined. Click Add tier to create rows (e.g. 100 → Single $35 / Double $45 / Weight 200g / Shipping $20).</div>
                ) : (
                  priceTiers.map((t, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-3 items-end bg-white p-2 rounded border">
                      <div>
                        <input type="number" value={t.qty} onChange={(e) => updateTier(idx, "qty", e.target.value)} className="w-full p-2 border rounded" placeholder="100" />
                      </div>
                      <div>
                        <input type="number" step="0.01" value={t.priceSingle} onChange={(e) => updateTier(idx, "priceSingle", e.target.value)} className="w-full p-2 border rounded" placeholder="35.00" />
                      </div>
                      <div>
                        <input type="number" step="0.01" value={t.priceDouble} onChange={(e) => updateTier(idx, "priceDouble", e.target.value)} className="w-full p-2 border rounded" placeholder="45.00" />
                      </div>
                      <div>
                        <input type="number" value={t.weightGrams} onChange={(e) => updateTier(idx, "weightGrams", e.target.value)} className="w-full p-2 border rounded" placeholder="200" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" step="0.01" value={t.shippingCharge} onChange={(e) => updateTier(idx, "shippingCharge", e.target.value)} className="flex-1 p-2 border rounded" placeholder="20.00" />
                        <button type="button" onClick={() => removeTier(idx)} className="p-2 bg-red-600 text-white rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">Total weight for tiers: <strong>{totalWeight} g</strong></div>
          </div>

          {/* Product specs trigger and action buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto">
              <button type="button" onClick={() => setOpenSpecModal(true)} className="w-full sm:w-auto px-6 py-2 rounded bg-blue-700 text-white">
                {isEdit ? "Edit product specifications" : "Add product specifications"}
              </button>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button type="button" onClick={() => setPurpose?.("display")} disabled={loading} className="px-6 py-2 rounded bg-gray-200 text-gray-800 w-full sm:w-auto">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-indigo-600 text-white w-full sm:w-auto">
                {loading ? "Saving..." : isEdit ? "Update product" : "Add product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
