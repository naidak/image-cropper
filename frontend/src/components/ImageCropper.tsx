import 'react-image-crop/dist/ReactCrop.css';
import { Upload, message, Button, InputNumber, Select, Divider, Space } from "antd";
import { InboxOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

const { Dragger } = Upload;
const { Option } = Select;

const ImageCropper = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "px", x: 0, y: 0, width: 100, height: 100 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{ w: number; h: number } | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const onImageLoaded = (img: HTMLImageElement) => {
    imgRef.current = img;
    setCrop({ unit: "px", x: 0, y: 0, width: img.width, height: img.height });
  };

  const onCropChange = (newCrop: Crop) => {
    if (!imgRef.current) return;
    const imgWidth = imgRef.current.width;
    const imgHeight = imgRef.current.height;

    const x = Math.max(0, Math.min(newCrop.x ?? 0, imgWidth));
    const y = Math.max(0, Math.min(newCrop.y ?? 0, imgHeight));
    const width = Math.min(newCrop.width ?? 0, imgWidth - x);
    const height = Math.min(newCrop.height ?? 0, imgHeight - y);

    setCrop({ ...newCrop, x, y, width, height });
  };

  const buildCropPayload = () => {
    if (!image || !imgRef.current || !crop.width || !crop.height) return null;
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
    const res = await fetch(`${API_BASE}/api/image/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return console.error("Preview failed:", res.status, await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      setPreviewSize({ w: img.width, h: img.height });
      setPreviewUrl(url);
    };
    img.src = url;
  };

  const handleGenerate = async () => {
    const body = buildCropPayload();
    if (!body) return;
    const res = await fetch(`${API_BASE}/api/image/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return console.error("Generate failed:", res.status, await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cropped.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAspectChange = (value: string) => {
    if (!imgRef.current) return;
    const imgHeight = imgRef.current.height;

    switch (value) {
      case "1:1":
        const size = Math.min(crop.width, crop.height);
        setCrop({ ...crop, width: size, height: size });
        break;
      case "16:9":
        setCrop({ ...crop, height: Math.min(Math.round(crop.width * 9 / 16), imgHeight) });
        break;
      case "4:3":
        setCrop({ ...crop, height: Math.min(Math.round(crop.width * 3 / 4), imgHeight) });
        break;
      default:
        break; // free
    }
  };

  return (
    <div style={{ position: "relative", paddingLeft: image ? 260 : 0 }}>
      {/* Sidebar */}
      {image && sidebarVisible && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 240,
            height: "100%",
            padding: 16,
            borderRight: "1px solid #ddd",
            background: "#fafafa",
            zIndex: 10,
          }}
        >
          <h3>Crop Settings</h3>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <label>Aspect Ratio</label>
            <Select defaultValue="free" style={{ width: "100%" }} onChange={handleAspectChange}>
              <Option value="free">Free</Option>
              <Option value="1:1">1:1</Option>
              <Option value="16:9">16:9</Option>
              <Option value="4:3">4:3</Option>
            </Select>
          </div>

          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <label>X</label>
              <InputNumber
                min={0}
                max={imgRef.current?.width ? imgRef.current.width - crop.width : undefined}
                value={crop.x}
                onChange={(v) =>
                  setCrop((c) => ({
                    ...c,
                    x: Math.min(v || 0, (imgRef.current?.width || 0) - c.width),
                  }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Y</label>
              <InputNumber
                min={0}
                max={imgRef.current?.height ? imgRef.current.height - crop.height : undefined}
                value={crop.y}
                onChange={(v) =>
                  setCrop((c) => ({
                    ...c,
                    y: Math.min(v || 0, (imgRef.current?.height || 0) - c.height),
                  }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Width</label>
              <InputNumber
                min={1}
                max={imgRef.current?.width || undefined}
                value={crop.width}
                onChange={(v) =>
                  setCrop((c) => ({
                    ...c,
                    width: Math.min(v || 1, imgRef.current?.width || v || 1),
                  }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label>Height</label>
              <InputNumber
                min={1}
                max={imgRef.current?.height || undefined}
                value={crop.height}
                onChange={(v) =>
                  setCrop((c) => ({
                    ...c,
                    height: Math.min(v || 1, imgRef.current?.height || v || 1),
                  }))
                }
                style={{ width: "100%" }}
              />
            </div>
          </Space>
        </div>
      )}

      {/* Toggle Sidebar Button */}
      {image && (
        <Button
          type="default"
          style={{ position: "absolute", left: sidebarVisible ? 250 : 0, top: 16, zIndex: 20 }}
          onClick={() => setSidebarVisible(!sidebarVisible)}
          icon={sidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
      )}

      {/* Main Content */}
      <div style={{ textAlign: "center", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ marginBottom: 8 }}>
          Upload a PNG image to crop. Adjust the crop area and use the sidebar for precise values and aspect ratios.
        </p>
        <Dragger
          accept="image/png"
          beforeUpload={(file) => {
            if (file.type !== "image/png") {
              message.error(`${file.name} is not a PNG file`);
              return Upload.LIST_IGNORE;
            }
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
            return false;
          }}
          showUploadList={false}
          style={{ maxWidth: 1150, marginBottom: 16 }}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag PNG image here to upload</p>
          <p className="ant-upload-hint">Only PNG files are accepted</p>
        </Dragger>

        {image && (
          <ReactCrop crop={crop} onChange={onCropChange} keepSelection>
            <img src={image} onLoad={(e) => onImageLoaded(e.currentTarget)} />
          </ReactCrop>
        )}

        {image && (
          <div style={{ marginTop: 12 }}>
            <Button onClick={handlePreview} style={{ marginRight: 8 }}>Preview</Button>
            <Button onClick={handleGenerate} type="primary">Generate</Button>
          </div>
        )}

        {previewUrl && previewSize && (
          <img src={previewUrl} alt="Preview" width={previewSize.w} height={previewSize.h} style={{ marginTop: 16 }} />
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
