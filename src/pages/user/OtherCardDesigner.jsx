import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";

// Utility: load image into canvas
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // set canvas size to final crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // translate to center to rotate around the center (if rotation used)
  ctx.save();
  ctx.translate(-pixelCrop.x, -pixelCrop.y);

  // draw the image
  ctx.drawImage(image, 0, 0);
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const fileUrl = URL.createObjectURL(blob);
      resolve({ blob, url: fileUrl, dataUrl: canvas.toDataURL("image/png") });
    }, "image/png");
  });
}

export default function OtherCardDesigner() {
  // Responsive: stack panels on small widths
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Images
  const [images, setImages] = useState([]); // [{id, src, name}]
  const [activeImgId, setActiveImgId] = useState(null);

  // Text overlays
  const [texts, setTexts] = useState([]); // [{id, text, x, y, fontSize, color, weight, style, align}]
  const [activeTextId, setActiveTextId] = useState(null);

  // Crop state
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const previewRef = useRef(null);
  const draggingRef = useRef({ id: null, offsetX: 0, offsetY: 0 });

  const activeImage = useMemo(
    () => images.find((i) => i.id === activeImgId) || null,
    [images, activeImgId]
  );

  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImgs = await Promise.all(
      files.map(
        (f) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ id: crypto.randomUUID(), src: reader.result, name: f.name });
            reader.readAsDataURL(f);
          })
      )
    );

    const merged = [...images, ...newImgs];
    setImages(merged);
    if (!activeImgId && newImgs[0]) setActiveImgId(newImgs[0].id);
    e.target.value = ""; // reset input
  };

  const handleRemoveImage = (id) => {
    const idx = images.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const updated = images.filter((i) => i.id !== id);
    setImages(updated);
    if (activeImgId === id) {
      setActiveImgId(updated[0]?.id || null);
    }
  };

  // Text handling
  const addText = () => {
    const newText = {
      id: crypto.randomUUID(),
      text: "Double-click to edit",
      x: 40,
      y: 40,
      fontSize: 22,
      color: "#111111",
      weight: "400",
      style: "normal",
      align: "left",
    };
    setTexts((t) => [...t, newText]);
    setActiveTextId(newText.id);
  };

  const removeActiveText = () => {
    if (!activeTextId) return;
    setTexts((t) => t.filter((x) => x.id !== activeTextId));
    setActiveTextId(null);
  };

  const updateActiveText = (patch) => {
    setTexts((prev) => prev.map((t) => (t.id === activeTextId ? { ...t, ...patch } : t)));
  };

  // Drag logic (mouse + touch)
  const onTextMouseDown = (e, id) => {
    e.stopPropagation();
    const rect = previewRef.current.getBoundingClientRect();
    const textObj = texts.find((t) => t.id === id);
    const offsetX = e.clientX - (rect.left + textObj.x);
    const offsetY = e.clientY - (rect.top + textObj.y);
    draggingRef.current = { id, offsetX, offsetY };
    setActiveTextId(id);
  };

  const onTextTouchStart = (e, id) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = previewRef.current.getBoundingClientRect();
    const textObj = texts.find((t) => t.id === id);
    const offsetX = touch.clientX - (rect.left + textObj.x);
    const offsetY = touch.clientY - (rect.top + textObj.y);
    draggingRef.current = { id, offsetX, offsetY };
    setActiveTextId(id);
  };

  useEffect(() => {
    const onMove = (clientX, clientY) => {
      const drag = draggingRef.current;
      if (!drag.id || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(0, clientX - rect.left - drag.offsetX), rect.width - 5);
      const y = Math.min(Math.max(0, clientY - rect.top - drag.offsetY), rect.height - 5);
      setTexts((prev) => prev.map((t) => (t.id === drag.id ? { ...t, x, y } : t)));
    };

    const onMouseMove = (e) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const onUp = () => (draggingRef.current = { id: null, offsetX: 0, offsetY: 0 });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [texts]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const applyCrop = async () => {
    if (!activeImage || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(activeImage.src, croppedAreaPixels);
    setImages((prev) => prev.map((im) => (im.id === activeImgId ? { ...im, src: cropped.dataUrl } : im)));
    setCropOpen(false);
  };

  // Export composed design to PNG
  const downloadPNG = () => {
    if (!activeImage || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(rect.width * 2);
    canvas.height = Math.floor(rect.height * 2);
    const ctx = canvas.getContext("2d");

    // Draw base image
    const base = new Image();
    base.onload = () => {
      // Fit base image to preview area (cover)
      const scale = Math.max(canvas.width / base.width, canvas.height / base.height);
      const x = (canvas.width / 2) - (base.width * scale) / 2;
      const y = (canvas.height / 2) - (base.height * scale) / 2;
      ctx.drawImage(base, x, y, base.width * scale, base.height * scale);

      // Draw texts
      texts.forEach((t) => {
        ctx.save();
        ctx.font = `${t.weight} ${Math.round(t.fontSize * 2)}px system-ui, -apple-system, Segoe UI, Roboto`;
        ctx.fillStyle = t.color;
        ctx.textAlign = t.align;
        // Convert preview coords -> canvas coords (2x scale)
        const tx = t.x * 2 + (t.align === "center" ? 0 : t.align === "right" ? 0 : 0);
        const ty = t.y * 2 + t.fontSize * 2; // baseline adjustment
        ctx.fillText(t.text, tx, ty);
        ctx.restore();
      });

      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "design.png";
        link.click();
      });
    };
    base.src = activeImage.src;
  };

  const activeText = texts.find((t) => t.id === activeTextId) || null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>Normal Designer (Crop + Edit Text)</header>

      <div style={{ ...styles.main, flexDirection: isNarrow ? "column" : "row" }}>
        {/* Left: Tools */}
        <div style={{ ...styles.sidebar, width: isNarrow ? "100%" : 300 }}>
          <div style={styles.block}>
            <div style={styles.blockTitle}>1) Images</div>
            <label style={styles.button}>
              + Add Images
              <input type="file" accept="image/*" multiple onChange={handleAddImages} style={{ display: "none" }} />
            </label>

            {images.length === 0 ? (
              <div style={styles.empty}>No images added yet.</div>
            ) : (
              <div style={styles.thumbRow}>
                {images.map((im) => (
                  <div key={im.id} style={{ ...styles.thumb, borderColor: im.id === activeImgId ? "#2563eb" : "#ddd" }}>
                    <img
                      src={im.src}
                      alt={im.name}
                      style={styles.thumbImg}
                      onClick={() => setActiveImgId(im.id)}
                    />
                    <button style={styles.smallDanger} onClick={() => handleRemoveImage(im.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button style={styles.secondary} onClick={() => setCropOpen(true)} disabled={!activeImage}>
                Crop Active Image
              </button>
              <button style={styles.secondary} onClick={downloadPNG} disabled={!activeImage}>
                Download PNG
              </button>
            </div>
          </div>

          <div style={styles.block}>
            <div style={styles.blockTitle}>2) Text</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.button} onClick={addText} disabled={!activeImage}>+ Add Text</button>
              <button style={styles.danger} onClick={removeActiveText} disabled={!activeText}>Remove Selected</button>
            </div>

            <div style={{ marginTop: 10 }}>
              {activeText ? (
                <>
                  <div style={styles.row}>Selected Text ID: <code>{activeTextId.slice(0, 6)}</code></div>
                  <div style={styles.row}>
                    <input
                      type="text"
                      value={activeText.text}
                      onChange={(e) => updateActiveText({ text: e.target.value })}
                      placeholder="Enter text"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.row}>
                    <label style={styles.label}>Font Size</label>
                    <input
                      type="range"
                      min={10}
                      max={96}
                      value={activeText.fontSize}
                      onChange={(e) => updateActiveText({ fontSize: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Color</label>
                      <input
                        type="color"
                        value={activeText.color}
                        onChange={(e) => updateActiveText({ color: e.target.value })}
                        style={{ width: "100%", height: 36, border: "1px solid #ddd", borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Weight</label>
                      <select
                        value={activeText.weight}
                        onChange={(e) => updateActiveText({ weight: e.target.value })}
                        style={styles.select}
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="600">Semi-bold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Style</label>
                      <select
                        value={activeText.style}
                        onChange={(e) => updateActiveText({ style: e.target.value })}
                        style={styles.select}
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.row}>
                    <label style={styles.label}>Align</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["left", "center", "right"]).map((a) => (
                        <button
                          key={a}
                          style={{ ...styles.chip, background: activeText.align === a ? "#2563eb" : "#f3f4f6", color: activeText.align === a ? "#fff" : "#111" }}
                          onClick={() => updateActiveText({ align: a })}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.empty}>Select a text layer to edit.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview/Design area */}
        <div style={{ ...styles.previewWrap, height: isNarrow ? 420 : 560 }}>
          <div ref={previewRef} style={styles.preview} onMouseDown={() => setActiveTextId(null)}>
            {activeImage ? (
              <img src={activeImage.src} alt="active" style={styles.previewImg} />
            ) : (
              <div style={styles.previewPlaceholder}>Add an image to start</div>
            )}

            {/* Text layers */}
            {texts.map((t) => (
              <div
                key={t.id}
                onMouseDown={(e) => onTextMouseDown(e, t.id)}
                onTouchStart={(e) => onTextTouchStart(e, t.id)}
                onDoubleClick={() => setActiveTextId(t.id)}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  cursor: "move",
                  userSelect: "none",
                  padding: "2px 4px",
                  outline: activeTextId === t.id ? "2px dashed #2563eb" : "none",
                  whiteSpace: "pre",
                  transform: t.align === "center" ? "translateX(-50%)" : t.align === "right" ? "translateX(-100%)" : "none",
                  fontSize: t.fontSize,
                  color: t.color,
                  fontWeight: t.weight,
                  fontStyle: t.style,
                  textAlign: t.align,
                  background: "rgba(255,255,255,0.0)",
                  borderRadius: 6,
                }}
              >
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {cropOpen && activeImage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.blockTitle}>Crop Image</div>
            <div style={{ position: "relative", width: "100%", height: 320, background: "#111" }}>
              <Cropper
                image={activeImage.src}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
              <label style={styles.label}>Zoom</label>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
              <button style={styles.secondary} onClick={() => setCropOpen(false)}>Cancel</button>
              <button style={styles.button} onClick={applyCrop}>Apply Crop</button>
            </div>
          </div>
        </div>
      )}

      <footer style={styles.footer}>Tip: drag text on the image. Use the left panel to tweak style.</footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#111827",
    background: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "14px 18px",
    fontSize: 18,
    fontWeight: 600,
    background: "white",
    borderBottom: "1px solid #e5e7eb",
  },
  main: {
    display: "flex",
    gap: 14,
    padding: 14,
    flex: 1,
    alignItems: "stretch",
  },
  sidebar: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  block: {
    border: "1px solid #f3f4f6",
    borderRadius: 10,
    padding: 10,
    background: "#fff",
  },
  blockTitle: { fontWeight: 600, marginBottom: 8 },
  button: {
    background: "#2563eb",
    color: "white",
    border: 0,
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  secondary: {
    background: "#111827",
    color: "#fff",
    border: 0,
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  danger: {
    background: "#ef4444",
    color: "white",
    border: 0,
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  smallDanger: {
    background: "#ef4444",
    color: "white",
    border: 0,
    padding: "4px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 6,
    width: "100%",
  },
  chip: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  },
  select: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    background: "white",
  },
  row: { marginTop: 8 },
  empty: {
    padding: 10,
    background: "#f9fafb",
    border: "1px dashed #e5e7eb",
    borderRadius: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  thumbRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: 10,
    marginTop: 10,
  },
  thumb: {
    border: "2px solid #ddd",
    borderRadius: 10,
    padding: 6,
    background: "#fff",
  },
  thumbImg: {
    width: "100%",
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
    cursor: "pointer",
  },
  previewWrap: {
    flex: 1,
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 10,
    minWidth: 260,
  },
  preview: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    background: "#e5e7eb",
  },
  previewImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    userSelect: "none",
    pointerEvents: "none",
  },
  previewPlaceholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 1000,
  },
  modal: {
    background: "white",
    width: "min(680px, 100%)",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #e5e7eb",
  },
  footer: {
    padding: 10,
    textAlign: "center",
    color: "#6b7280",
  },
};
