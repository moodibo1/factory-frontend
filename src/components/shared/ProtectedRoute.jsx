import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
