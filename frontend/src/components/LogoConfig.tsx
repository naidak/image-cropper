import { useEffect, useState } from "react";
import { Form, InputNumber, Select, Button, Upload, message, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const LogoConfig = () => {
  const [form] = Form.useForm();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Load existing config on mount
  useEffect(() => {
    fetch("http://localhost:7052/api/Config/get-config")
      .then(res => {
        if (!res.ok) throw new Error("No config found");
        return res.json();
      })
      .then(data => {
        form.setFieldsValue({
          scaleDown: data.scaleDown,
          logoPosition: data.logoPosition
        });
        setLogoPreview(data.logoImage);
      })
      .catch(() => {});
  }, [form]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    return false; // spriječi automatski upload
  };

  const onFinish = async (values: any) => {
    if (!logoPreview) {
      message.error("Please upload a logo.");
      return;
    }

    const payload = {
      scaleDown: values.scaleDown,
      logoPosition: values.logoPosition,
      logoImage: logoPreview
    };

    const res = await fetch("http://localhost:7052/api/Config/save-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      message.success("Configuration saved successfully!");
    } else {
      const err = await res.text();
      message.error("Error: " + err);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Scale Down (max 0.25)" name="scaleDown" rules={[{ required: true }]}>
        <InputNumber min={0.01} max={0.25} step={0.01} />
      </Form.Item>

      <Form.Item label="Logo Position" name="logoPosition" rules={[{ required: true }]}>
        <Select>
          <Option value="top-left">Top Left</Option>
          <Option value="top-right">Top Right</Option>
          <Option value="bottom-left">Bottom Left</Option>
          <Option value="bottom-right">Bottom Right</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Upload Logo">
        <Upload beforeUpload={handleUpload} maxCount={1} accept="image/png">
          <Button icon={<UploadOutlined />}>Select Logo</Button>
        </Upload>
        {logoPreview && <Image src={logoPreview} alt="logo preview" width={100} style={{ marginTop: 10 }} />}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LogoConfig;
