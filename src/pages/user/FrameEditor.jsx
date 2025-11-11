import React, { useMemo, useRef, useState, useEffect } from "react";

/** Utility: load an image */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    // CORS-friendly if you host frames on your domain or with proper headers
    if (!src.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * FrameEditor
 * props:
 * - frameUrl: string (PNG with transparent hole)
 * - width: number (preview box width px)
 * - height: number (preview box height px)
 * - onChange: (dataUrl) => void  // fired on every "Save Crop"
 */
export default function FrameEditor({
  frameUrl,
  width = 360,
  height = 360,
  onChange,
}) {
  const [photo, setPhoto] = useState(null);          // user-upload image dataURL
  const [result, setResult] = useState(null);        // final composited result
  const [open, setOpen] = useState(false);           // crop modal open
  const [scale, setScale] = useState(1);
  const [offX, setOffX] = useState(0);               // -100..100 (% of box)
  const [offY, setOffY] = useState(0);

  // For dragging in modal
  const stageRef = useRef(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("Please choose an image");
    const r = new FileReader();
    r.onloadend = () => {
      setPhoto(r.result);
      setScale(1);
      setOffX(0);
      setOffY(0);
      setOpen(true);
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  /** Compose final result using frame PNG alpha as the exact mask */
  const compose = async () => {
    if (!photo || !frameUrl) return;
    const [u, frame] = await Promise.all([loadImage(photo), loadImage(frameUrl)]);

    const W = 1200, H = 1200; // high-quality export
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // Fit the frame into the square stage while preserving its aspect
    const fr = frame.width / frame.height;
    let fw, fh, fx, fy;
    if (fr >= 1) { fw = W; fh = W / fr; fx = 0; fy = (H - fh) / 2; }
    else { fh = H; fw = H * fr; fy = 0; fx = (W - fw) / 2; }

    // 1) draw user image based on pan/zoom
    const baseW = fw, baseH = fh;
    const dx = (offX / 100) * W;
    const dy = (offY / 100) * H;
    const drawW = baseW * scale;
    const drawH = baseH * scale;
    const ux = (W - drawW) / 2 + dx;
    const uy = (H - drawH) / 2 + dy;

    ctx.drawImage(u, ux, uy, drawW, drawH);

    // 2) build inverted alpha mask from frame image (so photo only shows inside the hole)
    const m = document.createElement("canvas");
    m.width = W; m.height = H;
    const mctx = m.getContext("2d");
    mctx.drawImage(frame, fx, fy, fw, fh);
    const imgData = mctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      // where frame is opaque, we HIDE photo (alpha 0). Where transparent → keep photo.
      data[i + 3] = 255 - a;
      data[i + 0] = 0; data[i + 1] = 0; data[i + 2] = 0;
    }
    mctx.putImageData(imgData, 0, 0);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(m, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // 3) draw frame on top
    ctx.drawImage(frame, fx, fy, fw, fh);

    const out = c.toDataURL("image/png", 0.92);
    setResult(out);
    onChange?.(out);
  };

  // modal drag handlers
  useEffect(() => {
    if (!open) return;
    const el = stageRef.current; if (!el) return;
    const down = (e) => { dragging.current = true; last.current = { x: e.clientX, y: e.clientY }; e.preventDefault(); };
    const move = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      setOffX(v => v + (dx / 560) * 100);
      setOffY(v => v + (dy / 560) * 100);
    };
    const up = () => (dragging.current = false);
    el.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [open]);

  const previewBox = { width, height, position: "relative", borderRadius: 16, overflow: "hidden", background: "#f8fafc" };

  const photoMaskStyle = useMemo(() => ({
    WebkitMaskImage: `url("${frameUrl}")`,
    maskImage: `url("${frameUrl}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  }), [frameUrl]);

  // live preview transform
  const t = useMemo(() => {
    const tx = (offX / 100) * width;
    const ty = (offY / 100) * height;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, [offX, offY, scale, width, height]);

  return (
    <div>
      {/* Preview Card */}
      <div style={previewBox}>
        {/* masked photo */}
        {result ? (
          <img src={result} alt="Result" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <>
            {/* raw preview before saving */}
            {photo && (
              <img
                src={photo}
                alt="preview"
                style={{
                  position: "absolute", inset: 0, margin: "auto",
                  transformOrigin: "center center",
                  transform: t,
                  ...photoMaskStyle,
                }}
              />
            )}
            {/* frame on top */}
            <img
              src={frameUrl}
              alt="frame"
              style={{ position: "absolute", inset: 0, objectFit: "contain", pointerEvents: "none" }}
            />
            {!photo && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#64748b" }}>
                Your photo preview will appear here
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <label style={{ display: "inline-block" }}>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <span style={{ padding: "10px 14px", borderRadius: 8, background: "#4f46e5", color: "#fff", cursor: "pointer" }}>
            Choose Photo
          </span>
        </label>
        {photo && (
          <button onClick={() => { setOpen(true); }} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Re-Crop
          </button>
        )}
      </div>

      {/* Crop Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex",
                      alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: 920, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            {/* header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: 12, borderBottom: "1px solid #e5e7eb" }}>
              <div />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setOpen(false)} style={{ padding: "8px 14px" }}>Cancel</button>
                <button onClick={async () => { await compose(); setOpen(false); }}
                        style={{ padding: "8px 14px", color: "#fff", background: "#2563eb", borderRadius: 6 }}>
                  Save Crop
                </button>
              </div>
            </div>

            {/* body */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px" }}>
              {/* stage */}
              <div style={{ padding: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div ref={stageRef}
                     style={{ width: 560, height: 560, position: "relative", background: "#0f172a",
                              borderRadius: 10, overflow: "hidden", cursor: "grab" }}>
                  {/* masked photo */}
                  {photo && (
                    <img
                      src={photo}
                      alt="preview"
                      style={{
                        position: "absolute", inset: 0, margin: "auto",
                        transformOrigin: "center center",
                        transform: `translate(${(offX/100)*560}px, ${(offY/100)*560}px) scale(${scale})`,
                        ...{
                          WebkitMaskImage: `url("${frameUrl}")`,
                          maskImage: `url("${frameUrl}")`,
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        },
                      }}
                    />
                  )}
                  {/* frame overlay */}
                  <img src={frameUrl} alt="frame"
                       style={{ position: "absolute", inset: 0, objectFit: "contain", pointerEvents: "none" }} />
                </div>
              </div>

              {/* controls */}
              <aside style={{ padding: 16, borderLeft: "1px solid #e5e7eb" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Zoom</label>
                  <input type="range" min={0.5} max={4} step={0.01}
                         value={scale} onChange={(e) => setScale(Number(e.target.value))}
                         style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>X position</label>
                  <input type="range" min={-120} max={120} step={0.5}
                         value={offX} onChange={(e) => setOffX(Number(e.target.value))}
                         style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Y position</label>
                  <input type="range" min={-120} max={120} step={0.5}
                         value={offY} onChange={(e) => setOffY(Number(e.target.value))}
                         style={{ width: "100%" }} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
