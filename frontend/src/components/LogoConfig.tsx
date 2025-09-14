import * as React from "react";
import { useState, useEffect } from "react";
import { Button, Input, Select, Upload, message, Modal, Card, Form } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const LogoConfig: React.FC = () => {
  const [scaleDown, setScaleDown] = useState<number>(0.1);
  const [logoPosition, setLogoPosition] = useState<string>("bottom-right");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const API_BASE = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/Config/get-config`);
        if (res.ok) {
          const data = await res.json();
          setId(data.id);
          setScaleDown(data.scaleDown);
          setLogoPosition(data.logoPosition);
          setLogoImage(data.logoImage ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch config", err);
      }
    };
    fetchConfig();
  }, []);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async () => {
    if (!logoImage) {
      message.error("Please upload a logo first");
      return;
    }

    const payload = { scaleDown, logoPosition, logoImage };
    try {
      let res: Response;
      if (id !== null) {
        res = await fetch(`${API_BASE}/api/Config/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/Config/save-config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        message.success("Configuration saved successfully");
      } else {
        const errorText = await res.text();
        message.error(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error("Save failed", err);
      message.error("Failed to save configuration");
    }
  };

  const handleDeleteLogo = async () => {
    if (id === null) return;

    try {
      const res = await fetch(`${API_BASE}/api/Config/delete-logo/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLogoImage(null);
        message.success("Logo deleted successfully");
      } else {
        const errorText = await res.text();
        message.error(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error("Delete failed", err);
      message.error("Failed to delete logo");
    }
  };

  return (
    <Card title="Logo Configuration" bordered={false} style={{ maxWidth: 500, margin: "0 auto" }}>
      <Form layout="vertical">
        <Form.Item label="Scale Down (max 0.25)">
          <Input
            type="number"
            min={0}
            max={0.25}
            step={0.01}
            value={scaleDown}
            onChange={(e:any) => setScaleDown(parseFloat(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Logo Position">
          <Select
            value={logoPosition}
            onChange={setLogoPosition}
            style={{ width: "100%" }}
          >
            <Option value="top-left">Top Left</Option>
            <Option value="top-right">Top Right</Option>
            <Option value="bottom-left">Bottom Left</Option>
            <Option value="bottom-right">Bottom Right</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Logo Image">
          <Upload
            accept="image/png"
            beforeUpload={(file) => {
              if (file.type !== "image/png") {
                message.error("Only PNG files are allowed!");
                return Upload.LIST_IGNORE; // spriječava upload
              }
              return handleUpload(file);
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
          <br />
          {logoImage && (
            <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
              <img
                src={logoImage}
                alt="Logo Preview"
                style={{ maxWidth: 120, border: "1px solid #ddd", borderRadius: 4 }}
                onClick={() => setIsModalVisible(true)}
              />
              <DeleteOutlined
                onClick={handleDeleteLogo}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  fontSize: 15,
                  color: "blue",
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: 2,
                }}
              />
            </div>
          )}
        </Form.Item>


        <Form.Item>
          <Button type="primary" onClick={handleSave} block>
            {id ? "Update Config" : "Save Config"}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <img src={logoImage!} alt="Logo Large Preview" style={{ width: "100%" }} />
      </Modal>
    </Card>
  );
};

export default LogoConfig;
