// UploadDesign.jsx
import React, { useState, useEffect,useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * UploadDesign.jsx
 * - Mobile-first, responsive upload + crop UI
 * - Crop modal has only two action buttons: Cancel (back) and Save crop
 * - Re-crop / Revert / Clear available from each preview card (outside modal)
 * - Minimal, professional styles
 */

export default function UploadDesign() {
  const { productId } = useParams();
  const navigate = useNavigate();




  const priceOptions = [
  { qty: 100, single: 35, double: 45 },
  { qty: 200, single: 45, double: 55 },
  { qty: 300, single: 55, double: 65 },
  { qty: 400, single: 75, double: 85 },
  { qty: 500, single: 90, double: 95 },
  { qty: 1000, single: 125, double: 145 },
  { qty: 1500, single: 170, double: 190 },
];

  // previews and undo
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [fullPreview, setFullPreview] = useState(null);
  const [prevPreview, setPrevPreview] = useState({ front: null, back: null, full: null });



  const isDoubleSided =
  (frontPreview && backPreview) || fullPreview ? true : false;
const [selectedQty, setSelectedQty] = useState(priceOptions[0].qty);
const [displayPrice, setDisplayPrice] = useState(priceOptions[0].single); // default single side
const [dropdownOpen, setDropdownOpen] = useState(false);


useEffect(() => {
  const matched = priceOptions.find((p) => p.qty === selectedQty);
  if (matched) {
    setDisplayPrice(isDoubleSided ? matched.double : matched.single);
  }
}, [selectedQty, isDoubleSided]);

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

  const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

  // Helper: file -> dataURL
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Open file for cropping
  const openFileForCrop = async (file, side) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only images allowed (PNG/JPG/GIF).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File too large (max 6MB).");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setCroppingImage(dataUrl);
    setCroppingSide(side);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setFileMeta((m) => ({ ...m, [side]: { name: file.name, size: file.size } }));
  };

  // Input change handler
  const handleFileChange = (e, side) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    openFileForCrop(file, side);
    e.target.value = ""; // allow same-file re-upload
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

  // Save cropped image (only top Save crop button will call this)
  const handleSaveCrop = async () => {
    try {
      if (!croppingImage || !croppedAreaPixels || !croppingSide) return;
      const cropped = await getCroppedImg(croppingImage, croppedAreaPixels);

      // store previous preview for one-step revert
      setPrevPreview((p) => ({
        ...p,
        [croppingSide]: croppingSide === "front" ? frontPreview : croppingSide === "back" ? backPreview : fullPreview,
      }));

      // set new preview
      if (croppingSide === "front") setFrontPreview(cropped);
      if (croppingSide === "back") setBackPreview(cropped);
      if (croppingSide === "full") setFullPreview(cropped);

      // close modal
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

  // Clear preview (delete)
  const handleClear = (side) => {
    if (side === "front") setFrontPreview(null);
    if (side === "back") setBackPreview(null);
    if (side === "full") setFullPreview(null);
    setFileMeta((m) => ({ ...m, [side]: null }));
    setPrevPreview((p) => ({ ...p, [side]: null }));
  };

  // Revert to last preview (one step)
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

 const handleSubmit = async () => {
  if (!frontPreview && !backPreview && !fullPreview) {
    alert("Please upload at least one design.");
    return;
  }

  const sideType = isDoubleSided ? "double" : "single";

  try {
    const res = await fetch("https://kerala-digital-park-server.vercel.app/api/addToCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId,
        quantity: selectedQty,
        price: displayPrice,
        sideType,
        design: { front: frontPreview, back: backPreview, full: fullPreview }
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Design added to cart!");
      navigate("/cart");
    } else if (res.status === 401) {
      alert("⚠️ Session expired. Please login again.");
      navigate("/signin");
    } else {
      alert(data.message || "Failed to add design to cart.");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
  }
};


  // hidden file input component
  const InputFile = ({ side, inputRef }) => (
    <input
      ref={inputRef}
      type="file"
      id={`${side}-upload`}
      accept="image/*"
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
              <p className="ud-sub">Front / Back / Full — drag & drop, pick file or crop inline. Mobile-first, smooth experience.</p>
            </div>

            <div className="ud-product">
              <div className="ud-product-label">Product ID</div>
              <div className="ud-product-id">{productId || "—"}</div>
            </div>
          </header>

          <section className="upload-grid">
            {["front", "back", "full"].map((side) => {
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
                          <button
                            className="ud-ghost-btn"
                            onClick={() => {
                              // re-crop: open modal with current preview
                              setCroppingImage(preview);
                              setCroppingSide(side);
                              setCrop({ x: 0, y: 0 });
                              setZoom(1);
                            }}
                          >
                            Re-crop
                          </button>

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

                    {preview ? (
                      <img src={preview} alt={`${side} preview`} className="preview-img" />
                    ) : (
                      <div className="dz-placeholder">
                        <div className="dz-title">Drop image or tap Choose</div>
                        <div className="dz-sub">PNG / JPG • max 6MB</div>
                      </div>
                    )}
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



<div style={{ margin: "30px 0", position: "relative", maxWidth: "420px" }}>
  <label
    style={{
      display: "block",
      fontWeight: 700,
      fontSize: "16px",
      marginBottom: "10px",
      color: "#1e293b",
    }}
  >
    Select Quantity
  </label>

  {/* Dropdown box */}
  <div
    onClick={() => setDropdownOpen((prev) => !prev)}
    style={{
      padding: "14px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff",
      cursor: "pointer",
      boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      transition: "all 0.2s ease",
    }}
  >
    <span style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a" }}>
      {selectedQty} pcs — ${displayPrice}
    </span>
    <span
      style={{
        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s ease",
        fontSize: "18px",
        color: "#475569",
      }}
    >
      ▼
    </span>
  </div>

  {/* Dropdown list */}
  {dropdownOpen && (
    <div
      style={{
        position: "absolute",
        top: "110%",
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        marginTop: "6px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {priceOptions.map((opt) => {
        const price = isDoubleSided ? opt.double : opt.single;
        const isSelected = selectedQty === opt.qty;
        return (
          <div
            key={opt.qty}
            onClick={() => {
              setSelectedQty(opt.qty);
              setDropdownOpen(false);
            }}
            style={{
              padding: "14px 18px",
              cursor: "pointer",
              background: isSelected ? "#2563eb" : "#fff",
              color: isSelected ? "#fff" : "#0f172a",
              fontWeight: isSelected ? 700 : 500,
              fontSize: "15px",
              borderBottom:
                opt.qty !== priceOptions[priceOptions.length - 1].qty
                  ? "1px solid #f1f5f9"
                  : "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = isSelected
                ? "#1e40af"
                : "#f8fafc")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = isSelected
                ? "#2563eb"
                : "#fff")
            }
          >
            {opt.qty} pcs — ${price}
          </div>
        );
      })}
    </div>
  )}

  {/* Live price badge */}
  <div
    style={{
      marginTop: "16px",
      fontSize: "20px",
      fontWeight: 800,
      color: "#2563eb",
      textAlign: "right",
    }}
  >
    Total: ${displayPrice}
  </div>
</div>


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

      {/* Crop modal (only top: Cancel + Save crop) */}
      {croppingImage && (
  <div className="crop-overlay" role="dialog" aria-modal="true">
    <div className="crop-panel">
      <div className="crop-top">
        <div className="crop-title">✂️ Crop {croppingSide?.toUpperCase()}</div>
      </div>

      {/* Body */}
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
          {/* ⬇️ Removed the second preview box */}

          <div className="crop-inputs">
            <label className="range-label">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />

            <label className="range-label">X position</label>
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={Math.round(crop.x)}
              onChange={(e) => setCrop((c) => ({ ...c, x: Number(e.target.value) }))}
            />

            <label className="range-label">Y position</label>
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={Math.round(crop.y)}
              onChange={(e) => setCrop((c) => ({ ...c, y: Number(e.target.value) }))}
            />
          </div>
        </aside>
      </div>

      {/* ✅ Buttons moved here */}
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

      {/* Styles (mobile-first) */}
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
          max-width:1200px;
          margin: 14px auto;
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
        }

        button:focus { outline: 3px solid rgba(37,99,235,0.14); outline-offset: 2px; }
      `}</style>
    </div>
  );
}
