import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import StoryDetail from "./pages/StoryDetail/StoryDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<StoryDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;