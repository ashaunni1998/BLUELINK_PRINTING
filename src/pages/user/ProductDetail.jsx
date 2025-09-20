import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Review from "./Review";
import Cropper from "react-easy-crop"; // make sure you installed: npm install react-easy-crop
// import CropImage from "./CropImage";
// import CustomRequirement from "./CustomerRequirement";
import API_BASE_URL from "../../config";
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
// const FRAME_URL = "https://i.ibb.co/3y63T95k/imageedit-1-7441844514.png";   // <- REPLACE with direct image URL from ibb (right-click image → Copy image address)
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
const [selectedFrame, setSelectedFrame] = useState(""); // default
const FRAME_URL = frameOverlays[selectedFrame];


// ✅ add this hook at the top of your file
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

  // ✅ fixed: Add to cart using cookies (no localStorage token)
  const handleAddToCart = async () => {
    try {
      if (!product?._id) {
        alert("Product not loaded yet.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/addToCart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 send login cookie
        body: JSON.stringify({
          productId: product._id,
          quantity: selectedQty,
          size: selectedSize,
          finish: selectedFinish,
          corner: selectedCorner
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added to cart!");
        // window.location.href = "/getCart";
        navigate("/cart");
      } else if (res.status === 401) {
        alert("⚠️ Session expired. Please login again.");
        // window.location.href = "/signin";
        navigate("/signin");
      } else {
        alert(data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

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
    setOriginalImage(dataUrl);   // ✅ save original
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
  // do NOT auto-save — user must press Save Crop
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
    alert("Error saving crop — check console.");
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

  // 🚀 Later, replace with API upload
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
    // using crossOrigin for remote frame (imgbb/ibb) — keep it so we can access pixel data
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

  // build prepared preview immediately (composite) — this will set preparedPreview
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
    alert("✅ Prepared image uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Error preparing or uploading image: " + (err.message || err));
  }
};



  // ✅ handle submit
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



 


  // ---- STYLES ----
  const styles = {
    container: { backgroundColor: "#f8f9fa", minHeight: "100vh" },
    imageSection: {
      flex: 1,
      maxWidth: isMobile ? '100%' : '500px',
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? 'auto' : '100px',
      height: 'fit-content'
    },
    detailsSection: {
      flex: 1.2,
      backgroundColor: 'white',
      borderRadius: '12px',
     padding: isMobile ? '20px' : '30px'
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
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
     overflowX: isMobile ? 'auto' : 'visible',
   padding: isMobile ? '0 0 10px 0' : '0'
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


 // ✅ prevent crash if product not yet loaded
  if (!product) {
    return <div>Loading product...</div>;
  }

  // ✅ safely extract category name
  const rawCategory = product?.category;

const categoryName = Array.isArray(rawCategory)

  ? rawCategory[0]

  : typeof rawCategory === "object"

  ? rawCategory?.name

  : rawCategory;



// normalize spaces & case (remove NBSP etc) and compare

const normalize = (str = "") =>

  String(str)

    .replace(/\u00A0/g, " ") // replace non-breaking spaces

    .replace(/\s+/g, " ")    // collapse multiple spaces

    .trim()

    .toLowerCase();



const isPersonalisedGift = normalize(categoryName) === "personalized gifts";




  return (
    <div style={styles.container}>
      <div className="responsive-container">
        <Header onMenuStateChange={setMobileMenuOpen}/>

        {/* Main */}
        <div style={{
          
        
          padding: isMobile ? '20px' : '40px',
          // maxWidth: '1200px',
          margin: '0 auto',
          
        }}>
           <div style={{
    display: 'flex',
    gap: isMobile ? '20px' : '40px',
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
  <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" ,color:"#007bff" }}>
    {product.name}
  </h1>
   <h3 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "8px" ,color:"#111316ff" }}>
    {product.subtitle}
  </h3>





  {/* Rating */}
  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
    <span style={{ color: "#007bff", fontSize: "20px", marginRight: "8px" }}>★★★★★</span>
    <span style={{ fontSize: "15px", color: "#555" }}>
      {product.rating.count > 0
        ? `${product.rating.count} reviews`
        : "No reviews yet"}
    </span>
  </div>



<p
  style={{
    fontSize: "16px",
    fontWeight: "500",
    color: "#444",
    marginBottom: "16px",
 
    // backgroundColor: "#a5a7c1ff", // soft yellow highlight
    padding: "12px 16px",
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
{product.size?.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
      Available Sizes
    </h3>

    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {product.size.map((s, i) => {
        // Map size name to image
        const sizeImages = {
          standard:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-standard-526x325.jpg",
          normal:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-moo-526x325.jpg",
          square:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-square-526x325.jpg",
        };

        const imgUrl = sizeImages[s.name.toLowerCase()];

        return (
          <div
            key={i}
            onClick={() => setSelectedSize(s)}
            style={{
              border:
                selectedSize?.name === s.name
                  ? "2px solid #007bff"
                  : "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
              width: "160px",
              transition: "all 0.2s ease-in-out",
              boxShadow:
                selectedSize?.name === s.name
                  ? "0px 4px 12px rgba(0,0,0,0.15)"
                  : "none",
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt={s.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "8px",
                  borderRadius: "6px",
                }}
              />
            )}
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {s.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {s.size.width} × {s.size.height}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}



{/* Paper */}
{product.paper?.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
      Paper Options
    </h3>

    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {product.paper.map((p, i) => {
        // Map paper name to image
        const paperImages = {
          original:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/matte-526x251.jpg",
          super:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/gloss-526x251.jpg",
          luxe:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/matte-526x251.jpg",
          specialfinish:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/gloss-526x251.jpg",
        };

        const imgUrl = paperImages[p.name.toLowerCase()];

        return (
          <div
            key={i}
            onClick={() => setSelectedPaper(p)}
            style={{
              border:
                selectedPaper?.name === p.name
                  ? "2px solid #007bff"
                  : "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
              width: "180px",
              transition: "all 0.2s ease-in-out",
              boxShadow:
                selectedPaper?.name === p.name
                  ? "0px 4px 12px rgba(0,0,0,0.15)"
                  : "none",
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "8px",
                  borderRadius: "6px",
                }}
              />
            )}
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {p.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {p.points.join(", ")}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}



{/* Finish */}
{product.finish?.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
      Finish
    </h3>

    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {product.finish.map((f, i) => {
        // Map finish name to image
        const finishImages = {
          matte:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/matte-526x251.jpg",
          gloss:
            "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/laminates/gloss-526x251.jpg",
        };

        const imgUrl = finishImages[f.name.toLowerCase()];

        return (
          <div
            key={i}
            onClick={() => setSelectedFinish(f)}
            style={{
              border:
                selectedFinish?.name === f.name
                  ? "2px solid #007bff"
                  : "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
              width: "180px",
              transition: "all 0.2s ease-in-out",
              boxShadow:
                selectedFinish?.name === f.name
                  ? "0px 4px 12px rgba(0,0,0,0.15)"
                  : "none",
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt={f.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "8px",
                  borderRadius: "6px",
                }}
              />
            )}
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {f.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {f.description}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


{/* Corners */}
{product.corner?.length > 0 && (
  <div style={{ marginBottom: "16px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
      Corners
    </h3>

    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {product.corner.map((c, i) => {
        // Map corner type to image
        const cornerImages = {
          square: "https://shorturl.at/NvRK3",
          rounded:
            "https://static.vecteezy.com/system/resources/previews/042/983/171/non_2x/round-corner-skined-filled-icon-vector.jpg",
        };

        const imgUrl = cornerImages[c.name.toLowerCase()];

        return (
          <div
            key={i}
            onClick={() => setSelectedCorner(c)}
            style={{
              border:
                selectedCorner?.name === c.name
                  ? "2px solid #007bff"
                  : "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
              width: "160px",
              transition: "all 0.2s ease-in-out",
              boxShadow:
                selectedCorner?.name === c.name
                  ? "0px 4px 12px rgba(0,0,0,0.15)"
                  : "none",
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  background: "#f9f9f9",
                  padding: "6px",
                }}
              />
            )}
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {c.name}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {c.description}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

{/* <div
  style={{
    marginBottom: "28px",
    padding: "20px",
    background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  }}
>
  <label
    htmlFor="quantity"
    style={{
      display: "block",
      fontWeight: "700",
      fontSize: "16px",
      marginBottom: "12px",
      color: "#374151",
    }}
  >
    Select Quantity
  </label>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "18px",
      flexWrap: "wrap",
    }}
  >
    <select
      id="quantity"
      value={selectedQty}
      onChange={(e) => {
        const qty = Number(e.target.value);
        setSelectedQty(qty);
        const matched = priceOptions.find((p) => p.qty === qty);
        setDisplayPrice(matched ? matched.price : priceOptions[0].price);
      }}
      style={{
        flex: "1",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.border = "1px solid #2563eb")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.border = "1px solid #d1d5db")
      }
    >
      {priceOptions.map((opt) => (
        <option key={opt.qty} value={opt.qty}>
          {opt.qty} pcs — ${opt.price}
        </option>
      ))}
    </select>
 
     <span
      style={{
        padding: "10px 20px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "18px",
        boxShadow: "0 6px 16px rgba(79,70,229,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      ${displayPrice}
    </span> 
  </div>
</div> */}





  {/* Add to Cart */}
 {/* {!(isPersonalisedGift && normalize(product.name).includes("photo frame")) && (
  <button
    onClick={handleAddToCart}
    style={{
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "6px",
      border: "none",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "20px",
      display:"block",
      marginLeft:"auto",
      marginRight:"auto"
    }}
  >
    🛒 Add to Cart
  </button>
  )} */}
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

  {/* ✂️ Re-Crop Button (only if image exists) */}
{/* 🔄 Revert to Original */}
{/* ✂️ Re-Crop Button (only if image exists) */}
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
    ✂️ Re-Crop
  </button>
)}

</div>

{/* Frame Selection - moved BELOW preview */}
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "25px",
  }}
>
  {Object.entries(frameOverlays).map(([key, url]) => (
    <div
      key={key}
      onClick={() => setSelectedFrame(key)}
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "12px",
        border:
          selectedFrame === key
            ? "3px solid #007bff"
            : "1px solid #e5e7eb",
        boxShadow:
          selectedFrame === key
            ? "0 4px 12px rgba(0,123,255,0.3)"
            : "0 2px 6px rgba(0,0,0,0.1)",
        cursor: "pointer",
        background: "#fff",
        transition: "all 0.25s ease",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <img
        src={url}
        alt={key}
        style={{
          width: "100%",
          height: "70px",
          objectFit: "contain",
          marginBottom: "6px",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: selectedFrame === key ? "#007bff" : "#333",
          textTransform: "capitalize",
        }}
      >
        {key}
      </span>
    </div>
  ))}
</div>

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
    🛍️ Buy Now
  </button>
</div>


    </div>

  </div>

)}

 
  </>
)}

        </div>

<div style={{ marginTop: "10px" }}>
{/* Customer Needs */}

{/* Design Options */}
{/* Design Options */}
{!(isPersonalisedGift && normalize(product.name).includes("photo frame")) && (
<div style={{ marginTop: "40px", textAlign: "center" }}>
  <h2 style={{
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#222"
  }}>
    How would you like to design your cards?
  </h2>

  {/* Options Grid */}
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto"
  }}>
    {/* Upload Your Design */}
    <div
      onClick={() => navigate(`/upload-design/${id}`)}
      style={{
        border: selectedOption === "upload" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>📂</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Upload Your Design
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>Upload your own files</li>
        <li>Supports multiple sides</li>
        <li>Crop before submit</li>
      </ul>
    </div>

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
        <li>We’ll design for you</li>
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








</div>

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
)}
        {/* Reviews */}
        {/* <div style={styles.reviewsSection}>
          <h3>Leave a Review</h3>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={24} onClick={() => setRating(s)}
            fill={rating >= s ? '#facc15' : 'none'} stroke="#facc15" style={{ cursor: 'pointer' }} />
            ))}
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write review..."/>
            <button onClick={handleSubmitReview}>Submit Review</button>
            </div> */}
{/* ---- Download Design Guideline ---- */}
{/* ---- Floating Download Guideline ---- */}
<div
  style={{
    position: "fixed",
    bottom: "25px",
    right: "25px",
   zIndex: isMobile ? 50 : 1000, // Lower z-index on mobile
    display: isMobile && showGuideline ? "none" : "block", // Hide on mobile when guideline panel is open
  }}
>
  {/* Floating Button */}
 <button
  onClick={() => setShowGuideline((prev) => !prev)}
  style={{
    background: "linear-gradient(90deg,#2563EB,#9333EA)",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "12px 22px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 25px rgba(79,70,229,0.4)",
    transition: "all 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  📘 <span>Design Guidelines</span>
</button>


  {/* Popover */}
  {showGuideline && (
    <div
      style={{
        position: "absolute",
        bottom: "75px",
        right: "0",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "20px",
        width: "220px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        animation: "fadeInUp 0.35s ease",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px", textAlign: "center" }}>
        Design Guideline
      </h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {[
          { ext: "psd", label: "Photoshop", color: "#2563eb" },
          { ext: "ai", label: "Illustrator", color: "#f97316" },
          { ext: "indd", label: "InDesign", color: "#db2777" },
          { ext: "jpg", label: "JPEG", color: "#059669" }
        ].map((file) => (
          <a
            key={file.ext}
            href={`/guidelines/business-card.${file.ext}`}
            download
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              padding: "8px 10px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111",
              background: "#f9fafb",
              border: `1px solid ${file.color}33`,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = file.color;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.color = "#111";
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: file.color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              {file.ext}
            </div>
            {file.label}
          </a>
        ))}
      </div>
    </div>
  )}
</div>


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
            🔄 Revert
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