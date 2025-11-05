import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

import Swal from 'sweetalert2';
import Cropper from "react-easy-crop";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Review from "./Review";
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
const cropBoxRef = useRef(null);
const [minZoom, setMinZoom] = useState(1);


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

const [isUploading, setIsUploading] = useState(false);
const [isPaperDropdownOpen, setIsPaperDropdownOpen] = useState(false);
const [isFinishDropdownOpen, setIsFinishDropdownOpen] = useState(false);

const [orderId, setOrderId] = useState(null);
const [selectedOption, setSelectedOption] = useState(null);



  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);


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
// 📌 Cropper States
const [showCropper, setShowCropper] = useState(false);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [rotation, setRotation] = useState(0);
const [flipH, setFlipH] = useState(false);
const [flipV, setFlipV] = useState(false);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const [tempImage, setTempImage] = useState(null);

// state (near your other cropper states)
const [originalImage, setOriginalImage] = useState(null);

const [customText, setCustomText] = useState("");
const [submittedText, setSubmittedText] = useState(null);
const [uploadedFile, setUploadedFile] = useState(null);
const [preparedPreview, setPreparedPreview] = useState(null);
const IMGBB_API_KEY = "0dc969770aaafeeba77f84c1534e4fad"; // your imgbb API key
// const FRAME_URL = "https://i.ibb.co/3y63T95k/imageedit-1-7441844514.png";   // <- REPLACE with direct image URL from ibb (right-click image â†' Copy image address)
const [uploadedUrl, setUploadedUrl] = useState(null);     // stores the final uploaded imgbb URL

// === FRAME CONFIG ===
const FRAME_CFG = {
  // Bamboo frames
  rectangular: {
    default: { aspect: 3 / 4, inset: { top: 0.00, right: 0.00, bottom: 0.25, left: 0.00 }, fit: { startPad: 0.92, minPad: 0.90 } }
  },
  round:       {
    default: { aspect: 1, inset: { top: 0.10, right: 0.10, bottom: 0.10, left: 0.10 }, fit: { startPad: 1, minPad: 1 } }
  },
  heart:       {
    default: { aspect: 1, inset: { top: 0.08, right: 0.08, bottom: 0.12, left: 0.08 }, fit: { startPad: 1, minPad: 1 } }
  },
 rhomboid:    {
  default: { aspect: 4/3, inset: { top: 0.03, right: 0.06, bottom: 0.03, left: 0.06 }, fit: { startPad: 1, minPad: 1 } }
},

  // Stone/door
  rectangularstone: {
    default: { aspect: 16 / 9, inset: { top: 0.06, right: 0.06, bottom: 0.06, left: 0.06 }, fit: { startPad: 0.94, minPad: 0.92 } }
  },
  heartstone: {
  default: {
    aspect: 1,
    inset: { top: 0.12, right: 0.03, bottom: 0.10, left: 0.03 },
    fit: { startPad: 1, minPad: 1 }
  }
},
  square: {
    default: { aspect: 1, inset: { top: 0.06, right: 0.06, bottom: 0.06, left: 0.06 }, fit: { startPad: 1, minPad: 1 } }
  },
  door: {
    default: { aspect: 3 / 4, inset: { top: 0.07, right: 0.07, bottom: 0.10, left: 0.07 }, fit: { startPad: 0.95, minPad: 0.95 } }
  },

  // Flat panels
  aluminum: {
    default: { aspect: 4 / 3, inset: { top: 0.06, right: 0.06, bottom: 0.12, left: 0.06 }, fit: { startPad: 0.96, minPad: 0.94 } }
  },
  glass: {
    default: { aspect: 3 / 4, inset: { top: 0.08, right: 0.08, bottom: 0.08, left: 0.08 }, fit: { startPad: 0.98, minPad: 0.96 } }
  },

  // Button Badges
  roundbadge:  { default:{ aspect:1, inset:{top:.10,right:.10,bottom:.10,left:.10}, fit:{startPad:1,minPad:1} } },
  squarebadge: { default:{ aspect:1, inset:{top:.10,right:.10,bottom:.10,left:.10}, fit:{startPad:1,minPad:1} } },
  heartbadge:  { default:{ aspect:1, inset:{top:.22,right:.10,bottom:.16,left:.10}, fit:{startPad:1,minPad:1} } },
  tshirtbadge: { default:{ aspect:1, inset:{top:.10,right:.10,bottom:.10,left:.10}, fit:{startPad:1,minPad:1} } },
  starbadge:   { default:{ aspect:1, inset:{top:.12,right:.12,bottom:.12,left:.12}, fit:{startPad:1,minPad:1} } },
  catbadge:    { default:{ aspect:1, inset:{top:.12,right:.12,bottom:.12,left:.12}, fit:{startPad:1,minPad:1} } },
};

const DEFAULT_CFG = { aspect: 1, inset: { top: .08, right: .08, bottom: .08, left: .08 }, fit: { startPad: 1, minPad: 1 } };

// ==== SMART AUTO FIT HELPERS ====
// Detect a face using the Shape Detection API if available (Chrome/Edge).
// Fallback: return null (we'll just center/contain).
// ==== SMART AUTO FIT HELPERS ====
// Detect a face using Shape Detection API (optional); fallback: null
async function detectSubjectRectFromSrc(src) {
  if (!('FaceDetector' in window)) return null;
  try {
    const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const bitmap = await createImageBitmap(canvas);
    const faces = await faceDetector.detect(bitmap);
    if (faces && faces[0]?.boundingBox) {
      const bb = faces[0].boundingBox;
      return { x: bb.x, y: bb.y, width: bb.width, height: bb.height, imgW: canvas.width, imgH: canvas.height };
    }
  } catch {}
  return null;
}
// Overfill multiplier to guarantee shaped frames (diamond/heart/irregular) have zero white edges.
function getCoverOverfill(frameKey = "") {
  const k = String(frameKey).toLowerCase();
  if (k.includes("rhomboid")) return 1.45;     // diamond corners
  if (k.includes("heart")) return 1.32;        // heart top dent + bottom point
  if (k.includes("star")) return 1.22;         // spikes
  if (k.includes("cat") || k.includes("tshirt")) return 1.15; // irregular badge shapes
  if (k.includes("round")) return 1.08;        // slight cushion to avoid ring edges
  return 1.00;                                 // rectangular/door/stone/square default
}
function getShapeBiasUpPercent(frameKey = "") {
  const k = String(frameKey).toLowerCase();
  if (k.includes("rhomboid")) return 4; // 4% upward bump for diamond tip
  return 0;
}

// Face/body-aware auto-fit with overfill (for shapes) + vertical bias (for rhomboid)
function computeAutoFit({ box, imgW, imgH, aspect, mode, subject, overfill = 1, biasUpPct = 0 }) {
  const coverZoom   = Math.max(box.width / imgW, box.height / imgH);
  const containZoom = Math.min(box.width / imgW, box.height / imgH);

  let zoom;
  if (mode === "contain") {
    // show more of the body
    zoom = Math.max(1, containZoom * 0.82);
  } else {
    // fill the shape fully, with overfill for corners
    zoom = Math.max(1, coverZoom * overfill);
  }

  // crop window in image px at this zoom
  const cropW_imgPx = box.width / zoom;
  const cropH_imgPx = box.height / zoom;

  // enforce requested aspect
  let targetW = cropW_imgPx;
  let targetH = targetW / aspect;
  if (targetH > cropH_imgPx) {
    targetH = cropH_imgPx;
    targetW = targetH * aspect;
  }

  // center defaults
  let cx = imgW / 2, cy = imgH / 2;

  if (subject) {
    const faceCx = subject.x + subject.width / 2;
    const faceCy = subject.y + subject.height / 2;
    if (mode === "contain") {
      const biasDown = subject.height * 1.2;
      cy = Math.min(Math.max(faceCy + biasDown, targetH / 2), imgH - targetH / 2);
      cx = Math.min(Math.max(faceCx,          targetW / 2),   imgW - targetW / 2);
    } else {
      cy = Math.min(Math.max(faceCy, targetH / 2), imgH - targetH / 2);
      cx = Math.min(Math.max(faceCx, targetW / 2), imgW - targetW / 2);
    }
  }

  // convert to react-easy-crop percentage shift
  const offsetX_px = (imgW / 2 - cx);
  const offsetY_px = (imgH / 2 - cy);
  const renderedW  = imgW * zoom;
  const renderedH  = imgH * zoom;

  const crop = {
    x: (offsetX_px / renderedW) * 100,
    y: (offsetY_px / renderedH) * 100
  };

  // small upward nudge (negative y moves image up)
  crop.y -= biasUpPct;

  return { zoom, crop };
}




/**
 * Compute crop center and zoom for react-easy-crop so the subject is centered.
 * - box: DOMRect of crop box
 * - imgW,imgH: natural image size
 * - aspect: frame target aspect ratio
 * - mode: "contain" for rectangular-like (keep full subject), "cover" for round/heart/badge
 * - subject: {x,y,width,height,imgW,imgH} from face detection (optional)
 * - minZoom: lower bound to avoid gaps for "cover" frames
 */
function computeAutoFit({ box, imgW, imgH, aspect, mode, subject, minZoom }) {
  // Base zoom that exactly covers the crop area without gaps
  const coverZoom = Math.max(box.width / imgW, box.height / imgH);
  let zoom = Math.max(coverZoom, minZoom || 1);

  // If rectangular-like and we want to "contain", we can zoom OUT slightly to preserve full body
  if (mode === "contain") {
    const containZoom = Math.min(box.width / imgW, box.height / imgH);
    // give a little extra margin so whole body fits (0.9 = 10% extra room)
    zoom = Math.max(1, containZoom * 0.9);
  }

  // Determine desired crop (in image pixels) that the crop box will display at this zoom:
  const cropW_imgPx = box.width / zoom;
  const cropH_imgPx = box.height / zoom;

  // Ensure target aspect (react-easy-crop uses aspect by letterboxing inside box;
  // we keep the same idea but compute center wisely)
  let targetW = cropW_imgPx;
  let targetH = targetW / aspect;
  if (targetH > cropH_imgPx) {
    targetH = cropH_imgPx;
    targetW = targetH * aspect;
  }

  // Center window defaults to middle of image
  let cx = imgW / 2;
  let cy = imgH / 2;

  // If we have a subject, center on its center (but keep inside image)
  if (subject) {
    const sx = subject.x + subject.width / 2;
    const sy = subject.y + subject.height / 2;
    cx = Math.min(Math.max(sx, targetW / 2), imgW - targetW / 2);
    cy = Math.min(Math.max(sy, targetH / 2), imgH - targetH / 2);
  }

  // react-easy-crop's "crop" is a translation in percentages of the image relative to the box center.
  // Compute required offset so that the box is centered at (cx, cy) of the image.
  // We convert pixel center to percentage shift: 0 means centered; +X moves image rightward (showing more left side).
  const offsetX_px = (imgW / 2 - cx);
  const offsetY_px = (imgH / 2 - cy);

  // scale offset by zoom because crop is in percentage relative to rendered image size
  const renderedW = imgW * zoom;
  const renderedH = imgH * zoom;

  const cropX = (offsetX_px / renderedW) * 100; // percentage shift
  const cropY = (offsetY_px / renderedH) * 100;

  return { zoom, crop: { x: cropX, y: cropY } };
}



function getFrameCfg(key, size) {
  const f = FRAME_CFG[key] || {};
  return f[size] || f.default || DEFAULT_CFG;
}

// Extract product type from category
const productType = product?.categories?.[0]?.name?.toLowerCase() || 
                    product?.category?.name?.toLowerCase() || 
                    product?.category?.toLowerCase() || 
                    "";


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


   

   // Button Badge Frames
  tshirtbadge: "https://i.ibb.co/ds8cgMbh/tshirt-badge.png",
  heartbadge: "https://i.ibb.co/ZRpBh4XS/heart-badge.png",
  squarebadge: "https://i.ibb.co/8nZtLyjb/square-badge.png",
  starbadge: "https://i.ibb.co/tPZsYwrB/star-badge.png",
  catbadge: "https://i.ibb.co/dn8dPbc/cat-badge.png",
  roundbadge: "https://i.ibb.co/Dj0H6j7/round-badge.png",
};


// Get the frame type from product data (expects product.frameType to match one of the keys above)
const productFrameType = product?.frameType?.toLowerCase().trim();
// const [selectedFrame, setSelectedFrame] = useState(productFrameType || ""); 
// const FRAME_URL = frameOverlays[selectedFrame];






const detectFrameFromProductName = (productName = "") => {
  const name = productName.toLowerCase().trim();


   // Check for button badge types first
  if (name.includes("button badge") || name.includes("badge")) {
    if (name.includes("t-shirt") || name.includes("tshirt badge")) return "tshirtbadge";
    if (name.includes("heart")) return "heartbadge";
    if (name.includes("square")) return "squarebadge";
    if (name.includes("star")) return "starbadge";
    if (name.includes("cat")) return "catbadge";
    if (name.includes("round") || name.includes("circle")) return "roundbadge";
    // Default badge frame if no specific type found
    return "roundbadge";
  }
  
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
const sizeKey = selectedSize?.label || selectedSize || "default";
const cfg = getFrameCfg(selectedFrame, sizeKey);
const wantsContain = (cfg.fit?.minPad ?? 1) < 1; 
// Auto-set frame when product loads
useEffect(() => {
  if (detectedFrame && frameOverlays[detectedFrame]) {
    setSelectedFrame(detectedFrame);
  }
}, [detectedFrame]);


// ✅ NEW: Clear images when frame changes
useEffect(() => {
  if (selectedFrame) {
    // Clear all image-related states
    setUploadedImage(null);
    setPreparedPreview(null);
    setTempImage(null);
    setOriginalImage(null);
    setCroppedAreaPixels(null);
    setCustomText("");
    setUploadedUrl(null);
    
    // Reset cropper states
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setShowCropper(false);
    
    // Clear file input if exists
    const fileInput = document.getElementById('upload-photo');
    if (fileInput) fileInput.value = '';
    
    const badgeInput = document.getElementById('upload-badge-photo');
    if (badgeInput) badgeInput.value = '';
  }
}, [selectedFrame]);



const FRAME_URL = frameOverlays[selectedFrame];
// ---- dynamic crop size per frame (only affects the crop box height) ----
const cropHeightMap = {
  heart: 260,
  heartstone: 260,
  round: 280,
  roundbadge: 280,
  square: 340,
  squarebadge: 340,
  rectangular: 420,
  rectangularstone: 420,
  rhomboid: 240,
  door: 300,
  tshirtbadge: 280,
  heartbadge: 260,
  starbadge: 300,
  catbadge: 300,
};

const cropSize = {
  width: 500,
  height: cropHeightMap[selectedFrame] ?? 260,
};
// ---- per-frame crop settings (aspect + safe area insets) ----
const frameCropConfig = {
  rectangular: { aspect: 3 / 4, inset: { top: 0.02, right: 0.06, bottom: 0.00, left: 0.06 } },
  rhomboid:         { aspect: 4 / 3,  inset: { top:.08, right:.08, bottom:.08, left:.08 } },
  square:           { aspect: 1,      inset: { top:.06, right:.06, bottom:.06, left:.06 } },
  round:            { aspect: 1,      inset: { top:.08, right:.08, bottom:.08, left:.08 } },
  heart:            { aspect: 1.57,   inset: { top:.18, right:.08, bottom:.18, left:.08 } },
  heartstone:       { aspect: 1,      inset: { top:.20, right:.08, bottom:.16, left:.08 } },
  rectangularstone: { aspect: 16 / 9, inset: { top:.06, right:.06, bottom:.06, left:.06 } },
  door:             { aspect: 3 / 4,  inset: { top:.07, right:.07, bottom:.10, left:.07 } },

  // badges
  tshirtbadge:      { aspect: 1,      inset: { top:.10, right:.10, bottom:.10, left:.10 } },
  heartbadge:       { aspect: 1,      inset: { top:.22, right:.10, bottom:.16, left:.10 } },
  squarebadge:      { aspect: 1,      inset: { top:.10, right:.10, bottom:.10, left:.10 } },
  starbadge:        { aspect: 1,      inset: { top:.12, right:.12, bottom:.12, left:.12 } },
  catbadge:         { aspect: 1,      inset: { top:.12, right:.12, bottom:.12, left:.12 } },
  roundbadge:       { aspect: 1,      inset: { top:.10, right:.10, bottom:.10, left:.10 } },
};

const FRAME_PREVIEW_INSET = {
  // bamboo
  rectangular:      { top: "0%",  right: "0%",  bottom: "25%", left: "0%"  },
  round:            { top: "10%", right: "10%", bottom: "10%", left: "10%" },
  heart:            { top: "8%",  right: "8%",  bottom: "12%", left: "8%"  },
  rhomboid:         { top: "0%",  right: "6%",  bottom: "0%",  left: "6%"  }, // ← tightened

  // stone/door
  rectangularstone: { top: "6%",  right: "6%",  bottom: "6%",  left: "6%"  },
  heartstone:       { top: "20%", right: "8%",  bottom: "16%", left: "8%"  },
  square:           { top: "6%",  right: "6%",  bottom: "6%",  left: "6%"  },
  door:             { top: "7%",  right: "7%",  bottom: "10%", left: "7%"  },

  // flat panels
  aluminum:         { top: "6%",  right: "6%",  bottom: "14%", left: "6%"  },
  glass:            { top: "8%",  right: "8%",  bottom: "8%",  left: "8%"  },
};
// helper to use in preview
const previewInset = FRAME_PREVIEW_INSET[selectedFrame] ?? { top:"8%", right:"8%", bottom:"8%", left:"8%" };
const FIT_CONTAIN_FRAMES = new Set(["rectangular", "rectangularstone", "door"]);

// current frame’s crop config (used by Cropper + canvas compose)
const currentCropCfg =
  frameCropConfig[selectedFrame] || { aspect: 1, inset: { top:.08, right:.08, bottom:.08, left:.08 } };
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

        console.log("🧾 Product data structure:", JSON.stringify(productData, null, 2));
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
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Product not loaded yet.'
  });
  return;
}
    // Determine quantity: prefer selectedTier.qty, fall back to any selectedQty or 1
    const qty = Number(selectedTier?.qty || 1) || 1;

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
      Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: '✓ Product added to cart!',
  showConfirmButton: false,
  timer: 1500
}).then(() => navigate("/cart"));


    } else if (res.status === 401) {
      // Session expired (line ~418)
Swal.fire({
  icon: 'warning',
  title: 'Session Expired',
  text: 'Please login again.'
}).then(() => navigate("/signin"));
    } else {
      // Failed to add (line ~422)
Swal.fire({
  icon: 'error',
  title: 'Failed',
  text: data?.message || "Failed to add product to cart."
});
    }
  } catch (err) {
    // Catch error (line ~429)
Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Something went wrong. Please try again.'
});
  }
};
// ---------- END REPLACEMENT ----------


  // reviews
  const handleSubmitReview = () => {
   if (!reviewText.trim() || !rating) {
  Swal.fire({
    icon: 'warning',
    title: 'Missing Information',
    text: 'Please give rating and write review.'
  });
  return;
}
    console.log("Submitting review:", { rating, reviewText });
    setReviewText('');
    setRating(0);
    Swal.fire({
  icon: 'success',
  title: 'Thank You!',
  text: 'Review submitted!',
  showConfirmButton: false,
  timer: 1500
});
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
      Swal.fire({
    icon: 'success',
    title: 'Submitted!',
    text: 'Your design request has been submitted!'
  });
  e.target.reset();
    } else {
      Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Something went wrong!'
  });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Error submitting request.'
});
  }
};





const preparePreviewLocal = async (src) => {
  if (!selectedFrame || !FRAME_URL || !src) return;

  const frameImg = await new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = FRAME_URL;
  });

  const photoImg = await new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

  const W = 1000;
  const H = Math.round((frameImg.height / frameImg.width) * W);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const sizeLabel = selectedSize?.label || selectedSize || "default";
  const cfg = getFrameCfg(selectedFrame, sizeLabel);

  const inset = cfg.inset ?? { top:.08, right:.08, bottom:.08, left:.08 };
  const minX = Math.round(W * inset.left);
  const minY = Math.round(H * inset.top);
  const innerW = Math.round(W * (1 - inset.left - inset.right));
  const innerH = Math.round(H * (1 - inset.top  - inset.bottom));

  const wantsContain = (cfg.fit?.minPad ?? 1) < 1;
  const coverScale   = Math.max(innerW / photoImg.width, innerH / photoImg.height);
  const containScale = Math.min(innerW / photoImg.width, innerH / photoImg.height);

  /* ✅ keep your original “fit vs fill” — no rhomboid zoom-in here */
  const scale = wantsContain
    ? Math.max(1e-6, containScale * 0.82)
    : coverScale;

  const drawW  = Math.round(photoImg.width  * scale);
  const drawH  = Math.round(photoImg.height * scale);
  const dx = Math.round(minX + (innerW - drawW) / 2);
  const dy = Math.round(minY + (innerH - drawH) / 2);

  /* ✅ Black diamond underlay ONLY for rhomboid to kill white apex */
  if (String(selectedFrame).toLowerCase().includes("rhomboid")) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W * 0.50, H * 0.02); // top
    ctx.lineTo(W * 0.98, H * 0.50); // right
    ctx.lineTo(W * 0.50, H * 0.98); // bottom
    ctx.lineTo(W * 0.02, H * 0.50); // left
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();
  }

  ctx.drawImage(photoImg, dx, dy, drawW, drawH);
  ctx.drawImage(frameImg, 0, 0, W, H);

  setPreparedPreview(canvas.toDataURL("image/png", 0.92));
};


const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setOriginalImage(url);
  setTempImage(url);
  setPreparedPreview(null);
  setShowCropper(true);

  // ✅ allow selecting the same file again without reload
  if (e.target) e.target.value = "";
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
  if (isUploading) return;
  const sourceImage = preparedPreview ?? uploadedImage;


  try {
    if (!sourceImage) {
      Swal.fire({
        icon: 'warning',
        title: 'No Image',
        text: 'Please upload an image first.'
      });
      return;
    }

    setIsUploading(true);

    Swal.fire({
      title: 'Processing...',
      html: 'Preparing your design and adding to cart',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    console.log("🔄 Starting image preparation...");

    const canvas = document.createElement("canvas");
    const outputW = 1200;
    const outputH = 1200;
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputW, outputH);

    const photo = await new Promise((resolve, reject) => {
      const img = new Image();
      if (sourceImage && !sourceImage.startsWith?.('blob:') && !sourceImage.startsWith?.('data:')) {
  img.crossOrigin = "anonymous";
}
      img.onload = () => {
        console.log("✅ Photo loaded successfully");
        resolve(img);
      };
      img.onerror = (err) => {
        console.error("❌ Failed to load uploaded image:", err);
        reject(new Error("Failed to load uploaded image"));
      };
      img.src = sourceImage;

    });

    if (FRAME_URL) {
      try {
        const frameImg = await new Promise((resolve, reject) => {
          const f = new Image();
          f.crossOrigin = "anonymous";
          f.onload = () => {
            console.log("✅ Frame loaded successfully");
            resolve(f);
          };
          f.onerror = (err) => {
            console.error("❌ Failed to load frame image:", err);
            reject(new Error("Failed to load frame image"));
          };
          f.src = FRAME_URL;
        });

        const fCanvas = document.createElement("canvas");
        fCanvas.width = outputW;
        fCanvas.height = outputH;
        const fCtx = fCanvas.getContext("2d");
        fCtx.drawImage(frameImg, 0, 0, outputW, outputH);

        let minX = outputW, minY = outputH, maxX = 0, maxY = 0;
        try {
          const imgData = fCtx.getImageData(0, 0, outputW, outputH);
          const data = imgData.data;
          const threshold = 245;
          
          for (let y = 0; y < outputH; y++) {
            for (let x = 0; x < outputW; x++) {
              const i = (y * outputW + x) * 4;
              const r = data[i], g = data[i + 1], b = data[i + 2];
              
              if (r >= threshold && g >= threshold && b >= threshold) {
                data[i + 3] = 0;
              } else {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          fCtx.putImageData(imgData, 0, 0);
        } catch (pixelErr) {
          console.warn("⚠️ Could not process frame transparency:", pixelErr);
          const margin = outputW * 0.1;
          minX = margin;
          minY = margin;
          maxX = outputW - margin;
          maxY = outputH - margin;
        }

        const frameWidth = maxX - minX;
        const frameHeight = maxY - minY;
        const frameCenterX = minX + frameWidth / 2;
        const frameCenterY = minY + frameHeight / 2;

        // Scale photo to COVER the safe area (small margin inside)
const isContain = (
  selectedFrame === "rectangular" ||
  selectedFrame === "rectangularstone" ||
  selectedFrame === "door"
);
const margin = isContain ? 0 : 20;

const innerW = frameWidth  - margin * 2;
const innerH = frameHeight - margin * 2;

const baseScale = isContain
  ? Math.min(innerW / photo.width, innerH / photo.height)    // fit full image
  : Math.max(innerW / photo.width, innerH / photo.height);   // fill for others

// ↓ more zoom-out in rectangular so full body fits
const FIT_PAD = isContain ? 0.85 : 1; // 0.82 if you want even smaller
const scale = baseScale * FIT_PAD;

const drawW = Math.round(photo.width  * scale);
const drawH = Math.round(photo.height * scale);

// center INSIDE the safe area
const dx = Math.round(minX + (innerW - drawW) / 2);
const dy = Math.round(minY + (innerH - drawH) / 2);



ctx.drawImage(photo, dx, dy, drawW, drawH);



        if (customText && customText.trim()) {
          ctx.fillStyle = "#111";
          ctx.font = "bold 48px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(customText.trim(), frameCenterX, maxY - 60);
        }

        ctx.drawImage(fCanvas, 0, 0, outputW, outputH);
      } catch (frameErr) {
        console.warn("⚠️ Frame processing failed, continuing without frame:", frameErr);
        const scale = Math.min(outputW / photo.width, outputH / photo.height);
        const drawW = photo.width * scale;
        const drawH = photo.height * scale;
        const dx = (outputW - drawW) / 2;
        const dy = (outputH - drawH) / 2;
        ctx.drawImage(photo, dx, dy, drawW, drawH);
      }
    } else {
      const scale = Math.min(outputW / photo.width, outputH / photo.height);
      const drawW = photo.width * scale;
      const drawH = photo.height * scale;
      const dx = (outputW - drawW) / 2;
      const dy = (outputH - drawH) / 2;
      ctx.drawImage(photo, dx, dy, drawW, drawH);
    }

    const finalDataUrl = canvas.toDataURL("image/png", 0.9);
    setPreparedPreview(finalDataUrl);
    
    console.log("🔄 Uploading to imgbb...");

    const base64 = finalDataUrl.split(",")[1];
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64);
    formData.append("name", `product_${id || "preview"}_${Date.now()}`);

    const uploadRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    console.log("📡 Upload response status:", uploadRes.status);

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("❌ ImgBB upload failed:", errorText);
      throw new Error(`Upload failed with status ${uploadRes.status}`);
    }

    const uploadJson = await uploadRes.json();
    console.log("📦 Upload response:", uploadJson);

    if (!uploadJson?.data?.url) {
      throw new Error("Upload successful but no URL returned");
    }

    const uploadedUrlFromApi = uploadJson.data.url;
    setUploadedUrl(uploadedUrlFromApi);
    
    console.log("✅ Image uploaded successfully:", uploadedUrlFromApi);
    
    // ✅ CRITICAL: Pass BOTH the imgbb URL and the base64 preview
    await addPersonalizedGiftToCart(uploadedUrlFromApi, finalDataUrl);
    
  } catch (err) {
    console.error("❌ Full error details:", err);
    
    let errorMessage = "Error preparing or uploading image";
    
    if (err.message.includes("Failed to load")) {
      errorMessage = "Could not load image. Please try uploading again.";
    } else if (err.message.includes("Upload failed")) {
      errorMessage = "Image upload failed. Please check your internet connection.";
    } else if (err.message.includes("network")) {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: `${errorMessage}: ${err.message || err}`
    });
  } finally {
    setIsUploading(false);
  }
};

const onCropComplete = useCallback((_, croppedAreaPixels) => {
  setCroppedAreaPixels(croppedAreaPixels);
}, []);


async function getCroppedImg(imageSrc, cropArea) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imageSrc;
  });

  const rad = (rotation * Math.PI) / 180;

  const bboxW = Math.abs(Math.cos(rad) * img.width) + Math.abs(Math.sin(rad) * img.height);
  const bboxH = Math.abs(Math.sin(rad) * img.width) + Math.abs(Math.cos(rad) * img.height);

  const tmp = document.createElement("canvas");
  tmp.width = Math.ceil(bboxW);
  tmp.height = Math.ceil(bboxH);
  const tctx = tmp.getContext("2d");

  tctx.translate(tmp.width / 2, tmp.height / 2);
  tctx.rotate(rad);
  tctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  tctx.drawImage(img, -img.width / 2, -img.height / 2);

  const out = document.createElement("canvas");
  out.width = Math.round(cropArea.width);
  out.height = Math.round(cropArea.height);
  const octx = out.getContext("2d");

  octx.drawImage(
    tmp,
    Math.round(cropArea.x),
    Math.round(cropArea.y),
    Math.round(cropArea.width),
    Math.round(cropArea.height),
    0,0,
    out.width, out.height
  );

  return out.toDataURL("image/jpeg", 0.92);
}

const handleSaveCrop = async () => {
  const croppedImg = await getCroppedImg(tempImage, croppedAreaPixels);
  setUploadedImage(croppedImg);  // only set the raw cropped photo
  setShowCropper(false);
};

// when clicking Re-Crop
const handleReCrop = () => {
  if (!originalImage && !uploadedImage) return;
  setTempImage(originalImage || uploadedImage); // prefer original source
  setPreparedPreview(null); // hide old framed preview while re-cropping
  setCrop({ x: 0, y: 0 });
  setZoom(1);
  setRotation(0);
  setFlipH(false);
  setFlipV(false);
  setCroppedAreaPixels(null);
  setShowCropper(true);
};


// ✅ NEW FUNCTION: Add personalized gift to cart
// ✅ NEW FUNCTION: Add personalized gift to cart
// ✅ NEW FUNCTION: Add personalized gift to cart
const addPersonalizedGiftToCart = async (uploadedUrl, preparedPreview) => {
  try {
    if (!product?._id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product not loaded yet.'
      });
      return;
    }

    const qty = Number(selectedTier?.qty || 1) || 1;

    const normalizeOption = (opt) => {
      if (opt === null || opt === undefined) return null;
      if (typeof opt === "string" || typeof opt === "number") return String(opt);
      if (typeof opt === "object") {
        return String(opt?.name ?? opt?.label ?? opt?.value ?? opt?.id ?? JSON.stringify(opt));
      }
      return String(opt);
    };

    const sizeVal = normalizeOption(selectedSize);
    const finishVal = normalizeOption(selectedFinish);
    const cornerVal = normalizeOption(selectedCorner);
    const paperVal = normalizeOption(selectedPaper);

    const getProductWeight = () => {
      if (selectedTier?.weightGrams && Number(selectedTier.weightGrams) > 0) {
        return Number(selectedTier.weightGrams);
      }
      if (product.weightGrams && Number(product.weightGrams) > 0) {
        return Number(product.weightGrams);
      }
      if (product.weight && Number(product.weight) > 0) {
        return Number(product.weight);
      }
      return 150;
    };
    
    const productWeight = getProductWeight();

    const dataURLtoFile = async (dataURL, filename) => {
      const res = await fetch(dataURL);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type || "image/jpeg" });
    };

    let imageFile = null;
    if (preparedPreview) {
      imageFile = await dataURLtoFile(preparedPreview, `personalized-${product._id}-${Date.now()}.jpg`);
    }

    if (!imageFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No Preview',
        text: 'Please generate a preview before adding to cart.'
      });
      return;
    }

    const formData = new FormData();
    
    formData.append("images", imageFile, imageFile.name);
    formData.append("productId", String(product._id));
    formData.append("quantity", String(qty));
    formData.append("designType", selectedDesignType || "single");
    
    // ✅ CRITICAL: Send the imgbb URL as previewUrl
    formData.append("previewUrl", uploadedUrl || "");
    
    // ✅ Also send as uploadedUrl for backward compatibility
    formData.append("uploadedUrl", uploadedUrl || "");
    
    formData.append("options", JSON.stringify({
      designType: selectedDesignType || "single",
      size: sizeVal || null,
      finish: finishVal || null,
      corner: cornerVal || null,
      paper: paperVal || null,
      customText: customText || null,
      frameType: selectedFrame || null,
      weight: productWeight,
      isCustomized: true,
      previewUrl: uploadedUrl || "", // ✅ Include in options
      uploadedUrl: uploadedUrl || "", // ✅ Also here
      raw: {
        size: selectedSize ?? null,
        finish: selectedFinish ?? null,
        corner: selectedCorner ?? null,
        paper: selectedPaper ?? null,
        customText: customText ?? null,
        frameType: selectedFrame ?? null,
        designType: selectedDesignType ?? null,
      }
    }));

    console.log("📤 Sending to cart with previewUrl:", uploadedUrl);

    const res = await fetch(`${API_BASE_URL}/addToCartWithDesign`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => ({ message: "Invalid JSON response" }));

    if (res.ok) {
      console.log("✅ Added to cart successfully");
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: '✅ Personalized gift added to cart successfully!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => navigate("/cart"));
    } else if (res.status === 401) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: '❌ Session expired. Please login again.'
      }).then(() => navigate("/signin"));
    } else {
      const errorMsg = data?.message || data?.error || "Failed to add product to cart.";
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: `❌ ${errorMsg}`
      });
    }
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: '❌ Network error. Please try again.'
    });
  }
};


  // âœ… handle submit
  const handletextSubmit = () => {
    if (!customText.trim()) {
 Swal.fire({
    icon: 'warning',
    title: 'Empty Text',
    text: 'Please enter some text before submitting!'
  });
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
 Swal.fire({
    icon: 'warning',
    title: 'No Tier Selected',
    text: 'Please select a quantity tier first.'
  });
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

                     
const getUnitLabel = () => {
    const name = normalize(product?.name || "");
    const category = normalize(categoryName);
    
    
    if (name.includes("button badge") || name.includes("badge") || category.includes("badge")) {
      return "badge";
    }
 
    if (name.includes("photo frame") || name.includes("frame") || category.includes("frame")) {
      return "frame";
    }
   
    if (name.includes("t-shirt") || name.includes("tshirt") || category.includes("t-shirt")) {
      return "t-shirt";
    }
  
    if (name.includes("flex") || name.includes("banner") || category.includes("flex") || category.includes("banner")) {
      return "flex";
    }
   
    if (name.includes("sticker") || category.includes("sticker")) {
      return "sticker";
    }
    
    if (name.includes("mug") || category.includes("mug")) {
      return "mug";
    }

     if (name.includes("flyers") || name.includes("leaflets") || category.includes("Flyers") || category.includes("Leaflets")) {
      return "flyer";
    }
    
    return "card";
  };
 const unitLabel = getUnitLabel();
  return (
    <div style={styles.container}>
{showCropper && (
  <div style={{
    position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:99999,
    display:"flex", alignItems:"center", justifyContent:"center"
  }}>
    <div style={{
      width:"90%", maxWidth:"520px", background:"#fff", borderRadius:"12px",
      padding:"20px", boxShadow:"0 8px 30px rgba(0,0,0,0.2)"
    }}>
      <h3 style={{textAlign:"center", marginBottom:"10px"}}>Adjust your photo</h3>

{/* --- CROP AREA --- */}
<div
  ref={cropBoxRef}
  style={{
    width: "100%",
    height: 360,          // tweak if you want taller/shorter
    background: selectedFrame === "rhomboid" ? "#000" : "#000",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  }}
>
  {tempImage && (
    <Cropper
      image={tempImage}
      crop={crop}
      zoom={zoom}
      rotation={rotation}

      /* per-frame/per-size aspect ratio */
      aspect={getFrameCfg(
        selectedFrame,
        (selectedSize?.label || selectedSize || "default")
      ).aspect}

      onCropChange={setCrop}

      /* clamp zoom so it never goes below minZoom */
      onZoomChange={(z) => setZoom(Math.max(z, minZoom))}

      onRotationChange={setRotation}
      onCropComplete={onCropComplete}

      /* keep image from sliding outside the box */
      restrictPosition
      minZoom={minZoom}
      maxZoom={3}
      zoomWithScroll
      showGrid
onMediaLoaded={({ naturalWidth: iw, naturalHeight: ih }) => {
  const box = cropBoxRef.current?.getBoundingClientRect();
  if (!box) return;

  const cfg = getFrameCfg(
    selectedFrame,
    (selectedSize?.label || selectedSize || "default")
  );

  const mode   = ((cfg.fit?.minPad ?? 1) < 1) ? "contain" : "cover";
  const aspect = cfg.aspect || (box.width / box.height);
  const src    = originalImage || tempImage;
  if (!src) return;

  const cover = Math.max(box.width / iw, box.height / ih);
  const over  = getCoverOverfill(selectedFrame);
  const bias  = getShapeBiasUpPercent(selectedFrame);  // <-- NEW

  // allow zoom-out for contain; enforce cover*overfill for shapes
  const minAllowed = mode === "contain" ? 1 : Math.max(1, cover * over);
  setMinZoom(minAllowed);

  setTimeout(async () => {
    const subject = await detectSubjectRectFromSrc(src);
    const { zoom, crop } = computeAutoFit({
      box, imgW: iw, imgH: ih, aspect, mode, subject,
      overfill: over, biasUpPct: bias
    });

    const z = Math.max(minAllowed, Math.min(zoom, 3));
    setZoom(z);
    setCrop({
      x: Math.max(-50, Math.min(50, crop.x)),
      y: Math.max(-50, Math.min(50, crop.y)),
    });
  }, 0);
}}

    />
  )}
</div>



      <div style={{marginTop:"15px"}}>
        <label>Zoom</label>
        <input
  type="range"
  min={minZoom}
  max={3}
  step={0.02}
  value={zoom}
  onChange={(e)=>setZoom(Number(e.target.value))}
  style={{ width:"100%" }}
/>

      </div>

      <div style={{marginTop:"15px"}}>
        <label>Rotate</label>
        <input
          type="range" min={0} max={360} step={1} value={rotation}
          onChange={(e)=>setRotation(Number(e.target.value))}
          style={{width:"100%"}}
        />
      </div>

      <div style={{display:"flex", gap:"10px", justifyContent:"center", margin:"10px 0"}}>
        <button onClick={()=>setFlipH(v=>!v)}>Flip H</button>
        <button onClick={()=>setFlipV(v=>!v)}>Flip V</button>
      </div>

      <div style={{display:"flex", gap:"10px", justifyContent:"space-between", marginTop:"15px"}}>
        <button onClick={()=>setShowCropper(false)}
          style={{flex:1, padding:"10px", borderRadius:"8px", background:"#ddd"}}>
          Cancel
        </button>
        <button onClick={handleSaveCrop}
          style={{flex:1, padding:"10px", borderRadius:"8px", background:"#d41e25", color:"#fff"}}>
          Save & Continue
        </button>
      </div>
    </div>
  </div>
)}

      <div className="responsive-container">
      <Header onMenuStateChange={setMobileMenuOpen}/>

        {/* Main */}
<div style={{
  maxWidth: "1440px",
  margin: "0 auto",
  width: "100%",
  paddingLeft: window.innerWidth < 1200 ? "1.5rem" : "2.5rem",
  paddingRight: window.innerWidth < 1200 ? "1.5rem" : "2.5rem",
  boxSizing: "border-box",
  paddingTop: isMobile ? "1rem" : "2.5rem",
  paddingBottom: isMobile ? "1rem" : "2.5rem",
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

{/* Sizes - Conditional rendering based on category */}
{/* Sizes - Conditional rendering based on category */}
{/* Sizes - Conditional rendering based on category */}
{product.sizes?.length > 0 && (() => {
  // Check if category is flex or banner
  const normalizedCategory = normalize(categoryName);
  const normalizedProductName = normalize(product?.name || "");
  
  // Debug log
  console.log("Category:", categoryName, "| Normalized:", normalizedCategory);
  console.log("Product Name:", product?.name, "| Normalized:", normalizedProductName);
  
  const isFlexOrBanner = normalizedCategory.includes("flex") || 
                         normalizedCategory.includes("banner") ||
                         normalizedProductName.includes("flex") ||
                         normalizedProductName.includes("banner");
  
  console.log("Is Flex or Banner?", isFlexOrBanner);
  
  if (isFlexOrBanner) {
    // Dropdown style for flex and banner
    return (
      <div style={{ marginBottom: "32px" }} key="size-dropdown">
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
              Choose Size
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#64748b",
              fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: "500"
            }}>
              Select your preferred dimensions
            </p>
          </div>
          <div style={{
            padding: "8px 12px",
            backgroundColor: selectedSize ? "#007abf" : "#e2e8f0",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            color: selectedSize ? "#ffffff" : "#64748b",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            {selectedSize ? "Selected" : "Choose"}
          </div>
        </div>
        
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            style={{
              backgroundColor: isSizeDropdownOpen ? "#007abf" : "#f8fafc",
              border: `3px solid ${isSizeDropdownOpen ? "#007abf" : "#e2e8f0"}`,
              borderRadius: "16px",
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isSizeDropdownOpen 
                ? "0 20px 40px -12px rgba(0, 122, 191, 0.3), 0 0 0 1px rgba(255,255,255,0.1)" 
                : "0 4px 15px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "60px",
              transform: isSizeDropdownOpen ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "16px",
                fontWeight: "700",
                color: isSizeDropdownOpen ? "#ffffff" : "#0f172a",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: "-0.01em",
                transition: "color 0.3s ease"
              }}>
                {selectedSize 
                  ? (typeof selectedSize === 'string' ? selectedSize : selectedSize.name || selectedSize.label)
                  : "Select Size"}
              </div>
              {selectedSize && selectedSize.size && (
                <div style={{
                  fontSize: "12px",
                  color: isSizeDropdownOpen ? "rgba(255,255,255,0.8)" : "#64748b",
                  fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: "500",
                  marginTop: "4px"
                }}>
                  {selectedSize.size.width} × {selectedSize.size.height}
                </div>
              )}
            </div>
            
            <div style={{
              transform: isSizeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              color: isSizeDropdownOpen ? "#ffffff" : "#64748b"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
          
          {isSizeDropdownOpen && (
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
              {product.sizes.map((s, i) => {
                const sizeName = typeof s === 'string' ? s : (s.name || s.label || '');
                const isSelected = selectedSize 
                  ? (typeof selectedSize === 'string' 
                      ? selectedSize === sizeName 
                      : (selectedSize.name || selectedSize.label) === sizeName)
                  : false;
                
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedSize(s);
                      setIsSizeDropdownOpen(false);
                    }}
                    style={{
                      padding: "14px 16px",
                      cursor: "pointer",
                      borderBottom: i < product.sizes.length - 1 ? "1px solid #f1f5f9" : "none",
                      backgroundColor: isSelected ? "#f0f9ff" : "transparent",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = "#f8fafc";
                        e.target.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      marginBottom: s.size ? "4px" : "0"
                    }}>
                      {sizeName}
                    </div>
                    {s.size && (
                      <div style={{
                        fontSize: "12px",
                        color: "#64748b"
                      }}>
                        {s.size.width} × {s.size.height}
                      </div>
                    )}
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#007abf",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Card-based layout for other categories (original design)
    return (
      <div style={{ marginBottom: "16px" }} key="size-cards">
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
            const sizeImages = {
              standard: "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-standard-526x325.jpg",
              square: "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-square-526x325.jpg",
              normal: "https://www.moo.com/static-assets/product-images/b199bfe46c94ed9b044c2e52d18b9042f176b7f8/sizes/business_card-standard-526x325.jpg"
            };

            const sizeName = typeof s === 'string' ? s : (s.name || s.label || '');
            const sizeKey = sizeName.toLowerCase().trim();
            
            // Only show standard, square, and normal sizes for card layout
            if (sizeKey !== 'standard' && sizeKey !== 'square' && sizeKey !== 'normal') {
              return null;
            }

            const imgUrl = sizeImages[sizeKey];

            const isSelected = selectedSize 
              ? (typeof selectedSize === 'string' 
                  ? selectedSize.toLowerCase().trim() === sizeKey 
                  : (selectedSize.name || selectedSize.label || '').toLowerCase().trim() === sizeKey)
              : false;

// const handleMediaLoaded = useCallback((mediaSize) => {
//   // size of the black crop box
//   const box = cropBoxRef.current?.getBoundingClientRect();
//   if (!box) return;

//   const iw = mediaSize.naturalWidth;
//   const ih = mediaSize.naturalHeight;

//   // COVER the crop box (no gaps) with the smallest possible zoom
//   const coverZoom = Math.max(box.width / iw, box.height / ih);
//   setMinZoom(coverZoom);
//   setZoom(coverZoom);         // start fully visible, no cropping
//   setCrop({ x: 0, y: 0 });    // center
// }, []);

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
    );
  }
})()}



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
  <div style={{ 
    marginBottom: "24px",
    width: "100%",
    maxWidth: "100%"
  }}>
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
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      width: "100%"
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
              padding: "16px",
              cursor: "pointer",
              backgroundColor: isSelected 
                ? "#f8f9ff" 
                : "#ffffff",
              transition: "all 0.2s ease-in-out",
              boxShadow: isSelected 
                ? "0 4px 12px rgba(0, 123, 255, 0.15)" 
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100px",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            {/* Corner Icon */}
            <div style={{ 
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {isSquare ? (
                // Square Corner - Sharp 90° L-shape
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ display: "block" }}>
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
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ display: "block" }}>
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
            
            {/* Text content */}
            <div style={{ width: "100%" }}>
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
                lineHeight: "1.4",
                wordWrap: "break-word",
                overflowWrap: "break-word"
              }}>
                {c.description}
              </div>
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
        <th style={{ padding: "12px" }}>Price per {unitLabel}</th>
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
{/* Button Badge Upload Section - Same as Photo Frame */}
{isButtonBadge && (
  <>
    {normalize(product.name).includes("button badge") && (
      <div
        style={{
          marginTop: "40px",
          paddingTop: "30px",
          borderTop: "2px solid #e5e7eb",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: isMobile ? "20px" : "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#1e293b",
              textAlign: "center",
            }}
          >
            📌 Customize Your Button Badge
          </h3>

          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            alignItems: isMobile ? "center" : "flex-start",
            marginBottom: "20px",
          }}>
            {/* Left side - Upload & Input */}
            <div style={{ flex: 1, minWidth: "250px", width: isMobile ? "100%" : "auto", maxWidth: isMobile ? "350px" : "none" }}>
              <label
                htmlFor="upload-badge-photo"
                style={{
                  display: "block",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }}
              >
                📤 Choose Your Photo
              </label>
              <input
                id="upload-badge-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {/* Selected Frame Badge - Shows detected badge type */}
              {selectedFrame && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 16px",
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    borderRadius: "12px",
                    border: "2px solid #f59e0b",
                    textAlign: "center",
                  }}
                >
                  <div style={{ 
                    fontSize: "13px", 
                    fontWeight: "600", 
                    color: "#92400e",
                    marginBottom: "2px" 
                  }}>
                    📌 Badge Type
                  </div>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    color: "#b45309",
                    textTransform: "capitalize" 
                  }}>
                    {selectedFrame.replace('badge', ' Badge')}
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Preview with detected badge frame */}
            <div style={{ flex: 1, minWidth: "300px", width: isMobile ? "100%" : "auto", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  position: "relative",
                  width: isMobile ? "280px" : "100%",
                  maxWidth: "300px",
                  height: isMobile ? "280px" : "300px",
                  marginInline: "auto",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
{(() => {
  const sizeLabel = selectedSize?.label || selectedSize || "default";
  const cfg = getFrameCfg(selectedFrame, sizeLabel);
  const src = preparedPreview || uploadedImage;

  if (!src) {
    return (
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        height:"100%", color:"#94a3b8"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
        <p style={{ textAlign:"center", fontStyle:"italic", fontSize:14, fontWeight:500 }}>
          Your photo preview<br/>will appear here
        </p>
      </div>
    );
  }

  // use the preview inset map (A)
  const previewInset = (FRAME_PREVIEW_INSET[selectedFrame] ?? { top:"8%", right:"8%", bottom:"8%", left:"8%" });

  const insetStyle = {
    position: "absolute",
    top:    previewInset.top,
    right:  previewInset.right,
    bottom: previewInset.bottom,
    left:   previewInset.left,
    background: selectedFrame === "rhomboid" ? "#000" : "transparent"
  };

  const f = String(selectedFrame).toLowerCase();

const imgStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height:
    f.includes("round") ? "80%" :
    f.includes("heartstone") ? "94%" :
    f.includes("heart") ? "85%" :
    f.includes("rhomboid") ? "90%" :
    "100%", // default for other frames

  objectFit: "contain",

  top:
    f.includes("round") ? "10%" :
    f.includes("heartstone") ? "3%" :
    f.includes("heart") ? "7%" :
    f.includes("rhomboid") ? "5%" :
    "0", // default

  transform: "none",
  zIndex: 1,
};

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
      {/* photo area */}
      <div style={insetStyle}>
        <img src={src} alt="Preview" style={imgStyle} />
      </div>

      {/* frame overlay on top */}
      {FRAME_URL && (
        <img
          src={FRAME_URL}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            zIndex: 2
          }}
        />
      )}
    </div>
  );
})()}




                {/* Badge Frame Overlay - Uses detected frame */}
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
                    }}
                  />
                )}

{/* Photo inside frame (fills inset area)
{(preparedPreview || uploadedImage) ? (
  <img
    src={preparedPreview || uploadedImage}
    alt="Preview"
    style={{
      position: "absolute",
      top: `${(cfg?.inset?.top ?? 0) * 100}%`,
      right: `${(cfg?.inset?.right ?? 0) * 100}%`,
      bottom: `${(cfg?.inset?.bottom ?? 0) * 100}%`,
      left: `${(cfg?.inset?.left ?? 0) * 100}%`,
      width: "auto",
      height: "auto",
      objectFit: (cfg?.fit?.minPad ?? 1) < 1 ? "contain" : "cover",
      zIndex: 1,
    }}
  />
) : (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#94a3b8",
  }}>
    <div style={{ fontSize: "48px", marginBottom: "12px" }}>🖼️</div>
    <p style={{ textAlign: "center", fontStyle: "italic", fontSize: "14px", fontWeight: 500 }}>
      Your photo preview<br/>will appear here
    </p>
  </div>
)} */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handlePrepareAndUpload}
              disabled={!uploadedImage}
              style={{
                padding: "14px 32px",
                background: uploadedImage 
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "#9ca3af",
                color: "#fff",
                borderRadius: "12px",
                border: "none",
                cursor: uploadedImage ? "pointer" : "not-allowed",
                fontWeight: "600",
                fontSize: "16px",
                boxShadow: uploadedImage 
                  ? "0 4px 15px rgba(16, 185, 129, 0.4)"
                  : "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                opacity: uploadedImage ? 1 : 0.6,
              }}
              onMouseOver={(e) => {
                if (uploadedImage) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.6)";
                }
              }}
              onMouseOut={(e) => {
                if (uploadedImage) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
                }
              }}
            >
              ✅ Prepare & Add to Cart
            </button>
          </div>

          {!uploadedImage && (
            <p style={{ 
              marginTop: "12px", 
              color: "#6b7280", 
              fontSize: "14px",
              fontStyle: "italic",
              textAlign: "center"
            }}>
              Please upload a photo first
            </p>
          )}
        </div>
      </div>
    )}
  </>
)}
    </>
  ) : (
    // Original Design Type Selection
  !(isPersonalisedGift || isButtonBadge) && (
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
)
)}
  

  
</div>
  

  


{/* Upload Your Design Button - Added after quantity selector */}
{/* Upload Design Button - Exclude personalized gifts and button badges */}
{!(
  (isPersonalisedGift && normalize(product.name).includes("photo frame")) ||
  normalize(product.name).includes("button badge") ||
  normalize(product.name).includes("button-badge") ||
  normalize(product.name).includes("badge")
) && (
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







{/* Personalised Gift Upload */}
{isPersonalisedGift && (
  <>
    {normalize(product.name).includes("photo frame") && (
      <div
        style={{
          marginTop: "40px",
          paddingTop: "30px",
          borderTop: "2px solid #e5e7eb",
          width: "100%",
        }}
      >
        <div
  style={{
    background: "#fff",
    padding: isMobile ? "20px" : "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
  }}
>
  <h3
    style={{
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#1e293b",
      textAlign: "center",
    }}
  >
    📸 Customize Your Photo Frame
  </h3>

  <div style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "20px",
    alignItems: isMobile ? "center" : "flex-start",
    marginBottom: "20px",
  }}>
    {/* Left side - Upload & Input */}
    <div style={{ flex: 1, minWidth: "250px" ,width: isMobile ? "100%" : "auto",
  maxWidth: isMobile ? "350px" : "none"}}>
      <label
        htmlFor="upload-photo"
        style={{
          display: "block",
          padding: "12px 24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "transform 0.2s, box-shadow 0.2s",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
        }}
      >
        📤 Choose Your Photo
      </label>
      <input
        id="upload-photo"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <input
        type="text"
        placeholder="✨ Add your custom message here..."
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          width: "100%",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          fontSize: "15px",
          outline: "none",
          boxSizing: "border-box",
          display: "block",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#667eea";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Selected Frame Badge */}
      {selectedFrame && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            borderRadius: "12px",
            border: "2px solid #f59e0b",
            textAlign: "center",
          }}
        >
          <div style={{ 
            fontSize: "13px", 
            fontWeight: "600", 
            color: "#92400e",
            marginBottom: "2px" 
          }}>
            🖼️ Frame Style
          </div>
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#b45309",
            textTransform: "capitalize" 
          }}>
            {selectedFrame}
          </div>
        </div>
      )}
    </div>

    {/* Right side - Preview */}
    <div style={{ flex: 1, minWidth: "300px" , width: isMobile ? "100%" : "auto",
  display: "flex",
  justifyContent: "center"}}>
      <div
        style={{
          position: "relative",
          width: isMobile ? "280px" : "100%",
          maxWidth: "300px",
         height: isMobile ? "280px" : "300px",
          marginInline: "auto",
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
{(() => {
  const sizeLabel = selectedSize?.label || selectedSize || "default";
  const cfg = getFrameCfg(selectedFrame, sizeLabel);
  const src = preparedPreview || uploadedImage;

  if (!src) {
    return (
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        height:"100%", color:"#94a3b8"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
        <p style={{ textAlign:"center", fontStyle:"italic", fontSize:14, fontWeight:500 }}>
          Your photo preview<br/>will appear here
        </p>
      </div>
    );
  }

  const insetStyle = {
    position: "absolute",
    top:    `${cfg.inset.top  * 100}%`,
    right:  `${cfg.inset.right* 100}%`,
    bottom: `${cfg.inset.bottom* 100}%`,
    left:   `${cfg.inset.left * 100}%`,
  };

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
      {/* Diamond underlay ONLY for rhomboid (removes white tip) */}
      {String(selectedFrame).toLowerCase().includes("rhomboid") && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
        >
          <polygon points="50,2 98,50 50,98 2,50" fill="#000" />
        </svg>
      )}

    <img
  src={src}
  alt="Preview"
  style={(() => {
    const f = String(selectedFrame || "").toLowerCase();

    // per-shape height + vertical centering
    const height =
      f.includes("round")      ? "80%" :
      f.includes("heartstone") ? "94%" :
      f.includes("heart")      ? "85%" :
      f.includes("rhomboid")   ? "90%" :
                                 "100%";

    const top =
      f.includes("round")      ? "10%" :
      f.includes("heartstone") ? "3%"  :
      f.includes("heart")      ? "7%"  :
      f.includes("rhomboid")   ? "5%"  :
                                 "0";

    return {
      position: "absolute",
      inset: 0,
      width: "100%",
      height,                 // 👈 shape-specific height
      objectFit: "contain",   // 👈 force contain for ALL
      top,                    // 👈 nudge down to keep centered
      transform: "none",
      zIndex: 2
    };
  })()}
/>

      {/* Frame overlay */}
      {FRAME_URL && (
        <img
          src={FRAME_URL}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            zIndex: 3
          }}
        />
      )}
    </div>
  );
})()}



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

        {(uploadedImage || preparedPreview ) && (
          <button
            onClick={handleReCrop}
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              padding: "8px 14px",
              background: "rgba(37, 99, 235, 0.95)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              zIndex: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            ✂️ Re-Crop
          </button>
        )}
      </div>
    </div>
  </div>

  {/* Action Buttons */}
<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  }}
>
  <button
    onClick={handlePrepareAndUpload}
    disabled={!uploadedImage}
    style={{
      padding: "14px 32px",
      background: uploadedImage 
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "#9ca3af",
      color: "#fff",
      borderRadius: "12px",
      border: "none",
      cursor: uploadedImage ? "pointer" : "not-allowed",
      fontWeight: "600",
      fontSize: "16px",
      boxShadow: uploadedImage 
        ? "0 4px 15px rgba(16, 185, 129, 0.4)"
        : "none",
      transition: "transform 0.2s, box-shadow 0.2s",
      opacity: uploadedImage ? 1 : 0.6,
    }}
    onMouseOver={(e) => {
      if (uploadedImage) {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.6)";
      }
    }}
    onMouseOut={(e) => {
      if (uploadedImage) {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
      }
    }}
  >
    ✅ Prepare & Add to Cart
  </button>
</div>


{!uploadedImage && (
  <p style={{ 
    marginTop: "12px", 
    color: "#6b7280", 
    fontSize: "14px",
    fontStyle: "italic",
    textAlign: "center"
  }}>
    Please upload a photo first
  </p>
)}
</div>
      </div>
    )}
  </>
)}
</div>
  
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


          
<Review productId={id}/>

        </div>
        </div>
        <Footer />
        </div>
        </div>    
      
    
    
  );
}