// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || !user.isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
