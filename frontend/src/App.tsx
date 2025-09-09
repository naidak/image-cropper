import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ImageCropper from "./components/ImageCropper";
import LogoConfig from "./components/LogoConfig";

const App = () => {
  return (
    <Router>
      <div style={{ margin: 20 }}>
        <nav>
          <Link to="/" style={{ marginRight: 10 }}>Image Cropper</Link>
          <Link to="/config">Logo Configuration</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ImageCropper />} />
          <Route path="/config" element={<LogoConfig />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
