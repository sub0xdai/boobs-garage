import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d8dee9] dark:bg-[#2e3440] transition-colors duration-200">
        <div className="text-2xl text-[#2e3440] dark:text-[#d8dee9] font-medium">
          Loading...
        </div>
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
