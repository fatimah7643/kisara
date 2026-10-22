import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, GuestRoute } from "./components/RouteGuards";
import MainLayout from "./components/Layout/MainLayout";
import ComingSoon from "./components/ComingSoon";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import StoryDetail from "./pages/StoryDetail/StoryDetail";
import Reader from "./pages/Reader/Reader";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Halaman dengan Navbar + Footer bersama */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/story/:slug" element={<StoryDetail />} />
            <Route path="/story/:slug/read/:chapter" element={<Reader />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/topup" element={<ProtectedRoute><ComingSoon title="Top-Up Koin" step={5} /></ProtectedRoute>} />
            <Route
              path="/creator"
              element={
                <ProtectedRoute roles={["creator"]}>
                  <ComingSoon title="Creator Dashboard" step={6} />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;