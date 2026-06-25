import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StatusCheckPage from './pages/StatusCheckPage'
import StatusResultPage from './pages/StatusResultPage'
import AdminDashboard from './pages/AdminDashboard'
import BatchAdmins from './pages/admin/BatchAdmins'
import MembersPage from './pages/MembersPage'
import BatchesPage from './pages/BatchesPage'
import ApprovalsPage from './pages/ApprovalsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Admin/Batch Admin Login */}
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Public Membership Flow */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/status-check" element={<StatusCheckPage />} />
        <Route path="/status/:id" element={<StatusResultPage />} />
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
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
