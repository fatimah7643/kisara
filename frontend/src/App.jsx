import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, GuestRoute } from "./components/RouteGuards";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import StoryDetail from "./pages/StoryDetail/StoryDetail";
import Reader from "./pages/Reader/Reader";
import Dashboard from "./pages/Dashboard/Dashboard";
import TopUp from "./pages/TopUp/TopUp";
import Checkout from "./pages/Checkout/Checkout";
import CreatorDashboard from "./pages/Creator/CreatorDashboard";
import CreatorEditor from "./pages/Creator/CreatorEditor";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

const creatorOnly = (page) => <ProtectedRoute roles={["creator"]}>{page}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/story/:slug" element={<StoryDetail />} />
            <Route path="/story/:slug/read/:chapter" element={<Reader />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/topup" element={<ProtectedRoute><TopUp /></ProtectedRoute>} />
            <Route path="/checkout/:orderId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/creator" element={creatorOnly(<CreatorDashboard />)} />
            <Route path="/creator/stories/new" element={creatorOnly(<CreatorEditor />)} />
            <Route path="/creator/stories/:id/edit" element={creatorOnly(<CreatorEditor />)} />
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