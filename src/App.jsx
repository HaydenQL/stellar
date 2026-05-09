import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { StellarProvider } from '@/contexts/SettingsContext.jsx'
import { AppShell } from '@/components/layout/AppShell.jsx'
import LoginPage from '@/pages/LoginPage.jsx'
import SharePage from '@/pages/SharePage.jsx'
import Dashboard from '@/pages/Dashboard.jsx'
import MyClips from '@/pages/MyClips.jsx'
import Discover from '@/pages/Discover.jsx'
import ProfilePage from '@/pages/ProfilePage.jsx'
import CaptureSource from '@/pages/CaptureSource.jsx'
import Hotkeys from '@/pages/Hotkeys.jsx'
import AudioPage from '@/pages/AudioPage.jsx'
import Performance from '@/pages/Performance.jsx'
import SettingsPage from '@/pages/SettingsPage.jsx'
import OverlayHud from '@/pages/OverlayHud.jsx'

function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--shell-bg)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font)',
        fontSize: 15,
      }}>
        Loading Stellar…
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <StellarProvider>
      <Routes>
        <Route path="/overlay" element={<OverlayHud />} />
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="clips" element={<MyClips />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="capture" element={<CaptureSource />} />
          <Route path="hotkeys" element={<Hotkeys />} />
          <Route path="audio" element={<AudioPage />} />
          <Route path="performance" element={<Performance />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StellarProvider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public route — share page (no auth needed) */}
          <Route path="/share/:shareId" element={<SharePage />} />
          {/* Everything else goes through auth gate */}
          <Route path="/*" element={<AuthGate />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
