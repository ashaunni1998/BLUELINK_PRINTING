// src/pages/user/DesignSelector.jsx
import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
import { Menu, X, Type, Image as ImageIcon, Crop, Save } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function DesignSelector() {
  const [images, setImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("text"); // "text" or "images"

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [texts, setTexts] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar on mobile when resizing to desktop
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Upload images
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: uuidv4(),
        url: url,
        originalUrl: url,
        fileName: file.name,
        fileSize: file.size,
      };
    });
    setImages((prev) => [...prev, ...newImgs]);
    if (!selectedImg && newImgs.length > 0) {
      setSelectedImg(newImgs[0]);
    }
    // Close sidebar on mobile after upload
    if (windowWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Text controls
  const addText = () => {
    const id = uuidv4();
    setTexts([
      ...texts,
      { id, value: "YOUR TEXT HERE", x: 50, y: 50 },
    ]);
    setActiveTextId(id);
    // Close sidebar on mobile after adding text
    if (windowWidth < 768) {
      setShowSidebar(false);
    }
  };

  const updateText = (id, value) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  const deleteText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
    }
  };

  const handleDrag = (e, id) => {
    const rect = e.target.getBoundingClientRect();
    const parentRect = e.target.parentElement.getBoundingClientRect();
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: Math.max(0, Math.min(e.clientX - parentRect.left - rect.width / 2, parentRect.width - rect.width)),
              y: Math.max(0, Math.min(e.clientY - parentRect.top - rect.height / 2, parentRect.height - rect.height)),
            }
          : t
      )
    );
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper load
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
    });

  // Cropper apply
  const applyCrop = async () => {
    if (!selectedImg || !croppedAreaPixels) return;

    const image = await createImage(selectedImg.url);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setSelectedImg((prev) => ({ ...prev, url: croppedDataUrl, isCropped: true }));

    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 480;

  const styles = {
    container: { 
      backgroundColor: "#f9fafb", 
      minHeight: "100vh",
      position: "relative"
    },
    mobileHeader: {
      display: isMobile ? "flex" : "none",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      background: "#fff",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: "0",
      zIndex: 40
    },
    mobileMenuButton: {
      padding: "8px",
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    mainContent: { 
      display: "flex", 
      minHeight: isMobile ? "auto" : "calc(100vh - 140px)",
      flexDirection: isMobile ? "column" : "row"
    },
    leftPanel: {
      width: isMobile ? "100%" : "300px",
      background: "#fff",
      borderRight: isMobile ? "none" : "1px solid #e5e7eb",
      borderBottom: isMobile ? "1px solid #e5e7eb" : "none",
      padding: isMobile ? "15px" : "20px",
      overflowY: "auto",
      position: isMobile ? "fixed" : "static",
      top: isMobile ? "0" : "auto",
      left: isMobile ? (showSidebar ? "0" : "-100%") : "auto",
      height: isMobile ? "100vh" : "auto",
      zIndex: isMobile ? 50 : "auto",
      transition: isMobile ? "left 0.3s ease" : "none",
      boxShadow: isMobile && showSidebar ? "2px 0 10px rgba(0,0,0,0.1)" : "none"
    },
    sidebarHeader: {
      display: isMobile ? "flex" : "none",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "1px solid #e5e7eb"
    },
    closeButton: {
      padding: "6px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    },
    tabButtons: {
      display: isMobile ? "flex" : "none",
      gap: "8px",
      marginBottom: "15px"
    },
    tabButton: {
      flex: 1,
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      background: "#f9fafb",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px"
    },
    activeTab: {
      background: "#3b82f6",
      color: "white",
      borderColor: "#3b82f6"
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9",
      padding: isMobile ? "15px" : "20px",
      minHeight: isMobile ? "400px" : "auto"
    },
    canvas: {
      width: isMobile ? "100%" : "900px",
      maxWidth: "100%",
      height: isMobile ? "250px" : "350px",
      border: "2px dashed #3b82f6",
      borderRadius: "12px",
      background: "white",
      position: "relative",
      overflow: "hidden",
    },
    cropModal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60,
      padding: isMobile ? "20px" : "40px"
    },
    cropBox: {
      background: "white",
      padding: isMobile ? "15px" : "20px",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      width: "100%",
      maxWidth: isMobile ? "100%" : "700px",
      maxHeight: "90vh",
      overflow: "auto"
    },
    cropperContainer: {
      position: "relative",
      width: "100%",
      height: isMobile ? "250px" : "300px",
      minHeight: "200px"
    },
    btn: {
      padding: isMobile ? "8px 12px" : "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: isMobile ? "14px" : "16px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      justifyContent: "center"
    },
    actionButtons: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "10px" : "20px",
      margin: isMobile ? "15px 0" : "20px 0",
      padding: isMobile ? "0 15px" : "0",
      flexWrap: "wrap"
    },
    textInput: {
      width: "100%",
      marginBottom: "8px",
      padding: "8px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px"
    },
    activeTextInput: {
      border: "2px solid #3b82f6"
    },
    textItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px"
    },
    deleteButton: {
      padding: "4px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px"
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "1fr",
      gap: "8px",
      marginTop: "10px"
    },
    imageThumb: {
      width: "100%",
      aspectRatio: "1",
      objectFit: "cover",
      borderRadius: "6px",
      cursor: "pointer",
      border: "2px solid transparent"
    },
    selectedImageThumb: {
      border: "2px solid #3b82f6"
    },
    overlay: {
      display: isMobile && showSidebar ? "block" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.3)",
      zIndex: 45
    }
  };

const renderTextSection = () => (
  <div style={{ display: !isMobile || activeTab === "text" ? "block" : "none" }}>
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: isMobile ? "16px" : "18px",
        marginBottom: "15px",
      }}
    >
      <Type size={18} /> Text
    </h3>

    {texts.map((t) => (
      <div key={t.id} style={{ marginBottom: "12px" }}>
        {activeTextId === t.id ? (
          <CKEditor
            editor={ClassicEditor}
            config={{
              // licenseKey: "<YOUR_LICENSE_KEY>", // or 'GPL'
              // plugins: [Essentials, Paragraph, Bold, Italic],
               toolbar: ["undo", "redo", "|", "bold", "italic", "|"],
            }}
            data={t.value}
            onChange={(event, editor) => updateText(t.id, editor.getData())}
          />
        ) : (
          <div
            onClick={() => setActiveTextId(t.id)}
            style={{
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              background: "#f9fafb",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: t.value }} />
          </div>
        )}

        <button
          onClick={() => deleteText(t.id)}
          style={styles.deleteButton}
          title="Delete text"
        >
          <X size={12} />
        </button>
      </div>
    ))}

    <button
      style={{
        ...styles.btn,
        background: "#10b981",
        color: "white",
        width: "100%",
      }}
      onClick={addText}
    >
      <Type size={16} /> Add Text
    </button>
  </div>
);

  const renderImagesSection = () => (
    <div style={{ display: !isMobile || activeTab === "images" ? "block" : "none" }}>
      <h3 style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        fontSize: isMobile ? "16px" : "18px",
        marginBottom: "15px",
        marginTop: isMobile ? "0" : "20px"
      }}>
        <ImageIcon size={18} /> Images
      </h3>
      
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleUpload}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          marginBottom: "10px"
        }}
      />
      
      <div style={styles.imageGrid}>
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="thumbnail"
            onClick={() => {
              setSelectedImg(img);
              if (isMobile) setShowSidebar(false);
            }}
            style={{
              ...styles.imageThumb,
              ...(selectedImg?.id === img.id ? styles.selectedImageThumb : {})
            }}
          />
        ))}
      </div>
      
      {images.length === 0 && (
        <div style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "14px",
          padding: "20px",
          border: "2px dashed #d1d5db",
          borderRadius: "8px",
          marginTop: "10px"
        }}>
          No images uploaded yet
        </div>
      )}
    </div>
  );

  return (
    <div className="responsive-container">
      <div style={styles.container}>
        <Header />
        
        {/* Mobile Header */}
        <div style={styles.mobileHeader}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Design Editor</h2>
          <button
            style={styles.mobileMenuButton}
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu size={18} />
            Tools
          </button>
        </div>

        {/* Overlay for mobile sidebar */}
        <div 
          style={styles.overlay}
          onClick={() => setShowSidebar(false)}
        />

        <div style={styles.mainContent}>
          {/* Left Panel */}
          <div style={styles.leftPanel}>
            {/* Mobile sidebar header */}
            <div style={styles.sidebarHeader}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Design Tools</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowSidebar(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile tabs */}
            <div style={styles.tabButtons}>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === "text" ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab("text")}
              >
                <Type size={16} />
                Text
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === "images" ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab("images")}
              >
                <ImageIcon size={16} />
                Images
              </button>
            </div>

            {renderTextSection()}
            {renderImagesSection()}
          </div>

          {/* Right Panel - Canvas */}
          <div style={styles.rightPanel}>
            <div style={styles.canvas}>
              {selectedImg ? (
                <img 
                  src={selectedImg.url} 
                  alt="main" 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover" 
                  }} 
                />
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#6b7280",
                  fontSize: isMobile ? "14px" : "16px",
                  textAlign: "center",
                  padding: "20px"
                }}>
                  Upload an image to start designing
                </div>
              )}

              {texts.map((t) => (
  <div
    key={t.id}
    draggable
    onDragEnd={(e) => handleDrag(e, t.id)}
    onClick={() => setActiveTextId(t.id)}
    style={{
      position: "absolute",
      top: `${t.y}px`,
      left: `${t.x}px`,
      padding: "4px 8px",
      background: activeTextId === t.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.9)",
      border: activeTextId === t.id ? "2px dashed #3b82f6" : "1px solid #e5e7eb",
      borderRadius: "4px",
      fontSize: isMobile ? "12px" : "14px",
      cursor: "move",
      userSelect: "none",
      minWidth: "50px",
      textAlign: "center",
    }}
  >
    <div dangerouslySetInnerHTML={{ __html: t.value }} />
  </div>
))}

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button 
            style={{ 
              ...styles.btn, 
              background: "#f59e0b", 
              color: "white",
              flex: isMobile ? "1" : "none"
            }} 
            onClick={() => setIsCropping(true)}
            disabled={!selectedImg}
          >
            <Crop size={16} />
            Crop Image
          </button>
          <button 
            style={{ 
              ...styles.btn, 
              background: "#10b981", 
              color: "white",
              flex: isMobile ? "1" : "none"
            }} 
            onClick={() => alert("Design saved!")}
          >
            <Save size={16} />
            Save Design
          </button>
        </div>

        {/* Crop Modal */}
        {isCropping && selectedImg && (
          <div style={styles.cropModal}>
            <div style={styles.cropBox}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: isMobile ? "16px" : "18px" }}>
                Crop Image
              </h3>
              
              <div style={styles.cropperContainer}>
                <Cropper
                  image={selectedImg.url}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controls */}
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: "10px", 
                width: "100%",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <label style={{ fontSize: "14px", minWidth: "40px" }}>Zoom:</label>
                  <input 
                    type="range" 
                    min={1} 
                    max={3} 
                    step={0.1} 
                    value={zoom} 
                    onChange={(e) => setZoom(+e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <label style={{ fontSize: "14px", minWidth: "60px" }}>Rotation:</label>
                  <input 
                    type="range" 
                    min={0} 
                    max={360} 
                    step={1} 
                    value={rotation} 
                    onChange={(e) => setRotation(+e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                gap: "10px",
                flexDirection: isMobile ? "column" : "row",
                width: "100%"
              }}>
                <button 
                  style={{ 
                    ...styles.btn, 
                    background: "#10b981", 
                    color: "white",
                    flex: 1
                  }} 
                  onClick={applyCrop}
                >
                  Apply Crop
                </button>
                <button 
                  style={{ 
                    ...styles.btn, 
                    background: "#6b7280", 
                    color: "white",
                    flex: 1
                  }} 
                  onClick={() => setIsCropping(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}