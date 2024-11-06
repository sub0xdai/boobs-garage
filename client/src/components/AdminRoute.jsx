// src/components/AdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-2xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    )
  }

  console.log('AdminRoute - Current user:', user)

  if (!user || !user.isAdmin) {
    console.log('Access denied - Not an admin')
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export default AdminRoute
