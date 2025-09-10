import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropImage.css';

function CropImage({ imageFile, isOpen, setIsOpen, onCropComplete }) {
  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Load image when imageFile changes
  useEffect(() => {
    if (!imageFile) return;

    if (typeof imageFile === 'string') {
      setImageSrc(imageFile);
    } else if (imageFile instanceof File || imageFile instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(imageFile);
    } else if (imageFile?.url) {
      setImageSrc(imageFile.url);
    } else if (imageFile?.file instanceof File || imageFile?.file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(imageFile.file);
    } else if (imageFile?.src) {
      setImageSrc(imageFile.src);
    } else {
      console.error('Invalid imageFile format:', imageFile);
    }
  }, [imageFile]);

  // Center square crop when image loads
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height) * 0.5;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    setCrop({ unit: 'px', width: size, height: size, x, y, aspect: 1 });
    imgRef.current = e.currentTarget;
  };

  // Update canvas preview whenever crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const image = imgRef.current;
      const ctx = canvas.getContext('2d');

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
    }
  }, [completedCrop]);

  // Crop and return a blob
  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return null;

    const canvas = canvasRef.current;
    const image = imgRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  // Handle Save Button
  const handleCropComplete = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      const previewUrl = URL.createObjectURL(croppedBlob);
      const newImage = { url: previewUrl, file: croppedFile, isExisting: false };

      onCropComplete(newImage);
      handleClose();
    }
  };

  // Reset states and close modal
  const handleClose = () => {
    setIsOpen(false);
    setImageSrc(null);
    setCompletedCrop(null);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25, aspect: 1 });
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Crop Image (Square)</h2>
          <button onClick={handleClose} className="close-btn">
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="modal-body">
          {/* Crop Area */}
          <div className="crop-area-wrapper">
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={setCompletedCrop}
              aspect={1}
              minWidth={50}
              minHeight={50}
              keepSelection
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
          </div>

          {/* Instructions */}
          <p className="instructions">
            Drag the corners to adjust your crop area. The image will be cropped to a perfect square.
          </p>

          {/* Preview Section */}
          {completedCrop && (
            <div className="preview-section">
              <h3 className="preview-title">Preview:</h3>
              <canvas
                ref={canvasRef}
                style={{
                  border: '1px solid #ccc',
                  maxWidth: '150px',
                  maxHeight: '150px'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="modal-footer">
          <button
            onClick={handleCropComplete}
            disabled={!completedCrop?.width || !completedCrop?.height}
            className="btn save"
          >
            Save Crop
          </button>
          <button onClick={handleClose} className="btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Upload Component
export default function ProductImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsCropOpen(true);
    }
  };

  const handleCropComplete = (croppedImageData) => {
    setCroppedImage(croppedImageData);
  };

  const handleSubmit = () => {
    if (croppedImage) {
      console.log('Submitting cropped image:', croppedImage);
      // Handle the submission logic here
      alert('Image submitted successfully!');
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#222",
        }}
      >
        Upload Product Image
      </h2>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          background: "#f9f9f9",
        }}
      />

      {/* Show cropped image preview */}
      {croppedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#444",
            }}
          >
            Cropped Preview:
          </h3>
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ccc",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <img
              src={croppedImage.url}
              alt="Cropped"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#fff",
              background: "#007bff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#0056b3")}
            onMouseOut={(e) => (e.target.style.background = "#007bff")}
          >
            Submit
          </button>
        </div>
      )}

      {/* CropImage Modal */}
      <CropImage
        imageFile={selectedFile}
        isOpen={isCropOpen}
        setIsOpen={setIsCropOpen}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}