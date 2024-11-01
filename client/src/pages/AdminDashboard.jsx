// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // If not admin, redirect
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setUsers(data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  const toggleAdminStatus = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (response.ok) {
        // Refresh user list
        const updatedUsers = users.map(u => {
          if (u.id === userId) {
            return { ...u, is_admin: !u.is_admin }
          }
          return u
        })
        setUsers(updatedUsers)
      }
    } catch (err) {
      setError('Failed to update admin status')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_admin ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAdminStatus(user.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Toggle Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
