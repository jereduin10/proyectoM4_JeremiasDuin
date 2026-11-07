import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <p className="p-4">Cargando...</p>
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}