import React, { useState, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

type ShapeType = "triangle" | "rectangle" | "pentagon";

const shapePointsCount: Record<ShapeType, number> = {
  triangle: 3,
  rectangle: 2,  // we use 2 points to generate rectangle
  pentagon: 5,
};

const PreviewForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeType>("triangle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPoints([]);
      setPreviewUrl(null);
    }
  };

  const handleShapeSelect = (shape: ShapeType) => {
    setSelectedShape(shape);
    setPoints([]);
    setPreviewUrl(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * imgRef.current.naturalWidth;
    const y = ((e.clientY - rect.top) / rect.height) * imgRef.current.naturalHeight;

    let newPoints = [...points, { x, y }];

    // For rectangle, auto-generate 4 points from 2 clicks
    if (selectedShape === "rectangle" && newPoints.length === 2) {
      const [p1, p2] = newPoints;
      newPoints = [
        p1,
        { x: p2.x, y: p1.y },
        p2,
        { x: p1.x, y: p2.y },
      ];
    }

    // Limit points to shape max
    if (newPoints.length > shapePointsCount[selectedShape]) return;

    setPoints(newPoints);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }
    if (points.length < 3) {
      alert("Please select at least 3 points for polygon");
      return;
    }

    const formData = new FormData();
    formData.append("Image", file);
    formData.append("CropCoordinates", new Blob([JSON.stringify(points)], { type: "application/json" }));

    try {
      const res = await fetch("http://localhost:7052/api/image/preview", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }

      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Backend error:", err);
      alert("Error: " + err);
    }
  };

  // Draw polygon overlay
  const getSvgPoints = () => {
    if (!imgRef.current) return "";
    const scaleX = 500 / imgRef.current.naturalWidth;
    const scaleY = 500 / imgRef.current.naturalHeight;
    return points.map(p => `${p.x * scaleX},${p.y * scaleY}`).join(" ");
  };

  return (
    <div>
      <h2>Image Crop Preview</h2>

      <input type="file" accept="image/png" onChange={handleFileChange} />

      <div style={{ margin: "10px 0" }}>
        <button onClick={() => handleShapeSelect("triangle")}>Triangle</button>
        <button onClick={() => handleShapeSelect("rectangle")}>Rectangle</button>
        <button onClick={() => handleShapeSelect("pentagon")}>Pentagon</button>
      </div>

      {file && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            ref={imgRef}
            src={URL.createObjectURL(file)}
            onClick={handleImageClick}
            alt="To crop"
            style={{ maxWidth: "500px", display: "block" }}
          />
          <svg
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            width={500}
            height={500}
          >
            {points.length > 0 && (
              <polygon points={getSvgPoints()} fill="rgba(255,0,0,0.3)" stroke="red" strokeWidth={2} />
            )}
          </svg>
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>Generate Preview</button>
      </div>

      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "500px" }} />
        </div>
      )}
    </div>
  );
};

export default PreviewForm;
