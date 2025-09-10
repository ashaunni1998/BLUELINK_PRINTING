import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

  // Handle Confirm Button
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
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-sm flex items-center justify-center z-110 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Crop Image (Square)
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 max-h-[calc(90vh-120px)] overflow-auto">
          <div className="flex flex-col items-center">
            {/* Crop Area */}
            <div className="mb-6 max-w-full p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={1}
                minWidth={50}
                minHeight={50}
                keepSelection
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </ReactCrop>
            </div>

            {/* Instructions */}
            <div className="mb-6 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Drag the corners to adjust your crop area. The image will be cropped to a perfect square.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleCropComplete}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Crop
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </button>
              
              <button
                onClick={handleClose}
                className="group relative px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-700 transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </button>
            </div>

            {/* Preview Section */}
            {completedCrop && (
              <div className="w-full hidden max-w-md bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-inner">
                <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </h3>
                <div className="flex justify-center">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="border-4 border-white rounded-lg shadow-lg max-w-xs mx-auto block bg-white"
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-sm"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  This is how your cropped image will look
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropImage;