import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { VideoFeed } from "./pages/VideoFeed";
import { VideoDetail } from "./pages/VideoDetail";
import { ImageGallery } from "./pages/ImageGallery";
import { ImageDetail } from "./pages/ImageDetail";
import { ArticleFeed } from "./pages/ArticleFeed";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Upload } from "./pages/Upload";
import { OwnerBrandingSettings } from "./pages/OwnerBrandingSettings";
import { DashboardLayout } from "./pages/dashboard/DashboardLayout";
import { DashboardOverview } from "./pages/dashboard/DashboardOverview";
import { DashboardContent } from "./pages/dashboard/DashboardContent";
import { DashboardAnalytics } from "./pages/dashboard/DashboardAnalytics";
import { DashboardAudience } from "./pages/dashboard/DashboardAudience";
import { DashboardSettings } from "./pages/dashboard/DashboardSettings";
import { Pricing } from "./pages/Pricing";
import { Notifications } from "./pages/Notifications";
import { Messages } from "./pages/Messages";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { SuperAdminDashboard } from "./pages/admin/SuperAdminDashboard";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const CREATOR_DASHBOARD_ROLES = ["creator", "moderator", "admin", "super_admin", "owner"] as const;
const ADMIN_ROLES = ["moderator", "admin", "super_admin", "owner"] as const;
const SUPER_ADMIN_ROLES = ["super_admin", "owner"] as const;

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="u/:username" element={<Profile />} />
        <Route path="videos" element={<VideoFeed />} />
        <Route path="videos/:id" element={<VideoDetail />} />
        <Route path="images" element={<ImageGallery />} />
        <Route path="images/:id" element={<ImageDetail />} />
        <Route path="articles" element={<ArticleFeed />} />
        <Route path="articles/:id" element={<ArticleDetail />} />
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allow={[...CREATOR_DASHBOARD_ROLES]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="content" element={<DashboardContent />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="audience" element={<DashboardAudience />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
        <Route
          path="owner/branding"
          element={
            <ProtectedRoute allow={["owner"]}>
              <OwnerBrandingSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute allow={[...ADMIN_ROLES]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin"
          element={
            <ProtectedRoute allow={[...SUPER_ADMIN_ROLES]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
