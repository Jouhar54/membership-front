import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MemberDashboard from './pages/MemberDashboard'
import AdminDashboard from './pages/AdminDashboard'
import BatchAdmins from './pages/admin/BatchAdmins'
import MembersPage from './pages/MembersPage'
import BatchesPage from './pages/BatchesPage'
import ApprovalsPage from './pages/ApprovalsPage'
import PosterPage from './pages/PosterPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Public / Guest routes */}
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Member routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['member', 'admin', 'batch_admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/profile" element={<MemberDashboard />} />
        <Route path="/poster" element={<PosterPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'batch_admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/batch-admins" element={<BatchAdmins />} />
        <Route path="/admin/members" element={<MembersPage />} />
        <Route path="/admin/batches" element={<BatchesPage />} />
        <Route path="/admin/approvals" element={<ApprovalsPage />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
