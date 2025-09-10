import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Rnd } from "react-rnd";

export default function MugDesigner() {
  const [elements, setElements] = useState([
    {
      id: "leftText",
      type: "text",
      content: "YOUR\nTEXT\nHERE",
      x: 30,
      y: 60,
      width: 120,
      height: 160
    },
    {
      id: "rightText",
      type: "text",
      content: "YOUR\nTEXT\nHERE",
      x: 680,
      y: 60,
      width: 120,
      height: 160
    }
  ]);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setElements((prev) => [
        ...prev.filter((el) => el.id !== "centerImage"),
        {
          id: "centerImage",
          type: "image",
          content: URL.createObjectURL(file),
          x: 300,
          y: 60,
          width: 200,
          height: 200
        }
      ]);
    }
  };

  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f3f3f3",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px" }}>
        Mug Designer
      </h1>

      {/* Designer Canvas */}
      <div
        style={{
          position: "relative",
          background: "white",
          border: "2px dashed #ccc",
          width: "90%",
          maxWidth: "860px",
          height: "40vw", // responsive height
          maxHeight: "320px",
          minHeight: "200px",
          overflow: "hidden"
        }}
      >
        {/* Safety / Bleed */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px dashed blue",
            pointerEvents: "none"
          }}
        />

        {/* Dynamic Elements */}
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            onDragStop={(e, d) =>
              updateElement(el.id, { x: d.x, y: d.y })
            }
            onResizeStop={(e, direction, ref, delta, position) =>
              updateElement(el.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position
              })
            }
            bounds="parent"
          >
            {el.type === "text" ? (
              <textarea
                value={el.content}
                onChange={(e) =>
                  updateElement(el.id, { content: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "18px",
                  fontFamily: "serif",
                  textAlign: "center",
                  resize: "none",
                  border: "1px solid #666",
                  padding: "5px",
                  boxSizing: "border-box"
                }}
              />
            ) : (
              <img
                src={el.content}
                alt="uploaded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  border: "1px solid #666"
                }}
              />
            )}
          </Rnd>
        ))}
      </div>

      {/* Upload Button */}
      <div style={{ marginTop: "16px" }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            background: "#eee",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        >
          <Upload style={{ width: "20px", height: "20px", marginRight: "6px" }} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Dimension Labels */}
      <div
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: "#444",
          textAlign: "center"
        }}
      >
        <p style={{ margin: 0 }}>Width: 21.5 cm | Height: 8 cm</p>
        <p style={{ margin: 0, color: "green" }}>Safety Area</p>
        <p style={{ margin: 0, color: "blue" }}>Bleed Area</p>
      </div>
    </div>
  );
}
