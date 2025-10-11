import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Review from "./Review";
import Cropper from "react-easy-crop"; // make sure you installed: npm install react-easy-crop
// import CropImage from "./CropImage";
// import CustomRequirement from "./CustomerRequirement";
import { API_BASE_URL } from "../../config";
import { FaWhatsapp, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null); // dataURL shown in cropper
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [originalImage, setOriginalImage] = useState(null);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const hiddenCropFileRef = useRef(null); // optional hidden file input
  // UI state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedCorner, setSelectedCorner] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviews, setShowReviews] = useState(false);
const [selectedPaper, setSelectedPaper] = useState(null);

// In ProductDetail.jsx, add state for menu
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


const [isPaperDropdownOpen, setIsPaperDropdownOpen] = useState(false);
const [isFinishDropdownOpen, setIsFinishDropdownOpen] = useState(false);

const [isCropOpen, setIsCropOpen] = useState(false);
const [croppedImage, setCroppedImage] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [orderId, setOrderId] = useState(null);
const [selectedOption, setSelectedOption] = useState(null);

const [frontFile, setFrontFile] = useState(null);
const [backFile, setBackFile] = useState(null);
const [frontPreview, setFrontPreview] = useState(null);
const [backPreview, setBackPreview] = useState(null);

const [croppingSide, setCroppingSide] = useState(null); // "front" | "back"
const [croppedImages, setCroppedImages] = useState({ front: null, back: null });




// Quantity selector
// const priceOptions = [
//   { qty: 100, price: 39 },
//   { qty: 250, price: 60 },
//   { qty: 500, price: 100 },
//   { qty: 1000, price: 120 },
//   { qty: 2000, price: 200 },
// ];

// const [selectedQty, setSelectedQty] = useState(priceOptions[0].qty);
// const [displayPrice, setDisplayPrice] = useState(priceOptions[0].price);



const [showContactModal, setShowContactModal] = useState(false);
const [showScratchModal, setShowScratchModal] = useState(false);
const [showGuideline, setShowGuideline] = useState(false);
const [uploadedImage, setUploadedImage] = useState(null);
const [customText, setCustomText] = useState("");
const [submittedText, setSubmittedText] = useState(null);
const [uploadedFile, setUploadedFile] = useState(null);
const [preparedPreview, setPreparedPreview] = useState(null);
const IMGBB_API_KEY = "0dc969770aaafeeba77f84c1534e4fad"; // your imgbb API key
// const FRAME_URL = "https://i.ibb.co/3y63T95k/imageedit-1-7441844514.png";   // <- REPLACE with direct image URL from ibb (right-click image â†' Copy image address)
const [uploadedUrl, setUploadedUrl] = useState(null);     // stores the final uploaded imgbb URL



const frameOverlays = {
  rhomboid: "https://i.ibb.co/k2xR06Fq/Bamboo-Photo-Frame-Printing-Rhomboid-Shape-Magnetic.png",
  rectangular: "https://i.ibb.co/d4cKP6j7/Bamboo-Rectangular-Shape-Photo-Frame.png",
  round: "https://i.ibb.co/tPmMxvJp/Round-Shape-Bamboo-Photo-Frame.png",
  heart: "https://i.ibb.co/cccNPzSq/Bamboo-Photo-Frame-heart-shape.png",
  aluminum: "https://i.ibb.co/hxH0DzWY/Aluminum-Photo-Frame-Printing-with-bamboo-base.png",
  glass: "https://i.ibb.co/chq76DzQ/glass-photo-frame.png",
  square: "https://i.ibb.co/7J5XVqCm/Square-Shape-stone-photo-frame.png",
  heartstone:" https://i.ibb.co/mCPhM6r0/heart-Shape-stone-photo-frame.png",
  door :" https://i.ibb.co/93rMVXMF/Door-Shape.png",
  rectangularstone:"https://i.ibb.co/tTsVZMbz/Rectangular-Shape-stone-photo-frame.png",
};


// Get the frame type from product data (expects product.frameType to match one of the keys above)
const productFrameType = product?.frameType?.toLowerCase().trim();
// const [selectedFrame, setSelectedFrame] = useState(productFrameType || ""); 
// const FRAME_URL = frameOverlays[selectedFrame];






const detectFrameFromProductName = (productName = "") => {
  const name = productName.toLowerCase().trim();
  
  // Check for frame types in product name
  if (name.includes("rhomboid")) return "rhomboid";
  if (name.includes("rectangular") && name.includes("stone")) return "rectangularstone";
  if (name.includes("rectangular")) return "rectangular";
  if (name.includes("round")) return "round";
  if (name.includes("heart") && name.includes("stone")) return "heartstone";
  if (name.includes("heart")) return "heart";
  if (name.includes("aluminum") || name.includes("aluminium")) return "aluminum";
  if (name.includes("glass")) return "glass";
  if (name.includes("square") && name.includes("stone")) return "square";
  if (name.includes("square")) return "rectangular"; // default square to rectangular
  if (name.includes("door")) return "door";
  
  // Default fallback
  return "rectangular";
};

// Get detected frame type
const detectedFrame = detectFrameFromProductName(product?.name);
const [selectedFrame, setSelectedFrame] = useState(""); 

// Auto-set frame when product loads
useEffect(() => {
  if (detectedFrame && frameOverlays[detectedFrame]) {
    setSelectedFrame(detectedFrame);
  }
}, [detectedFrame]);

const FRAME_URL = frameOverlays[selectedFrame];

// const [selectedFrame, setSelectedFrame] = useState(""); // default
// const FRAME_URL = frameOverlays[selectedFrame];
// ✅ only run .find if product and priceTiers exist
const [selectedTier, setSelectedTier] = useState(() => {
  if (product?.priceTiers) {
    return product.priceTiers.find((tier) => tier.qty === 200) || null;
  }
  return null;
});

// ✅ in case product loads later, auto-select 200 once it's available
useEffect(() => {
  if (product?.priceTiers && !selectedTier) {
    const defaultTier = product.priceTiers.find((tier) => tier.qty === 200);
    if (defaultTier) setSelectedTier(defaultTier);
  }
}, [product, selectedTier]);


const [selectedDesignType, setSelectedDesignType] = useState("single");

 const getPrice = (tier) =>
    selectedDesignType === "single" ? tier.priceSingle : tier.priceDouble;


// âœ… add this hook at the top of your file
function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}





// inside your component
const isMobile = useMediaQuery("(max-width: 768px)");


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", id);

        // Try different endpoints
        const endpoints = [
          `${API_BASE_URL}/product/productDetails/${id}`,
        ];

        let res;
        let lastError;
        let workingEndpoint;

        for (const endpoint of endpoints) {
         try {
            console.log("🔍 Trying endpoint:", endpoint);
            res = await fetch(endpoint, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });

            if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
              workingEndpoint = endpoint;
              break;
            } else {
              lastError = `HTTP ${res.status} - ${endpoint}`;
            }
          } catch (err) {
            lastError = err.message;
          }
        }

        if (!res || !res.ok || !workingEndpoint) {
          // fallback: fetch list
          const listRes = await fetch(`${API_BASE_URL}/products`);
          if (listRes.ok) {
            const listData = await listRes.json();
            const products = listData.productData || listData.data || listData.products || listData;
            if (Array.isArray(products)) {
              const foundProduct = products.find(p => (p._id === id) || (p.id === id));
              if (foundProduct) {
                setProduct(foundProduct);
                if (foundProduct.sizes?.length) setSelectedSize(foundProduct.sizes[0].label);
                if (foundProduct.finishes?.length) setSelectedFinish(foundProduct.finishes[0].label);
                if (foundProduct.corners?.length) setSelectedCorner(foundProduct.corners[0].label);
                return;
              } else {
                setError(`Product ID "${id}" not found.`);
                return;
              }
            }
          }
          throw new Error(`All methods failed. Last error: ${lastError}`);
        }

        const data = await res.json();
        const productData = data.data || data;
        setProduct(productData);
        if (productData.sizes?.length) setSelectedSize(productData.sizes[0].label);
        if (productData.finishes?.length) setSelectedFinish(productData.finishes[0].label);
        if (productData.corners?.length) setSelectedCorner(productData.corners[0].label);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  // image navigation
  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex(prev => (prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1));
  };

 // ---------- REPLACE handleAddToCart WITH THIS COMPLETE BLOCK ----------
const handleAddToCart = async () => {
  try {
    if (!product?._id) {
      alert("Product not loaded yet.");
      return;
    }

    // Determine quantity: prefer selectedTier.qty, fall back to any selectedQty or 1
    const qty = Number(selectedTier?.qty || selectedQty || 1) || 1;

    // Normalize option values (send primitives to backend)
    const normalizeOption = (opt) => {
      if (opt === null || opt === undefined) return null;
      if (typeof opt === "string" || typeof opt === "number") return String(opt);
      // if object, try common keys
      if (typeof opt === "object") {
        return String(opt?.name ?? opt?.label ?? opt?.value ?? opt?.id ?? JSON.stringify(opt));
      }
      return String(opt);
    };

    const sizeVal = normalizeOption(selectedSize);
    const finishVal = normalizeOption(selectedFinish);
    const cornerVal = normalizeOption(selectedCorner);
    const paperVal = normalizeOption(selectedPaper);
    const designTypeVal = normalizeOption(selectedDesignType);

    // Raw options object — handy for frontend/backends with different shapes
    const rawOptions = {
      size: selectedSize ?? null,
      finish: selectedFinish ?? null,
      corner: selectedCorner ?? null,
      paper: selectedPaper ?? null,
      designType: selectedDesignType ?? null,
      customText: customText ?? null,
      preparedPreview: preparedPreview ?? null,
      croppedImages: croppedImages ?? null,
    };

    // Build payload to send to server addToCart endpoint
    const bodyPayload = {
      productId: product._id,
      quantity: qty,
      // send both simple primitives and raw object (server can pick what it needs)
      size: sizeVal,
      finish: finishVal,
      corner: cornerVal,
      paper: paperVal,
      designType: designTypeVal,
      customText: customText || null,
      preparedPreview: preparedPreview || null, // base64 or uploaded URL if available
      croppedImages: croppedImages || null,     // { front: base64, back: base64 } if present
      raw: rawOptions,
    };

    // Debug log during development (remove in production)
    console.log("DEBUG addToCart payload:", bodyPayload);

    const res = await fetch(`${API_BASE_URL}/addToCart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send login cookie/session
      body: JSON.stringify(bodyPayload),
    });

    const data = await res.json().catch(() => ({ message: "Invalid JSON response" }));

    if (res.ok) {
      // success — show confirmation and go to cart
      alert("✓ Product added to cart!");
      navigate("/cart");
    } else if (res.status === 401) {
      // session expired / unauthorized
      alert("Session expired. Please login again.");
      navigate("/signin");
    } else {
      // show server-provided message when available
      alert(data?.message || "Failed to add product to cart.");
      console.error("addToCart error:", data);
    }
  } catch (err) {
    console.error("Add to cart failed:", err);
    alert("Something went wrong. Please try again.");
  }
};
// ---------- END REPLACEMENT ----------


  // reviews
  const handleSubmitReview = () => {
    if (!reviewText.trim() || !rating) {
      alert("Please give rating and write review.");
      return;
    }
    console.log("Submitting review:", { rating, reviewText });
    setReviewText('');
    setRating(0);
    alert("Review submitted!");
  };






const handleFileChange = (e, side) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const dataUrl = reader.result;
    setOriginalImage(dataUrl);   // âœ… save original
    setCroppingImage(dataUrl);   // show in cropper
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppingSide(side);
    setIsCropOpen(true);
  };
  reader.readAsDataURL(file);
  e.target.value = "";
};

const getCroppedImg = (imageSrc, cropPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(cropPixels.width));
      canvas.height = Math.max(1, Math.round(cropPixels.height));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        Math.round(cropPixels.x),
        Math.round(cropPixels.y),
        Math.round(cropPixels.width),
        Math.round(cropPixels.height),
        0,
        0,
        Math.round(cropPixels.width),
        Math.round(cropPixels.height)
      );
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    image.onerror = (err) => reject(err);
  });
};



const openCropWithFile = (file, side = "uploaded") => {
  if (!file) return;
  if (!file.type?.startsWith?.("image/")) {
    alert("Only image files allowed");
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    const dataUrl = reader.result;
    setOriginalImage(dataUrl);     // store original so we can revert
    setCroppingImage(dataUrl);     // show in cropper
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppingSide(side);
    setIsCropOpen(true);
  };
  reader.readAsDataURL(file);
};

// react-easy-crop callback
const onCropComplete = useCallback((_, croppedPixels) => {
  setCroppedAreaPixels(croppedPixels);
}, []);
const handleRevertToOriginal = () => {
  if (!originalImage) return;
  setCroppingImage(originalImage);
  setCrop({ x: 0, y: 0 });
  setZoom(1);
  setCroppedAreaPixels(null);
  // do NOT auto-save â€" user must press Save Crop
};
// Save crop: produce base64 and store into frontPreview/backPreview (depending on croppingSide)
const handleSaveCrop = async () => {
  try {
    if (!croppingImage || !croppedAreaPixels) {
      alert("Please adjust and then press Save Crop.");
      return;
    }
    const croppedBase64 = await getCroppedImg(croppingImage, croppedAreaPixels);

    // apply cropped result depending on which side/context
    if (croppingSide === "front") {
      setFrontPreview?.(croppedBase64);            // optional - keep if you have front preview state
      setCroppedImages?.((p) => ({ ...(p || {}), front: croppedBase64 }));
    } else if (croppingSide === "back") {
      setBackPreview?.(croppedBase64);
      setCroppedImages?.((p) => ({ ...(p || {}), back: croppedBase64 }));
    } else {
      // default: uploaded / prepared preview
      setPreparedPreview?.(croppedBase64);
      setUploadedImage?.(croppedBase64);
    }

    // close and reset crop UI
    setIsCropOpen(false);
    setCroppingImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppingSide(null);
  } catch (err) {
    console.error("Crop save error:", err);
    alert("Error saving crop  check console.");
  }
};
// const handleCropComplete = (croppedDataUrl) => {
//   if (croppingSide === "front") {
//     setFrontPreview(croppedDataUrl);
//   } else if (croppingSide === "back") {
//     setBackPreview(croppedDataUrl);
//   }
//   setIsCropOpen(false);
//   setCroppingSide(null);
// };


const handleSubmit = () => {
  if (!croppedImage) {
    alert("Please upload and crop an image before submitting.");
    return;
  }

  // For now just log/alert
  console.log("Submitted cropped image:", croppedImage);
  alert("Image submitted successfully!");

  // ðŸš€ Later, replace with API upload
  // const formData = new FormData();
  // formData.append("image", croppedImage.file);
  // await fetch("/api/upload", { method: "POST", body: formData });
};


const handleScratchSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const payload = {
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    requirement: formData.get("requirement"),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/scratch-design`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Your design request has been submitted!");
      e.target.reset();
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting request.");
  }
};

const handleCropComplete = (cropped, side) => {
  setCroppedImages((prev) => ({ ...prev, [side]: cropped }));
  setIsCropOpen(false);
};

const handleUploadSubmit = () => {
  if (!frontPreview || !backPreview) {
    alert("Please upload both front and back images!");
    return;
  }
  alert("Design submitted successfully!");
};


// prepare local preview by compositing uploadedImage + frame (no upload)
const preparePreviewLocal = async (uploadedUrl) => {
  try {
    if (!uploadedUrl) return;

    const outputW = 1200;
    const outputH = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext("2d");

    // white background (or transparent)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputW, outputH);

    // load uploaded photo (do NOT set crossOrigin for blob: URLs)
    const loadImg = (src, cross = false) =>
      new Promise((resolve, reject) => {
        const i = new Image();
        if (cross) i.crossOrigin = "anonymous";
        i.onload = () => resolve(i);
        i.onerror = (e) => reject(new Error("Failed to load image: " + src));
        i.src = src;
      });

    const photo = await loadImg(uploadedUrl, false);

    // cover-fit the photo into canvas
    const scale = Math.max(outputW / photo.width, outputH / photo.height);
    const drawW = photo.width * scale;
    const drawH = photo.height * scale;
    const dx = (outputW - drawW) / 2;
    const dy = (outputH - drawH) / 2;
    ctx.drawImage(photo, dx, dy, drawW, drawH);

    // load frame image (must be same size or will be scaled)
    // using crossOrigin for remote frame (imgbb/ibb) â€" keep it so we can access pixel data
    const frameImg = await loadImg(FRAME_URL, true);

    // draw frame into offscreen canvas to edit pixels
    const fCanvas = document.createElement("canvas");
    fCanvas.width = outputW;
    fCanvas.height = outputH;
    const fCtx = fCanvas.getContext("2d");
    fCtx.drawImage(frameImg, 0, 0, outputW, outputH);

    // convert near-white to transparent
    try {
      const imgData = fCtx.getImageData(0, 0, outputW, outputH);
      const data = imgData.data;
      const threshold = 245; // tweak if your frame has slightly off-white pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i+3] = 0; // make pixel transparent
        }
      }
      fCtx.putImageData(imgData, 0, 0);
    } catch (err) {
      // getImageData can throw if frame server doesn't allow CORS
      console.warn("Could not access frame pixels (CORS). Frame may not become transparent.", err);
      // fallback: we will just draw frame as-is
    }

    // draw processed frame on main canvas
    ctx.drawImage(fCanvas, 0, 0, outputW, outputH);

    // set prepared preview in state (shows on UI)
    const finalDataUrl = canvas.toDataURL("image/png");
    setPreparedPreview(finalDataUrl);
  } catch (err) {
    console.error("preparePreviewLocal error:", err);
    // still show uploadedImage if compositing fails
    setPreparedPreview(null);
  }
};

const handlePersonalisedUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // validations...
  // keep uploadedFile
  setUploadedFile(file);

  // create object URL and show raw preview
  const objectUrl = URL.createObjectURL(file);
  setUploadedImage(objectUrl);

  // build prepared preview immediately (composite) â€" this will set preparedPreview
  // (do NOT await here to avoid blocking UI; but can await if desired)
  preparePreviewLocal(objectUrl);

  // ... optionally read base64 if you need it later
};



// add a cleanup effect to revoke object URLs when no longer needed

useEffect(() => {

  return () => {

    if (uploadedImage && uploadedImage.startsWith("blob:")) {

      URL.revokeObjectURL(uploadedImage);

    }

  };

}, [uploadedImage]);


const handlePrepareAndUpload = async () => {
  try {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }

    // Prepare canvas size and draw photo + frame + optional text
    const canvas = document.createElement("canvas");
    const outputW = 1200;
    const outputH = 1200; // square output works better for your frame
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext("2d");

    // white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputW, outputH);

    // load uploaded image
    const photo = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load uploaded image"));
      img.src = uploadedImage;
    });

    // cover-fit calculation
    const scale = Math.max(outputW / photo.width, outputH / photo.height);
    const drawW = photo.width * scale;
    const drawH = photo.height * scale;
    const dx = (outputW - drawW) / 2;
    const dy = (outputH - drawH) / 2;
    ctx.drawImage(photo, dx, dy, drawW, drawH);

    // optional text
    if (customText && customText.trim()) {
      ctx.fillStyle = "#111";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(customText.trim(), outputW / 2, outputH - 60);
    }

    // load frame image
    const frameImg = await new Promise((resolve, reject) => {
      const f = new Image();
      f.crossOrigin = "anonymous";
      f.onload = () => resolve(f);
      f.onerror = () => reject(new Error("Failed to load frame image"));
      f.src = FRAME_URL;
    });

    // create offscreen canvas to process frame
    const fCanvas = document.createElement("canvas");
    fCanvas.width = outputW;
    fCanvas.height = outputH;
    const fCtx = fCanvas.getContext("2d");
    fCtx.drawImage(frameImg, 0, 0, outputW, outputH);

    // make near-white pixels transparent
    const imgData = fCtx.getImageData(0, 0, outputW, outputH);
    const data = imgData.data;
    const threshold = 245; // tweak if needed
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r >= threshold && g >= threshold && b >= threshold) {
        data[i + 3] = 0; // transparent
      }
    }
    fCtx.putImageData(imgData, 0, 0);

    // draw cleaned frame on main canvas
    ctx.drawImage(fCanvas, 0, 0, outputW, outputH);

    // create preview + upload
    const finalDataUrl = canvas.toDataURL("image/png");
    setPreparedPreview(finalDataUrl);

    // upload to imgbb
    const base64 = finalDataUrl.split(",")[1];
    const form = new FormData();
    form.append("key", IMGBB_API_KEY);
    form.append("image", base64);
    form.append("name", `product_${id || "preview"}`);

    const uploadRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: form,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson?.data?.url) {
      throw new Error("Upload failed");
    }

    setUploadedUrl(uploadJson.data.url);
    alert("âœ… Prepared image uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("âŒ Error preparing or uploading image: " + (err.message || err));
  }
};



  // âœ… handle submit
  const handletextSubmit = () => {
    if (!customText.trim()) {
      alert("Please enter some text before submitting!");
      return;
    }

    // Here you could POST to backend instead of just setting state
    // fetch(`${API_BASE_URL}/customText`, { method: "POST", body: JSON.stringify({ productId: id, text: customText }) })

    setSubmittedText(customText);
    setCustomText(""); // clear input
  };

// ProductDetail.jsx
// FULL handleUploadYourDesign - paste in place of your existing function
const handleUploadYourDesign = () => {
  // Ensure selected tier exists
  if (!selectedTier) {
    alert("Please select a quantity tier first.");
    return;
  }

  // Get safe primitive values for options (use .name/.label if the selected item is an object)
  const qtyString = String(selectedTier?.qty ?? selectedTier ?? 1);
  const sizeVal = selectedSize ? String(selectedSize?.name ?? selectedSize?.label ?? selectedSize) : "";
  const finishVal = selectedFinish ? String(selectedFinish?.name ?? selectedFinish?.label ?? selectedFinish) : "";
  const cornerVal = selectedCorner ? String(selectedCorner?.name ?? selectedCorner?.label ?? selectedCorner) : "";
  const paperVal = selectedPaper ? String(selectedPaper?.name ?? selectedPaper?.label ?? selectedPaper) : "";
  const designTypeVal = selectedDesignType || "single";

  // Build query string (we include productId here as query param - guaranteed)
  const params = new URLSearchParams({
    productId: String(id),            // <-- IMPORTANT: send product id in query param
    designType: String(designTypeVal),
    quantity: qtyString,
    size: sizeVal,
    finish: finishVal,
    corner: cornerVal,
    paper: paperVal
  });

  // Navigate to upload page with productId in query
  navigate(`/upload-design?${params.toString()}`);
};

 


  // ---- STYLES ----
  const styles = {
    container: {  minHeight: "100vh" },
    imageSection: {
      flex: 1,
      maxWidth: isMobile ? '100%' : '500px',
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? 'auto' : '100px',
      height: 'fit-content'
    },
  detailsSection: {
  flex: 1.2,
  backgroundColor: "white",
  borderRadius: isMobile ? "8px" : "12px",
  padding: isMobile ? "12px" : "30px"
},

    reviewsSection: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '20px' : '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '40px'
    },
   thumbnailContainer: {
  display: "flex",
  gap: "10px",
  marginTop: "12px",
  overflowX: isMobile ? "scroll" : "visible",
  paddingBottom: isMobile ? "8px" : "0"
},

    thumbnail: {
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0
    },
    button: {
      width: '100%',
      padding: '15px',
      background: '#2563EB',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    backButton: {
      padding: "10px 20px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px"
    },
   
};
const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  transition: "0.2s",
  color: "#111",
  background: "#f9fafb"
};

/* ---- Styles ---- */
const fileCardStyle = (color) => ({
  border: `2px solid ${color}`,
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "500",
  color: "#1f2937",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  background: "#fff",
  transition: "all 0.2s ease-in-out",
});

const fileLabelStyle = {
  fontWeight: "700",
  fontSize: "16px",
  textTransform: "uppercase",
};


  // loading
  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
  if (!product) return <p style={{ textAlign: "center", padding: "40px" }}>Product not found.</p>;
console.log(id);


 // âœ… prevent crash if product not yet loaded
  if (!product) {
    return <div>Loading product...</div>;
  }


const rawCategory = product?.categories ?? product?.category;
const categoryName = Array.isArray(rawCategory)
  ? rawCategory[0]?.name
  : (typeof rawCategory === "object" ? rawCategory?.name : rawCategory);

const normalize = (str = "") =>
  String(str || "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const isPersonalisedGift = normalize(categoryName) === "personalized gifts";
const isButtonBadge = normalize(product?.name || "").includes("button badge") || 
                      normalize(categoryName).includes("button badge");
  return (
    <div style={styles.container}>
      <div className="responsive-container">
      <Header onMenuStateChange={setMobileMenuOpen}/>

        {/* Main */}
     <div style={{
  maxWidth: isMobile ? "100%" : "65%",
   margin: "0 auto",
  padding: isMobile ? "16px" : "40px 20px",
  width: "100%",
  marginLeft: isMobile ? "0" : "17%",
  marginRight: isMobile ? "0" : "9%",
}}>

           <div style={{
    display: 'flex',
    gap: isMobile ? '20px' : '30px',
    flexDirection: isMobile ? 'column' : 'row'
  }}>
          {/* Images */}
          <div style={styles.imageSection}>
            {product.images?.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={typeof product.images[currentIndex] === 'string' ? product.images[currentIndex] : product.images[currentIndex]?.url || ''}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
                />
                {product.images.length > 1 && (
                  <>
                    <button onClick={goToPrev} style={{ position: 'absolute', left: '15px', top: '50%' }}>‹</button>
                    <button onClick={goToNext} style={{ position: 'absolute', right: '15px', top: '50%' }}>›</button>
                  </>
                )}
                <div style={styles.thumbnailContainer}>
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={typeof img === 'string' ? img : img?.url || ''}
                      onClick={() => setCurrentIndex(i)}
                      style={{
                        ...styles.thumbnail,
                        border: i === currentIndex ? '2px solid #00b388' : '2px solid transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : <div>No Image</div>}
          </div>

          {/* Details */}
 <div style={styles.detailsSection}>
  {/* Product Title */}
<h1
  style={{
    fontSize: window.innerWidth <= 768 ? "20px" : "28px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#007bff",
    marginTop: window.innerWidth <= 768 ? "-40px" : "-40px",
  }}
>
  {product.name}
</h1>

   <h3 style={{ fontSize: window.innerWidth <= 768 ? "18px" : "28px", fontWeight: "400", marginBottom: "8px" ,color:"#111316ff" }}>
    {product.subtitle}
  </h3>





  {/* Rating */}
  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "4px" }}>
    <span style={{ color: "#007bff", fontSize: window.innerWidth <= 768 ? "16px" : "20px", marginRight: "8px" }}>★★★★★</span>
    <span style={{ fontSize: window.innerWidth <= 768 ? "13px" : "15px", color: "#555" }}>
  {product?.rating?.count > 0
    ? `${product.rating.count} reviews`
    : "No reviews yet"}
</span>

  </div>



<p
  style={{
    fontSize: window.innerWidth <= 768 ? "14px" : "16px",
    fontWeight: "500",
    color: "#444",
    marginBottom: "16px",
 
    // backgroundColor: "#a5a7c1ff", // soft yellow highlight
    padding: window.innerWidth <= 768 ? "10px 12px" : "12px 16px",
    // borderLeft: "4px solid #ff9800", // orange accent bar
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    lineHeight: "1.6",
  }}
>
  {product.description}
</p>
  {/* Premium Section */}
  {/* <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
    Premium as standard
  </h2>
  <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.6", marginBottom: "16px" }}>
    {product.description}
  </p> */}
  {/* Sizes */}
{/* Sizes */}

{product.sizes?.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h3 style={{ 
      fontSize: isMobile ? "16px" : "18px", 
      fontWeight: "600", 
      marginBottom: "12px" 
    }}>
      Available Sizes
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile 
          ? "repeat(auto-fit, minmax(140px, 1fr))" 
          : "repeat(auto-fit, minmax(160px, 1fr))",
        gap: isMobile ? "12px" : "16px",
      }}
    >
      {product.sizes.map((s, i) => {
        // Map size name to image - Only Standard and Square
        const sizeImages = {
          standard: "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-standard-526x325.jpg",
          square: "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-square-526x325.jpg"
        };

        // Get the size name - handle both string and object formats
        const sizeName = typeof s === 'string' ? s : (s.name || s.label || '');
        const sizeKey = sizeName.toLowerCase().trim();
        
        // Skip if not standard or square
        if (sizeKey !== 'standard' && sizeKey !== 'square') {
          return null;
        }

        const imgUrl = sizeImages[sizeKey];

        // FIXED: Better comparison logic
        let isSelected = false;
        
        if (selectedSize) {
          // If selectedSize is a string
          if (typeof selectedSize === 'string') {
            isSelected = selectedSize.toLowerCase().trim() === sizeKey;
          } 
          // If selectedSize is an object
          else if (typeof selectedSize === 'object') {
            const selectedSizeName = (selectedSize.name || selectedSize.label || '').toLowerCase().trim();
            isSelected = selectedSizeName === sizeKey;
          }
        }

        return (
          <div
            key={i}
            onClick={() => setSelectedSize(s)}
            style={{
              border: isSelected
                ? "3px solid #007bff"
                : "2px solid #ddd",
              borderRadius: "8px",
              padding: isMobile ? "8px" : "10px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease-in-out",
              boxShadow: isSelected
                ? "0px 4px 12px rgba(0, 123, 255, 0.3)"
                : "0px 2px 4px rgba(0, 0, 0, 0.05)",
              backgroundColor: isSelected ? "#f0f8ff" : "#fff",
              transform: isSelected ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "#007bff";
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0, 123, 255, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt={sizeName}
                style={{
                  width: "100%",
                  height: isMobile ? "80px" : "100px",
                  objectFit: "contain",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  opacity: isSelected ? 1 : 0.85,
                  transition: "opacity 0.2s ease"
                }}
              />
            )}
            <div style={{ 
              fontSize: isMobile ? "13px" : "14px", 
              fontWeight: isSelected ? "700" : "500",
              textTransform: "capitalize",
              color: isSelected ? "#007bff" : "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "4px"
            }}>
              {sizeName}
              {isSelected && (
                <span style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontSize: "10px"
                }}>
                  ✓
                </span>
              )}
            </div>
            <div style={{ 
              fontSize: isMobile ? "12px" : "13px", 
              color: isSelected ? "#0066cc" : "#555",
              fontWeight: isSelected ? "600" : "400"
            }}>
              {s.size ? `${s.size.width} × ${s.size.height}` : ''}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}



{/* Paper Options - Advanced Powerful Dropdown */}
{product.papers?.length > 0 && (
  <div style={{ marginBottom: "32px" }}>
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      marginBottom: "12px"
    }}>
      <div>
        <h3 style={{ 
          fontSize: "22px", 
          fontWeight: "700", 
          marginBottom: "4px",
          color: "#0f172a",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: "-0.02em"
        }}>
          Paper Selection
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#64748b",
          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: "500"
        }}>
          Choose premium paper quality • {product.papers.length} options available
        </p>
      </div>
      <div style={{
        padding: "8px 12px",
        backgroundColor: selectedPaper ? "#007abf" : "#e2e8f0",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        color: selectedPaper ? "#ffffff" : "#007abf",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {selectedPaper ? "Selected" : "Choose"}
      </div>
    </div>
    
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setIsPaperDropdownOpen(!isPaperDropdownOpen)}
        style={{
          backgroundColor: isPaperDropdownOpen ? "#007abf" : "#f8fafc",
          border: `3px solid ${isPaperDropdownOpen ? "#007abf" : "#e2e8f0"}`,
          borderRadius: "16px",
          padding: "16px 20px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isPaperDropdownOpen 
            ? "0 20px 40px -12px rgba(0, 122, 191, 0.3), 0 0 0 1px rgba(255,255,255,0.1)" 
            : "0 4px 15px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "60px",
          transform: isPaperDropdownOpen ? "translateY(-2px)" : "translateY(0)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: selectedPaper ? "4px" : "0"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "12px",
              backgroundColor: selectedPaper 
                ? (isPaperDropdownOpen ? "rgba(255,255,255,0.2)" : "#007abf")
                : "#007abf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isPaperDropdownOpen ? "#ffffff" : "#ffffff"} strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            
            <div>
              <div style={{
                fontSize: "16px",
                fontWeight: "700",
                color: isPaperDropdownOpen ? "#ffffff" : "#0f172a",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "-0.01em",
                transition: "color 0.3s ease"
              }}>
                {selectedPaper ? selectedPaper.name : "Select Your Paper"}
              </div>
              {selectedPaper && (
                <div style={{
                  fontSize: "12px",
                  color: isPaperDropdownOpen ? "rgba(255,255,255,0.8)" : "#64748b",
                  fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: "500",
                  transition: "color 0.3s ease"
                }}>
                  {selectedPaper.points.slice(0, 2).join(" • ")}
                  {selectedPaper.points.length > 2 && ` • +${selectedPaper.points.length - 2} more`}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            padding: "4px 8px",
            backgroundColor: isPaperDropdownOpen ? "rgba(255,255,255,0.2)" : "#e2e8f0",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "600",
            color: isPaperDropdownOpen ? "#ffffff" : "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "all 0.3s ease"
          }}>
            {product.papers.length} Options
          </div>
          <div style={{
            transform: isPaperDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            color: isPaperDropdownOpen ? "#ffffff" : "#64748b"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {isPaperDropdownOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          border: "2px solid #e2e8f0",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          zIndex: 100,
          overflow: "hidden",
          animation: "dropdownSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: "300px",
          overflowY: "auto"
        }}>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <div style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#475569",
              fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              Available Paper Types
            </div>
          </div>
          
          {product.papers.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedPaper(p);
                setIsPaperDropdownOpen(false);
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                borderBottom: i < product.papers.length - 1 ? "1px solid #f1f5f9" : "none",
                backgroundColor: selectedPaper?.name === p.name ? "#f0f9ff" : "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                if (selectedPaper?.name !== p.name) {
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPaper?.name !== p.name) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "translateX(0)";
                }
              }}
            >
              {/* Hover indicator */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "3px",
                backgroundColor: selectedPaper?.name === p.name ? "#007abf" : "transparent",
                transition: "all 0.3s ease"
              }}></div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "6px"
                  }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      backgroundColor: selectedPaper?.name === p.name ? "#007abf" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: selectedPaper?.name === p.name ? "#ffffff" : "#64748b",
                      textTransform: "uppercase"
                    }}>
                      {p.name.charAt(0)}
                    </div>
                    
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      textTransform: "capitalize"
                    }}>
                      {p.name}
                    </div>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginTop: "6px"
                  }}>
                    {p.points.map((point, idx) => (
                      <span key={idx} style={{
                        padding: "2px 6px",
                        backgroundColor: selectedPaper?.name === p.name ? "#e6f3ff" : "#f1f5f9",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "600",
                        color: selectedPaper?.name === p.name ? "#007abf" : "#64748b",
                        fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
                      }}>
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedPaper?.name === p.name && (
                  <div style={{
                    marginLeft: "12px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#007abf",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "checkmarkBounce 0.4s ease"
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

{/* Finish - Advanced Powerful Dropdown */}
{product.finish?.length > 0 && (
  <div style={{ marginBottom: "32px" }}>
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      marginBottom: "12px"
    }}>
      <div>
        <h3 style={{ 
          fontSize: "22px", 
          fontWeight: "700", 
          marginBottom: "4px",
          color: "#0f172a",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: "-0.02em"
        }}>
          Choose Your Finish
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#64748b",
          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: "500"
        }}>
          Professional finishing options • Enhanced durability
        </p>
      </div>
      <div style={{
        padding: "8px 12px",
        backgroundColor: selectedFinish ? "#007abf" : "#e2e8f0",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        color: selectedFinish ? "#ffffff" : "#64748b",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {selectedFinish ? "Applied" : "Select"}
      </div>
    </div>
    
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setIsFinishDropdownOpen(!isFinishDropdownOpen)}
        style={{
          backgroundColor: isFinishDropdownOpen ? "#007abf" : "#f8fafc",
          border: `3px solid ${isFinishDropdownOpen ? "#007abf" : "#e2e8f0"}`,
          borderRadius: "16px",
          padding: "16px 20px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isFinishDropdownOpen 
            ? "0 20px 40px -12px rgba(0, 122, 191, 0.3), 0 0 0 1px rgba(255,255,255,0.1)" 
            : "0 4px 15px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "60px",
          transform: isFinishDropdownOpen ? "translateY(-2px)" : "translateY(0)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: selectedFinish ? "4px" : "0"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "12px",
              backgroundColor: selectedFinish 
                ? (isFinishDropdownOpen ? "rgba(255,255,255,0.2)" : "#007abf")
                : "#007abf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            
            <div>
              <div style={{
                fontSize: "16px",
                fontWeight: "700",
                color: isFinishDropdownOpen ? "#ffffff" : "#0f172a",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "-0.01em",
                transition: "color 0.3s ease",
                textTransform: "capitalize"
              }}>
                {selectedFinish ? selectedFinish.name : "Choose Finish  "}
              </div>
              {selectedFinish && (
                <div style={{
                  fontSize: "12px",
                  color: isFinishDropdownOpen ? "rgba(255,255,255,0.8)" : "#64748b",
                  fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: "500",
                  transition: "color 0.3s ease"
                }}>
                  {selectedFinish.description}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            padding: "4px 8px",
            backgroundColor: isFinishDropdownOpen ? "rgba(255,255,255,0.2)" : "#e2e8f0",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "600",
            color: isFinishDropdownOpen ? "#ffffff" : "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "all 0.3s ease"
          }}>
            Premium
          </div>
          <div style={{
            transform: isFinishDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            color: isFinishDropdownOpen ? "#ffffff" : "#64748b"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {isFinishDropdownOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          border: "2px solid #e2e8f0",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          zIndex: 100,
          overflow: "hidden",
          animation: "dropdownSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: "300px",
          overflowY: "auto"
        }}>
          <div style={{
            padding: "12px 16px",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <div style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#475569",
              fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              Finish Options
            </div>
          </div>
          
          {product.finish.map((f, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedFinish(f);
                setIsFinishDropdownOpen(false);
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                borderBottom: i < product.finish.length - 1 ? "1px solid #f1f5f9" : "none",
                backgroundColor: selectedFinish?.name === f.name ? "#f0f9ff" : "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                if (selectedFinish?.name !== f.name) {
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFinish?.name !== f.name) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "translateX(0)";
                }
              }}
            >
              {/* Hover indicator */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "3px",
                backgroundColor: selectedFinish?.name === f.name ? "#007abf" : "transparent",
                transition: "all 0.3s ease"
              }}></div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "6px"
                  }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      backgroundColor: selectedFinish?.name === f.name ? "#007abf" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: selectedFinish?.name === f.name ? "#ffffff" : "#64748b",
                      textTransform: "uppercase"
                    }}>
                      {f.name.charAt(0)}
                    </div>
                    
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      textTransform: "capitalize"
                    }}>
                      {f.name}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: "12px",
                    color: "#64748b",
                    lineHeight: "1.4",
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontWeight: "500",
                    marginLeft: "38px"
                  }}>
                    {f.description}
                  </div>
                </div>
                
                {selectedFinish?.name === f.name && (
                  <div style={{
                    marginLeft: "12px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#007abf",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "checkmarkBounce 0.4s ease"
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

<style>{`
  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes checkmarkBounce {
    0% { transform: scale(0) rotate(-180deg); }
    50% { transform: scale(1.2) rotate(-90deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`}</style>


{/* Corners */}
{product.corner?.length > 0 && (
  <div style={{ marginBottom: "24px" }}>
    <h3 style={{ 
      fontSize: "20px", 
      fontWeight: "600", 
      marginBottom: "16px",
      color: "#1a1a1a"
    }}>
      Choose your corners
    </h3>
    
    <div style={{
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
  gap: "16px",
}}>

      {product.corner.map((c, i) => {
        const isSelected = selectedCorner?.name === c.name;
        const isSquare = c.name.toLowerCase() === "square";
        
        return (
          <div
            key={i}
            onClick={() => setSelectedCorner(c)}
            style={{
              border: isSelected 
                ? "2px solid #007bff" 
                : "2px solid #e5e5e5",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              backgroundColor: isSelected 
                ? "#f8f9ff" 
                : "#ffffff",
              transition: "all 0.2s ease-in-out",
              boxShadow: isSelected 
                ? "0 4px 12px rgba(0, 123, 255, 0.15)" 
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "100px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Left side content */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "600",
                marginBottom: "4px",
                color: "#1a1a1a",
                textTransform: "capitalize"
              }}>
                {c.name}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                lineHeight: "1.4"
              }}>
                {c.description}
              </div>
            </div>
            
            {/* Corner Icon - Simple L-shape like screenshot */}
            <div style={{ 
              marginLeft: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {isSquare ? (
                // Square Corner - Sharp 90° L-shape
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path 
                    d="M12 12 L12 20 M12 12 L20 12"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  <path 
                    d="M36 12 L36 20 M36 12 L28 12"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  <path 
                    d="M12 36 L12 28 M12 36 L20 36"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  <path 
                    d="M36 36 L36 28 M36 36 L28 36"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              ) : (
                // Rounded Corner - Smooth curved arcs at corners
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path 
                    d="M12 18 C12 14 14 12 18 12"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path 
                    d="M36 18 C36 14 34 12 30 12"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path 
                    d="M12 30 C12 34 14 36 18 36"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path 
                    d="M36 30 C36 34 34 36 30 36"
                    stroke={isSelected ? "#007bff" : "#1f2937"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "20px",
                height: "20px",
                backgroundColor: "#007bff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <polyline points="20,6 9,17 4,12" stroke="white" strokeWidth="3" fill="none"/>
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
{/* <div style={{ 
  marginBottom: "30px",
  padding: "25px",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  background: "linear-gradient(135deg,#f9fafb,#f3f4f6)",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
}}>
  <h3 style={{ 
    fontSize: "20px", 
    fontWeight: "700", 
    marginBottom: "20px",
    color: "#1f2937",
    textAlign: "center"
  }}>
    🎨 Select Your Design Type
  </h3>

  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    gap: "24px", 
    flexWrap: "wrap" 
  }}>
    {[
      { value: "single", label: "Single Side", emoji: "🖼️" },
      { value: "double", label: "Double Side", emoji: "📖" },
    
    ].map((opt) => (
      <label 
        key={opt.value}
        onClick={() => setSelectedDesignType(opt.value)}
        style={{
          cursor: "pointer",
          padding: "20px",
          minWidth: "160px",
          borderRadius: "14px",
          border: selectedDesignType === opt.value 
            ? "2px solid #2563EB" 
            : "1px solid #d1d5db",
          background: selectedDesignType === opt.value 
            ? "linear-gradient(135deg,#3b82f6,#2563eb)" 
            : "#fff",
          color: selectedDesignType === opt.value ? "#fff" : "#111",
          boxShadow: selectedDesignType === opt.value 
            ? "0 6px 16px rgba(37,99,235,0.4)" 
            : "0 2px 6px rgba(0,0,0,0.08)",
          fontWeight: "600",
          fontSize: "15px",
          textAlign: "center",
          transition: "all 0.25s ease-in-out",
          transform: selectedDesignType === opt.value ? "scale(1.05)" : "scale(1)",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>{opt.emoji}</div>
        {opt.label}
        <input
          type="radio"
          name="designType"
          value={opt.value}
          checked={selectedDesignType === opt.value}
          onChange={(e) => setSelectedDesignType(e.target.value)}
          style={{ display: "none" }}
        />
      </label>
    ))}
  </div>
</div> */}
{/* ===== Quantity + Price Selector ===== */}
{/* Replace the existing quantity/price selector section in your ProductDetail.jsx with this enhanced version */}

{/* ===== Enhanced Quantity + Price Selector ===== */}
 {/* ===== Enhanced Quantity + Price Selector ===== */}
<div style={{ marginTop: "40px" }}>
  
  {/* Conditional rendering: Button Badge text input OR Design type selection */}
  {isButtonBadge ? (
    // Button Badge Content Input
    <>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>
        Enter Your Button Badge Text
      </h2>
      
      <div style={{
        marginBottom: "24px",
        padding: "20px",
        border: "2px solid #e5e7eb",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
      }}>
        <label style={{ 
          display: "block",
          fontSize: "15px", 
          fontWeight: "600", 
          marginBottom: "10px",
          color: "#374151"
        }}>
          Your Text (up to 500 characters)
        </label>
        
        <input
          type="text"
          value={customText}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setCustomText(e.target.value);
            }
          }}
          placeholder="Enter text for your button badge..."
          maxLength={500}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "16px",
            border: "2px solid #d1d5db",
            borderRadius: "10px",
            outline: "none",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#2563eb";
            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />
        
        <div style={{
          marginTop: "8px",
          fontSize: "13px",
          color: customText.length >= 450 ? "#ef4444" : "#6b7280",
          textAlign: "right",
          fontWeight: "500"
        }}>
          {customText.length}/500 characters
        </div>
        
        {customText && (
          <div style={{
            marginTop: "16px",
            padding: "16px",
            background: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
              Preview:
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              textAlign: "center",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "8px",
            }}>
              {customText}
            </div>
          </div>
        )}
      </div>

 {/* Button Badge Upload Section - Same as Photo Frame */}
{isButtonBadge && (
  <>
    {normalize(product.name).includes("button badge") && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "420px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "1px",
              color: "#007bff",
            }}
          >
            Upload Your Photo on Badge
          </h3>

          {/* Upload Button */}
          <label
            htmlFor="upload-badge-photo"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#007bff",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              marginTop: "12px",
              transition: "0.3s",
            }}
          >
            Choose Photo
          </label>
          <input
            id="upload-badge-photo"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "uploaded")}
            style={{ display: "none" }}
          />

          {/* Preview Frame - directly under input */}
          <div
            style={{
              marginTop: "20px",
              position: "relative",
              width: "250px",
              height: "250px",
              marginInline: "auto",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#f9f9f9",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            {preparedPreview ? (
              <img
                src={preparedPreview}
                alt="Prepared Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            ) : uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            ) : (
              <p
                style={{
                  color: "#aaa",
                  marginTop: "100px",
                  textAlign: "center",
                  fontStyle: "italic",
                  fontSize: "14px",
                }}
              >
                No photo uploaded yet
              </p>
            )}

            {/* Frame Overlay */}
            {FRAME_URL && (
              <img
                src={FRAME_URL}
                alt="Badge Frame"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  pointerEvents: "none",
                  objectFit: "contain",
                }}
              />
            )}

            {/* Re-Crop Button (only if image exists) */}
            {(uploadedImage || preparedPreview || originalImage) && (
              <button
                onClick={() => {
                  setCroppingImage(uploadedImage || preparedPreview || originalImage);
                  setCroppingSide("uploaded");
                  setIsCropOpen(true);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                }}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  padding: "6px 12px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  zIndex: 3,
                }}
              >
                Re-Crop
              </button>
            )}
          </div>

          {/* Frame Info Badge */}
          {selectedFrame && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                borderRadius: "10px",
                border: "2px solid #0ea5e9",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0c4a6e",
                  marginBottom: "4px",
                }}
              >
                Selected Badge Shape
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0369a1",
                  textTransform: "capitalize",
                }}
              >
                {selectedFrame}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handlePrepareAndUpload}
              style={{
                padding: "12px 20px",
                background: "#10b981",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#059669";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#10b981";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Prepare & Upload
            </button>

            <button
              onClick={handleAddToCart}
              style={{
                padding: "12px 20px",
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#2563eb";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#3b82f6";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)}
    </>
  ) : (
    // Original Design Type Selection
    <>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Choose your design type
      </h2>

      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
        justifyContent: "center",
      }}>
        {[
          { value: "single", label: "Single Side", icon: "🖼️" },
          { value: "double", label: "Double Side", icon: "📖" },
        ].map((option) => {
          const isActive = selectedDesignType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedDesignType(option.value)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 20px",
                borderRadius: "9999px",
                border: isActive ? "2px solid #2563eb" : "1px solid #d1d5db",
                backgroundColor: isActive ? "#eff6ff" : "#fff",
                color: isActive ? "#2563eb" : "#374151",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isActive
                  ? "0 2px 6px rgba(37,99,235,0.2)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontSize: "18px" }}>{option.icon}</span>
              {option.label}
            </button>
          );
        })}
      </div>
    </>
  )}

  <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
    Choose your Quantity
  </h2>

  {/* Pricing table */}
  <table style={{
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
  }}>
    <thead>
      <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
        <th style={{ padding: "12px" }}>Quantity</th>
        <th style={{ padding: "12px" }}>Price per card</th>
        <th style={{ padding: "12px" }}>Pack price</th>
      </tr>
    </thead>
    <tbody>
      {product?.priceTiers?.map((tier, idx) => {
        const isSelected = selectedTier?.qty === tier.qty;
        const currentPrice = getPrice(tier);

        return (
          <tr
            key={idx}
            onClick={() => setSelectedTier(tier)}
            style={{
              cursor: "pointer",
              background: isSelected ? "#f0f9ff" : "transparent",
              borderBottom: "1px solid #eee",
              border: isSelected ? "2px solid #22c55e" : "1px solid #eee",
            }}
          >
            <td style={{ padding: "12px", fontWeight: isSelected ? "600" : "400" }}>
              {tier.qty}
            </td>
            <td style={{ padding: "12px" }}>
              ${(currentPrice / tier.qty).toFixed(2)}
            </td>
            <td style={{ padding: "12px", fontWeight: "600" }}>
              ${currentPrice}
              {tier.originalPrice && (
                <span style={{
                  marginLeft: "8px",
                  color: "#999",
                  textDecoration: "line-through",
                  fontWeight: "400",
                }}>
                  ${tier.originalPrice}
                </span>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>

  {/* Selection summary */}
  {selectedTier && (
    <div style={{
      marginTop: "20px",
      padding: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "#fafafa",
    }}>
      <strong>{selectedTier.qty}</strong> cards selected (
      {selectedDesignType} side) — Total:{" "}
      <strong>${getPrice(selectedTier)}</strong> (
      {(getPrice(selectedTier) / selectedTier.qty).toFixed(2)} each)
    </div>
  )}
</div>

{/* Upload Your Design Button - Added after quantity selector */}
{!(isPersonalisedGift && normalize(product.name).includes("photo frame")) && (
  <div style={{ 
    marginTop: "30px", 
    textAlign: "center",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ffffff, #f8fafc)"
  }}>
    <button
      onClick={handleUploadYourDesign}
      disabled={!selectedTier}
      style={{
        padding: "15px 30px",
        fontSize: "18px",
        fontWeight: "700",
        color: "#fff",
        background: selectedTier 
          ? "linear-gradient(135deg, #2563eb, #1d4ed8)" 
          : "#9ca3af",
        border: "none",
        borderRadius: "12px",
        cursor: selectedTier ? "pointer" : "not-allowed",
        boxShadow: selectedTier 
          ? "0 8px 20px rgba(37,99,235,0.3)" 
          : "none",
        transition: "all 0.3s ease",
        transform: selectedTier ? "scale(1)" : "scale(0.95)",
        opacity: selectedTier ? 1 : 0.6,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "0 auto"
      }}
      onMouseOver={(e) => {
        if (selectedTier) {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.4)";
        }
      }}
      onMouseOut={(e) => {
        if (selectedTier) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.3)";
        }
      }}
    >
      <span style={{ fontSize: "20px" }}>🎨</span>
      Upload Your Design
    </button>
    
    {!selectedTier && (
      <p style={{ 
        marginTop: "12px", 
        color: "#6b7280", 
        fontSize: "14px",
        fontStyle: "italic"
      }}>
        Please select a quantity tier first
      </p>
    )}
  </div>
)}



</div>



{/* Personalised Gift Upload */}
{isPersonalisedGift && (
  <>
 {normalize(product.name).includes("photo frame") && (
  <div
    style={{
      // marginTop: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "420px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "1px",
          color: "#007bff",
        }}
      >
        Upload Your Photo on Frame
      </h3>

      {/* Upload Button */}
      <label
        htmlFor="upload-photo"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "0.3s",
        }}
      >
        Choose Photo
      </label>
      <input
        id="upload-photo"
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "uploaded")}
        style={{ display: "none" }}
      />

      {/* Custom Text Input */}
      <input
        type="text"
        placeholder="Enter your custom message"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        style={{
          marginTop: "15px",
          padding: "10px",
          width: "100%",
          maxWidth: "300px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "14px",
          outline: "none",
        }}
      />

      {/* Preview Frame - directly under input */}
      <div
        style={{
          marginTop: "20px",
          position: "relative",
          width: "300px",
          height: "300px",
          marginInline: "auto",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#f9f9f9",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {preparedPreview ? (
          <img
            src={preparedPreview}
            alt="Prepared Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        ) : uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        ) : (
          <p
            style={{
              color: "#aaa",
              marginTop: "100px",
              textAlign: "center",
              fontStyle: "italic",
              fontSize: "14px",
            }}
          >
            No photo uploaded yet
          </p>
        )}

        {/* Frame Overlay */}
        {FRAME_URL && (
          <img
            src={FRAME_URL}
            alt="Frame"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Re-Crop Button (only if image exists) */}
        {(uploadedImage || preparedPreview || originalImage) && (
          <button
            onClick={() => {
              // prefer uploadedImage, fallback to preparedPreview, finally originalImage
              setCroppingImage(uploadedImage || preparedPreview || originalImage);
              setCroppingSide("uploaded");
              setIsCropOpen(true);
              // ensure crop UI defaults
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setCroppedAreaPixels(null);
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              padding: "6px 12px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              zIndex: 3,
            }}
          >
            Re-Crop
          </button>
        )}
      </div>

      {/* ✅ REMOVED FRAME SELECTOR GRID - Now showing frame info badge instead */}
      {selectedFrame && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            borderRadius: "10px",
            border: "2px solid #0ea5e9",
            textAlign: "center",
          }}
        >
          <div style={{ 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#0c4a6e",
            marginBottom: "4px" 
          }}>
            Selected Frame Style
          </div>
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#0369a1",
            textTransform: "capitalize" 
          }}>
            {selectedFrame}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "18px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handlePrepareAndUpload}
          style={{
            padding: "10px 16px",
            background: "#10b981",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Prepare & Upload
        </button>

        <button
          onClick={async () => {
            await handlePrepareAndUpload();
            navigate("/checkout");
          }}
          style={{
            padding: "10px 16px",
            background: "#3b82f6",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
)}
  </>
)}

  
</div>      


<div style={{ marginTop: "10px" }}>

{/* Design Options - Only Contact Us and Design From Scratch remain */}
{!(isPersonalisedGift && normalize(product.name).includes("photo frame")) && (
<div style={{ marginTop: "40px", textAlign: "center" }}>
  <h2 style={{
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#222"
  }}>
    Need Help with Your Design?
  </h2>

  {/* Options Grid - Only 2 options now */}
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: "25px",
    maxWidth: "800px",
    margin: "0 auto"
  }}>
    {/* Contact Us */}
    <div
      onClick={() => setShowContactModal(true)}
      style={{
        border: selectedOption === "contact" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>☎️</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Contact Us
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>WhatsApp support</li>
        <li>Facebook Messenger</li>
        <li>Direct call</li>
      </ul>
    </div>

    {/* Design From Scratch */}
    <div
      onClick={() => setShowScratchModal(true)}
      style={{
        border: selectedOption === "scratch" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>✏️</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Design From Scratch
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>Custom form</li>
        <li>Share requirements</li>
        <li>We'll design for you</li>
      </ul>
    </div>
  </div>

{/* Show option details */}
<div style={{ marginTop: "30px" }}>
  
{/* Contact Modal */}
{showContactModal && (
  <div
  style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
        borderRadius: "20px",
        padding: "40px",
        width: "90%",
        maxWidth: "500px",
        textAlign: "center",
        color: "#fff",
        boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        animation: "fadeInUp 0.4s ease",
        position: "relative"
      }}
      >
      {/* Close button */}
      <button
        onClick={() => setShowContactModal(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ✖
      </button>

      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "25px" }}>
        Get in Touch
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
        >
        {/* WhatsApp */}
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,211,102,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
          <FaWhatsapp size={36} />
          WhatsApp
        </a>

        {/* Messenger */}
        <a href="https://facebook.com/YourPage" target="_blank" rel="noreferrer"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #1877F2, #0a58ca)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(24,119,242,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
          <FaFacebookMessenger size={36} />
          Messenger
        </a>

        {/* Phone */}
        <a href="tel:+919876543210"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #ff4d4d, #cc0000)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(255,77,77,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
          <FaPhoneAlt size={32} />
          Call
        </a>
      </div>
    </div>
  </div>
)}

{/* Scratch Design Modal */}
{showScratchModal && (
  <div
  style={{
    position: "fixed",
    inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
    >
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 10%, #f3f4f6 100%)",
        borderRadius: "20px",
        padding: "40px",
        width: "95%",
        maxWidth: "550px",
        textAlign: "center",
        boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
        position: "relative",
        animation: "fadeInUp 0.4s ease",
      }}
      >
      {/* Close */}
      <button
        onClick={() => setShowScratchModal(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 3px 8px rgba(239,68,68,0.4)",
        }}
        >
        ✖
      </button>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          background: "linear-gradient(90deg,#2563EB,#1D4ED8)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
        >
        Design From Scratch ✏️
      </h2>

      {/* Form */}
      <form onSubmit={handleScratchSubmit} style={{ textAlign: "left" }}>
        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Your Name
        </label>
        <input
          type="text"
          name="name"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
            transition: "0.2s",
          }}
          />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Email ID
        </label>
        <input
          type="email"
          name="email"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
          }}
          />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Your Requirement
        </label>
        <textarea
          name="requirement"
          required
          placeholder="Describe your design idea..."
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "20px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
            minHeight: "100px",
            resize: "none",
          }}
          />

        {/* Submit button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(90deg,#2563EB,#1D4ED8)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 5px 12px rgba(37,99,235,0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(90deg,#1D4ED8,#1E40AF)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "linear-gradient(90deg,#2563EB,#1D4ED8)")
          }
          >
          <FaPaperPlane /> Submit Request
        </button>
      </form>
    </div>
  </div>
)}

</div>

</div>
)}

{/* ---------- REPLACE CROP MODAL START ---------- */}
{isCropOpen && croppingImage && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: 12,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 980,
        maxHeight: "96vh",
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 12px 40px rgba(2,6,23,0.35)",
      }}
    >
      {/* Header: Revert (optional) + Cancel + Save */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: 12,
          borderBottom: "1px solid #eee",
          flexWrap: "wrap",
        }}
      >
        {originalImage && croppingImage && croppingImage !== originalImage && (
          <button
            onClick={handleRevertToOriginal}
            title="Revert to original uploaded photo"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Revert
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setIsCropOpen(false);
              setCroppingImage(null);
              setCroppingSide(null);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveCrop}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save Crop
          </button>
        </div>
      </div>

      {/* Body: crop area + controls */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: 12,
          minHeight: 0,
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {/* Crop area: explicit responsive height so Cropper is visible */}
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: window.innerWidth <= 768 ? "50vh" : "60vh",
            background: "#111", // helps visibility while image loads
          }}
        >
          {/* The Cropper must fill its parent */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Cropper
              image={croppingImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
            />
          </div>
        </div>

        {/* Controls sidebar (no duplicate preview) */}
        <aside
          style={{
            width: window.innerWidth <= 768 ? "100%" : 300,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6 }}>
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6 }}>
              X position
            </label>
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={Math.round(crop.x)}
              onChange={(e) => setCrop((c) => ({ ...c, x: Number(e.target.value) }))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6 }}>
              Y position
            </label>
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={Math.round(crop.y)}
              onChange={(e) => setCrop((c) => ({ ...c, y: Number(e.target.value) }))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
            <button
              onClick={() => {
                setCrop({ x: 0, y: 0 });
                setZoom(1);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Reset
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
)}
{/* ---------- REPLACE CROP MODAL END ---------- */}
          
<Review productId={id}/>

        </div>
        </div>
        <Footer />
        </div>
       </div>
            
      
    
    
  );
}