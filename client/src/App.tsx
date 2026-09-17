import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScanProvider } from "@/contexts/ScanContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";

import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ScanPage } from "@/pages/ScanPage";
import { ScanResultPage } from "@/pages/ScanResultPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ScanProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/dashboard" element={<Shell><DashboardPage /></Shell>} />
              <Route path="/scan" element={<Shell><ScanPage /></Shell>} />
              <Route path="/scan/:id" element={<Shell><ScanResultPage /></Shell>} />
              <Route path="/history" element={<Shell><HistoryPage /></Shell>} />
              <Route path="/favorites" element={<Shell><FavoritesPage /></Shell>} />
              <Route path="/profile" element={<Shell><ProfilePage /></Shell>} />
              <Route path="/settings" element={<Shell><SettingsPage /></Shell>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ScanProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
