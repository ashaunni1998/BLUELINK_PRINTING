// UploadDesign.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cropper from "react-easy-crop";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * UploadDesign.jsx
 * - Mobile-first, responsive upload + crop UI
 * - Supports: PNG, JPEG, GIF, PDF, AI, PSD, INDD
 * - Crop modal available for image files only
 * - Non-image files display file icon preview
 */

let API_BASE_URL = "https://api.bluelinkprinting.com/api";
try {
  const cfg = require("../../config");
  API_BASE_URL = cfg?.API_BASE_URL || "";
} catch (e) {
  API_BASE_URL = "https://api.bluelinkprinting.com/api";
}

export default function UploadDesign() {
  const routeParams = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const param = new URLSearchParams(location.search);
  const productId = param.get("productId");

  // previews & files
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [fullPreview, setFullPreview] = useState(null);
  const [prevPreview, setPrevPreview] = useState({ front: null, back: null, full: null });
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [fullFile, setFullFile] = useState(null);
  
  // file meta
  const [fileMeta, setFileMeta] = useState({ front: null, back: null, full: null });

  // cropping states
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingSide, setCroppingSide] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // refs for hidden inputs
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const fullInputRef = useRef(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for design files

  // Supported file types
  const SUPPORTED_TYPES = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'application/postscript': '.ai',
    'image/vnd.adobe.photoshop': '.psd',
    'application/x-indesign': '.indd',
    'application/octet-stream': '' // fallback for .ai, .psd, .indd
  };

  const params = new URLSearchParams(location.search);
  const designTypeFromQuery = params.get("designType") || "single";
  const qtyFromQuery = parseInt(params.get("qty") || params.get("quantity") || "1", 10) || 1;

  const [designType, setDesignType] = useState(designTypeFromQuery);
  const [quantity, setQuantity] = useState(qtyFromQuery);
  const [size, setSize] = useState(params.get("size") || "");
  const [finish, setFinish] = useState(params.get("finish") || "");
  const [corner, setCorner] = useState(params.get("corner") || "");

  // Check if file is an image
  const isImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
  };

  // Validate file type
  const isValidFileType = (file) => {
    const ext = getFileExtension(file.name);
    const validExts = ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'ai', 'psd', 'indd'];
    return validExts.includes(ext) || Object.keys(SUPPORTED_TYPES).includes(file.type);
  };

  // Helper: file -> dataURL (for images only)
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // helper: convert dataURL -> File
  const dataURLtoFile = async (dataURL, filename = "image.jpg") => {
    const res = await fetch(dataURL);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  };

  // Get file type icon and color
  const getFileTypeInfo = (filename) => {
    const ext = getFileExtension(filename);
    const typeMap = {
      'pdf': { icon: '📄', color: '#ef4444', label: 'PDF' },
      'ai': { icon: '🎨', color: '#ff9800', label: 'AI' },
      'psd': { icon: '🖼️', color: '#31a8ff', label: 'PSD' },
      'indd': { icon: '📖', color: '#ff3366', label: 'INDD' },
      'gif': { icon: '🖼️', color: '#10b981', label: 'GIF' },
      'png': { icon: '🖼️', color: '#3b82f6', label: 'PNG' },
      'jpg': { icon: '🖼️', color: '#3b82f6', label: 'JPG' },
      'jpeg': { icon: '🖼️', color: '#3b82f6', label: 'JPEG' }
    };
    return typeMap[ext] || { icon: '📎', color: '#64748b', label: ext.toUpperCase() };
  };

  const openFileForCrop = async (file, side) => {
    if (!file) return;
    
    if (!isValidFileType(file)) {
      alert("Unsupported file type. Please use: PNG, JPEG, GIF, PDF, AI, PSD, or INDD");
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      alert("File too large (max 50MB).");
      return;
    }

    // Store raw File in state
    if (side === "front") setFrontFile(file);
    if (side === "back") setBackFile(file);
    if (side === "full") setFullFile(file);

    // For images, create preview and allow cropping
    if (isImageFile(file)) {
      const dataUrl = await fileToDataUrl(file);
      
      // For GIF, set preview directly without cropping option
      if (file.type === 'image/gif') {
        if (side === "front") setFrontPreview(dataUrl);
        if (side === "back") setBackPreview(dataUrl);
        if (side === "full") setFullPreview(dataUrl);
      } else {
        // For PNG/JPEG, open crop modal
        setCroppingImage(dataUrl);
        setCroppingSide(side);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      }
    } else {
      // For non-image files, create a file type preview
      const typeInfo = getFileTypeInfo(file.name);
      const filePreview = `file:${file.name}`;
      
      if (side === "front") setFrontPreview(filePreview);
      if (side === "back") setBackPreview(filePreview);
      if (side === "full") setFullPreview(filePreview);
    }

    setFileMeta((m) => ({ ...m, [side]: { name: file.name, size: file.size, type: file.type } }));
  };

  // Input change handler
  const handleFileChange = (e, side) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    openFileForCrop(file, side);
    e.target.value = "";
  };

  // Drag & drop
  const handleDrop = (e, side) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    openFileForCrop(file, side);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // crop callbacks
  const handleCropComplete = useCallback((_, croppedAreaPixels_) => {
    setCroppedAreaPixels(croppedAreaPixels_);
  }, []);

  // create cropped image using canvas
  const getCroppedImg = (imageSrc, cropPixels) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const width = Math.max(1, Math.round(cropPixels.width));
        const height = Math.max(1, Math.round(cropPixels.height));
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          Math.round(cropPixels.x),
          Math.round(cropPixels.y),
          Math.round(cropPixels.width),
          Math.round(cropPixels.height),
          0,
          0,
          width,
          height
        );
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      image.onerror = (err) => reject(err);
    });

  const handleSaveCrop = async () => {
    try {
      if (!croppingImage || !croppedAreaPixels || !croppingSide) return;
      const croppedDataUrl = await getCroppedImg(croppingImage, croppedAreaPixels);

      const croppedFile = await dataURLtoFile(croppedDataUrl, `${croppingSide}-cropped.jpg`);

      if (croppingSide === "front") {
        setFrontPreview(croppedDataUrl);
        setFrontFile(croppedFile);
      }
      if (croppingSide === "back") {
        setBackPreview(croppedDataUrl);
        setBackFile(croppedFile);
      }
      if (croppingSide === "full") {
        setFullPreview(croppedDataUrl);
        setFullFile(croppedFile);
      }

      setCroppingImage(null);
      setCroppingSide(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error("Crop save error:", err);
      alert("Failed to save crop.");
    }
  };

  // Clear preview
  const handleClear = (side) => {
    if (side === "front") {
      setFrontPreview(null);
      setFrontFile(null);
    }
    if (side === "back") {
      setBackPreview(null);
      setBackFile(null);
    }
    if (side === "full") {
      setFullPreview(null);
      setFullFile(null);
    }
    setFileMeta((m) => ({ ...m, [side]: null }));
    setPrevPreview((p) => ({ ...p, [side]: null }));
  };

  // Revert to last preview
  const handleRevert = (side) => {
    setPrevPreview((p) => {
      const prev = p[side];
      if (prev) {
        if (side === "front") setFrontPreview(prev);
        if (side === "back") setBackPreview(prev);
        if (side === "full") setFullPreview(prev);
        return { ...p, [side]: null };
      } else {
        alert("No previous version to revert to.");
        return p;
      }
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const qs = new URLSearchParams(window.location.search || "");

      const productIdFromRoute =
        (routeParams && (routeParams.id || routeParams.productId || routeParams.product)) || null;
      const productIdFromQuery = qs.get("productId") || qs.get("id") || null;
      const productId = productIdFromRoute || productIdFromQuery;

      const quantity = Number(qs.get("quantity") || qs.get("qty") || 1) || 1;
      const designType = qs.get("designType") || "single";
      const sizeRaw = qs.get("size") || "";
      const finishRaw = qs.get("finish") || "";
      const cornerRaw = qs.get("corner") || "";
      const paperRaw = qs.get("paper") || "";

      if (!productId) {
        alert("Product info missing. Please go back and try again.");
        return;
      }

      let resolvedFiles = [];
      if (frontFile) resolvedFiles.push(frontFile);
      if (backFile) resolvedFiles.push(backFile);
      if (fullFile) resolvedFiles.push(fullFile);

      if (resolvedFiles.length === 0) {
        alert("Please upload at least one design file.");
        return;
      }

      console.log("Resolved files to upload:", resolvedFiles.map(f => f?.name || "(file)"));

      const formData = new FormData();
      resolvedFiles.forEach(f => formData.append("images", f, f.name || "upload.jpg"));
      formData.append("productId", String(productId));
      formData.append("quantity", String(quantity));
      formData.append("designType", String(designType));
      formData.append("options", JSON.stringify({
        designType,
        size: sizeRaw || null,
        finish: finishRaw || null,
        corner: cornerRaw || null,
        paper: paperRaw || null,
      }));

      const res = await fetch(`${API_BASE_URL}/addToCartWithDesign`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("addToCartWithDesign failed:", json);
        alert(json.message || "Failed to add to cart");
        return;
      }

      console.log("addToCartWithDesign success:", json);
      navigate("/cart");
    } catch (err) {
      console.error("handleSubmit error:", err);
      alert("Unexpected error uploading design. See console for details.");
    }
  };

  // Render preview based on file type
  const renderPreview = (preview, side) => {
    if (!preview) {
      return (
        <div className="dz-placeholder">
          <div className="dz-title">Drop file or tap Choose</div>
          <div className="dz-sub">PNG • JPEG • GIF • PDF • AI • PSD • INDD</div>
          <div className="dz-sub">max 50MB</div>
        </div>
      );
    }

    // Check if it's a file type preview (non-image)
    if (typeof preview === 'string' && preview.startsWith('file:')) {
      const filename = preview.substring(5);
      const typeInfo = getFileTypeInfo(filename);
      return (
        <div className="file-preview">
          <div className="file-icon" style={{ background: typeInfo.color }}>
            <span className="file-icon-emoji">{typeInfo.icon}</span>
          </div>
          <div className="file-type-label">{typeInfo.label}</div>
          <div className="file-name-short">{filename}</div>
        </div>
      );
    }

    // Image preview
    return <img src={preview} alt={`${side} preview`} className="preview-img" />;
  };

  // Check if re-crop should be available
  const canRecrop = (side) => {
    const file = side === "front" ? frontFile : side === "back" ? backFile : fullFile;
    const preview = side === "front" ? frontPreview : side === "back" ? backPreview : fullPreview;
    return preview && file && isImageFile(file) && file.type !== 'image/gif';
  };

  const InputFile = ({ side, inputRef }) => (
    <input
      ref={inputRef}
      type="file"
      id={`${side}-upload`}
      accept=".png,.jpg,.jpeg,.gif,.pdf,.ai,.psd,.indd"
      style={{ display: "none" }}
      onChange={(e) => handleFileChange(e, side)}
    />
  );

  return (
    <div className="responsive-container">
      <Header />

      <main className="ud-container">
        <div className="ud-card">
          <header className="ud-card-header">
            <div>
              <h1 className="ud-title">Upload Your Design</h1>
              <p className="ud-sub">Front / Back / Full — drag & drop or choose file. Supports PNG, JPEG, GIF, PDF, AI, PSD, INDD.</p>
            </div>

            <div className="ud-product">
              <div className="ud-product-label">Product ID</div>
              <div className="ud-product-id">{productId || "—"}</div>
            </div>
          </header>

          <section className="upload-grid">
            {(designType === "single" ? ["front"] : designType === "double" ? ["front", "back"] : ["full"]).map((side) => {
              const preview = side === "front" ? frontPreview : side === "back" ? backPreview : fullPreview;
              const meta = fileMeta[side];
              return (
                <div key={side} className="upload-card">
                  <div className="upload-card-top">
                    <div className="upload-title">{side} design</div>

                    <div className="upload-actions">
                      <button
                        className="ud-choose-btn"
                        onClick={() => {
                          if (side === "front") frontInputRef.current?.click();
                          if (side === "back") backInputRef.current?.click();
                          if (side === "full") fullInputRef.current?.click();
                        }}
                      >
                        Choose
                      </button>

                      {preview ? (
                        <>
                          {canRecrop(side) && (
                            <button
                              className="ud-ghost-btn"
                              onClick={() => {
                                setCroppingImage(preview);
                                setCroppingSide(side);
                                setCrop({ x: 0, y: 0 });
                                setZoom(1);
                              }}
                            >
                              Re-crop
                            </button>
                          )}

                          <button className="ud-ghost-btn" onClick={() => handleRevert(side)}>
                            Revert
                          </button>

                          <button className="ud-ghost-btn" onClick={() => handleClear(side)} style={{ background: "#fff4f4", borderColor: "#fecaca" }}>
                            Clear
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className="drop-zone"
                    onDrop={(e) => handleDrop(e, side)}
                    onDragOver={handleDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (side === "front") frontInputRef.current?.click();
                        if (side === "back") backInputRef.current?.click();
                        if (side === "full") fullInputRef.current?.click();
                      }
                    }}
                  >
                    {side === "front" && <InputFile side="front" inputRef={frontInputRef} />}
                    {side === "back" && <InputFile side="back" inputRef={backInputRef} />}
                    {side === "full" && <InputFile side="full" inputRef={fullInputRef} />}

                    {renderPreview(preview, side)}
                  </div>

                  <div className="upload-meta-row">
                    <div className="meta-left">
                      {meta ? (
                        <>
                          <div className="meta-name">{meta.name}</div>
                          <div className="meta-size">{formatSize(meta.size)}</div>
                        </>
                      ) : (
                        <div className="meta-note">No file selected</div>
                      )}
                    </div>

                    <div className="meta-actions">
                      <button
                        className="ud-ghost-btn"
                        onClick={() => {
                          if (side === "front") frontInputRef.current?.click();
                          if (side === "back") backInputRef.current?.click();
                          if (side === "full") fullInputRef.current?.click();
                        }}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <div className="ud-actions">
            <button className="ud-back" onClick={() => navigate(`/product/${productId}`)}>
              ← Back to Product
            </button>
            <button className="ud-submit" onClick={handleSubmit}>
              Submit Design
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Crop modal (only for PNG/JPEG) */}
      {croppingImage && (
        <div className="crop-overlay" role="dialog" aria-modal="true">
          <div className="crop-panel">
            <div className="crop-top">
              <div className="crop-title">✂️ Crop {croppingSide?.toUpperCase()}</div>
            </div>

            <div className="crop-body">
              <div className="crop-area" aria-hidden>
                <Cropper
                  image={croppingImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  showGrid={false}
                />
              </div>

              <aside className="crop-sidebar">
                <div className="crop-inputs">
                  <label className="range-label">Zoom</label>
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />

                  <label className="range-label">X position</label>
                  <input type="range" min={-100} max={100} step={1} value={Math.round(crop.x)} onChange={(e) => setCrop((c) => ({ ...c, x: Number(e.target.value) }))} />

                  <label className="range-label">Y position</label>
                  <input type="range" min={-100} max={100} step={1} value={Math.round(crop.y)} onChange={(e) => setCrop((c) => ({ ...c, y: Number(e.target.value) }))} />
                </div>
              </aside>
            </div>

            <div className="crop-footer">
              <button
                className="ud-ghost-btn"
                onClick={() => {
                  setCroppingImage(null);
                  setCroppingSide(null);
                  setCroppedAreaPixels(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              >
                Cancel
              </button>
              <button className="ud-choose-btn" onClick={handleSaveCrop}>
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        :root {
          --blue-600: #2563eb;
          --muted: #64748b;
          --card-bg: #ffffff;
        }

        .ud-page {
          min-height: 100vh;
          background: linear-gradient(180deg,#fbfdff,#f1f5ff);
          display:flex;
          flex-direction:column;
        }

        .ud-container {
          width:100%;
          max-width:62%;
          margin: 14px 15% 14px 18%;
          padding: 12px;
          box-sizing:border-box;
          flex:1 0 auto;
        }

        .ud-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          border: 1px solid rgba(15,23,42,0.03);
        }

        .ud-card-header {
          display:flex;
          gap:12px;
          align-items:center;
          justify-content:space-between;
          margin-bottom: 12px;
          flex-wrap:wrap;
        }
        .ud-title { margin:0; font-size:18px; color:#0f172a; }
        .ud-sub { margin:4px 0 0; font-size:13px; color:var(--muted); max-width:520px; }

        .ud-product { text-align:right; min-width:120px; }
        .ud-product-label { font-size:12px; color:var(--muted); font-weight:700; }
        .ud-product-id { font-size:14px; color:#0f172a; font-weight:800; }

        .upload-grid { display:grid; grid-template-columns: 1fr; gap:12px; }
        @media (min-width:640px) { .upload-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width:980px) { .upload-grid { grid-template-columns: repeat(3, 1fr); } }

        .upload-card {
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(247,250,255,0.96));
          border-radius:10px;
          padding:12px;
          display:flex;
          flex-direction:column;
          min-height:220px;
          border:1px solid rgba(15,23,42,0.02);
        }

        .upload-card-top { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
        .upload-title { text-transform:capitalize; font-weight:800; color:#0f172a; }
        .upload-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

        .ud-choose-btn {
          background: linear-gradient(90deg,var(--blue-600), #1d4ed8);
          color:white;
          border:none;
          padding:8px 12px;
          border-radius:8px;
          font-weight:700;
          cursor:pointer;
          box-shadow:0 8px 20px rgba(37,99,235,0.1);
        }
        .ud-ghost-btn {
          background:white;
          border:1px solid rgba(2,6,23,0.06);
          padding:8px 10px;
          border-radius:8px;
          cursor:pointer;
          font-weight:700;
        }

        .drop-zone {
          flex:1 1 auto;
          border-radius:8px;
          border: 2px dashed rgba(99,102,241,0.12);
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 8px;
          min-height:120px;
          overflow:hidden;
        }
        .dz-placeholder { text-align:center; }
        .dz-title { font-weight:700; color:#0f172a; }
        .dz-sub { color:var(--muted); font-size:13px; margin-top:6px; }

        .preview-img { width:100%; height:160px; object-fit:contain; border-radius:8px; background:#f8fafc; display:block; }

        /* File preview styles for non-images */
        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
        }

        .file-icon {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .file-icon-emoji {
          font-size: 40px;
        }

        .file-type-label {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          background: rgba(255,255,255,0.9);
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid rgba(15,23,42,0.06);
        }

        .file-name-short {
          font-size: 12px;
          color: var(--muted);
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .upload-meta-row { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:10px; flex-wrap:wrap; }
        .meta-left { min-width:0; }
        .meta-name { font-size:13px; color:#0f172a; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .meta-size { font-size:12px; color:var(--muted); margin-top:2px; }
        .meta-note { font-size:13px; color:var(--muted); }

        .meta-actions { display:flex; gap:8px; align-items:center; }

        .ud-actions { display:flex; gap:12px; margin-top:14px; justify-content:flex-end; flex-wrap:wrap; }
        .ud-back { background:white; border:1px solid rgba(2,6,23,0.06); padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:700; }
        .ud-submit { background: linear-gradient(90deg,#06b6d4,var(--blue-600)); color:white; border:none; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:800; }

        /* Crop modal */
        .crop-overlay {
          position:fixed;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(2,6,23,0.6);
          z-index:1500;
          padding: 18px;
          overflow:auto;
        }

        .crop-panel {
          width:100%;
          max-width:1100px;
          background:white;
          border-radius:12px;
          overflow:hidden;
          display:flex;
          flex-direction:column;
        }

        .crop-top {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:12px 16px;
          border-bottom:1px solid rgba(2,6,23,0.04);
          gap:8px;
          flex-wrap:wrap;
        }

        .crop-title { font-weight:800; }

        .crop-controls { display:flex; gap:10px; align-items:center; }

        .crop-body { display:flex; gap:12px; padding:12px; align-items:stretch; flex-direction:column; }
        .crop-area { flex:1; min-height:320px; position:relative; border-radius:8px; overflow:hidden; background:#000; }
        .crop-sidebar { width:100%; display:flex; flex-direction:column; gap:10px; }

        .preview-box { width:100%; height:160px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .crop-preview-img { width:100%; object-fit:contain; }

        .range-label { font-size:13px; color:var(--muted); margin-bottom:6px; display:block; }
        .crop-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 12px 16px;
          border-top: 1px solid rgba(2,6,23,0.06);
          background: #fff;
          flex-wrap: wrap;
        }

        .crop-inputs { display: flex; flex-direction: column; gap: 12px; }

        /* Desktop layout for crop */
        @media (min-width:880px) {
          .crop-body { flex-direction:row; }
          .crop-sidebar { width:300px; }
          .crop-area { min-height:420px; }
        }

        /* small tweaks */
        @media (max-width:420px) {
          .ud-choose-btn, .ud-ghost-btn, .ud-back, .ud-submit { padding:10px 12px; border-radius:10px; font-size:14px; }
          .preview-img { height:140px; }
          .file-icon { width: 60px; height: 60px; }
          .file-icon-emoji { font-size: 30px; }
        }

        button:focus { outline: 3px solid rgba(37,99,235,0.14); outline-offset: 2px; }
      `}</style>
    </div>
  );
}