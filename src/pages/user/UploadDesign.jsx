import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";

export default function UploadDesign() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [fullPreview, setFullPreview] = useState(null);

  // Cropping states
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingSide, setCroppingSide] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Convert cropped selection to base64
  const getCroppedImg = (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
      image.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCroppingImage(reader.result); // open crop modal
      setCroppingSide(side);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(croppingImage, croppedAreaPixels);
    if (croppingSide === "front") setFrontPreview(cropped);
    if (croppingSide === "back") setBackPreview(cropped);
    if (croppingSide === "full") setFullPreview(cropped);

    setCroppingImage(null);
    setCroppingSide(null);
  };

  const handleSubmit = () => {
    if (!frontPreview && !backPreview && !fullPreview) {
      alert("⚠️ Please upload at least one design (Front, Back, or Full).");
      return;
    }
    alert("✅ Design submitted successfully!");
    navigate(`/product/${productId}`);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "800",
          marginBottom: "30px",
          textAlign: "center",
          background: "linear-gradient(90deg,#2563eb,#9333ea)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Upload Your Design
      </h2>

      {/* Upload grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "25px",
          marginBottom: "40px",
        }}
      >
        {["front", "back", "full"].map((side) => {
          const preview =
            side === "front"
              ? frontPreview
              : side === "back"
              ? backPreview
              : fullPreview;

          return (
            <div
              key={side}
              style={{
                border: "2px dashed #c7d2fe",
                borderRadius: "16px",
                padding: "25px",
                textAlign: "center",
                background: "rgba(255,255,255,0.6)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <label
                style={{
                  fontWeight: "700",
                  marginBottom: "15px",
                  display: "block",
                  textTransform: "capitalize",
                  color: "#1f2937",
                }}
              >
                {side} Side
              </label>
              <input
                type="file"
                id={`${side}-upload`}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, side)}
              />
              {!preview ? (
                <label
                  htmlFor={`${side}-upload`}
                  style={{
                    background: "linear-gradient(90deg,#2563eb,#9333ea)",
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "inline-block",
                    boxShadow: "0 4px 12px rgba(79,70,229,0.4)",
                  }}
                >
                  Choose File
                </label>
              ) : (
                <img
                  src={preview}
                  alt={`${side} preview`}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => navigate(`/product/${productId}`)}
          style={{
            padding: "14px 28px",
            background: "linear-gradient(90deg,#6b7280,#374151)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 5px 15px rgba(55,65,81,0.4)",
            transition: "all 0.3s ease",
          }}
        >
          ⬅ Back to Product
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: "14px 28px",
            background: "linear-gradient(90deg,#16a34a,#15803d)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 5px 15px rgba(22,163,74,0.4)",
            transition: "all 0.3s ease",
          }}
        >
          ✅ Submit Design
        </button>
      </div>

      {/* Crop modal */}
      {croppingImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              padding: "25px",
              width: "90%",
              maxWidth: "650px",
              height: "80%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "15px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              ✂️ Crop Your Image
            </h3>
            <div style={{ flex: 1, position: "relative" }}>
              <Cropper
                image={croppingImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => {
                  setCroppingImage(null);
                  setCroppingSide(null);
                }}
                style={{
                  background: "linear-gradient(90deg,#ef4444,#b91c1c)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
                }}
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
