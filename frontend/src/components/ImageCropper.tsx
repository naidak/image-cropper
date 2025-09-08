import 'react-image-crop/dist/ReactCrop.css';

import React, { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { Button } from "antd";

const ImageCropper = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px", x: 50, y: 50, width: 200, height: 200
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoaded = (img: HTMLImageElement) => {
    imgRef.current = img;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const buildCropPayload = () => {
    if (!image || !imgRef.current || !crop.width || !crop.height) return null;

    // scale from rendered to natural resolution
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    return {
      ImageBase64: image,
      Crop: {
        X: Math.round((crop.x ?? 0) * scaleX),
        Y: Math.round((crop.y ?? 0) * scaleY),
        Width: Math.round((crop.width ?? 0) * scaleX),
        Height: Math.round((crop.height ?? 0) * scaleY),
      },
    };
  };

  const handlePreview = async () => {
    const body = buildCropPayload();
    if (!body) return;

    const res = await fetch("http://localhost:7052/api/image/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Preview failed:", res.status, await res.text());
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url); // display preview
  };

 const handleGenerate = async () => {
  const body = buildCropPayload();
  if (!body) return;

  const res = await fetch("http://localhost:7052/api/image/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Generate failed:", res.status, await res.text());
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  // Create a link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "cropped.png"; // file name for download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url); // cleanup
};


  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {image && (
        <div style={{ width: 500, height: 400 }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            keepSelection
          >
            <img src={image} onLoad={(e) => onImageLoaded(e.currentTarget)} />
          </ReactCrop>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Button onClick={handlePreview} style={{ marginRight: 8 }}>
          Preview
        </Button>
        <Button onClick={handleGenerate} type="primary">
          Generate
        </Button>
      </div>

      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <h3>Preview (5% size)</h3>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
