import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  ScissorOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ImageCropper from "./components/ImageCropper";
import LogoConfig from "./components/LogoConfig";

const { Header, Content, Footer } = Layout;

const App = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ color: "white", fontSize: 20, fontWeight: "bold", marginRight: 20 }}>
          ImageCropper
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1 }}
        >
          <Menu.Item key="/" icon={<ScissorOutlined />}>
            <Link to="/">Image Cropper</Link>
          </Menu.Item>
          <Menu.Item key="/config" icon={<SettingOutlined />}>
            <Link to="/config">Logo Configuration</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "24px 50px" }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 8, minHeight: 400 }}>
          <Routes>
            <Route path="/" element={<ImageCropper />} />
            <Route path="/config" element={<LogoConfig />} />
          </Routes>
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        ©{new Date().getFullYear()} ImageCropper 
      </Footer>
    </Layout>
  );
};

export default App;
