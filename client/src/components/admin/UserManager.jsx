import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function UserManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      if (!user?.isAdmin) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/auth/users');
        const data = await response.json();
        
        if (!mounted) return;
        
        if (response.ok) {
          setUsers(data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Fetch error:', err);
        if (err.message.includes('session') || err.message.includes('token')) {
          logout();
          navigate('/login');
        }
        setError('Error loading users: ' + err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [user, navigate, logout]);

  const toggleAdminStatus = async (userId) => {
    try {
      const response = await api.put(`/api/auth/users/${userId}/toggle-admin`);
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error(data.message || 'Failed to update user');
      }

      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, is_admin: !u.is_admin };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      setError(null);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.is_admin 
                            ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900'
                        }`}>
                          {u.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdminStatus(u.id)}
                          disabled={u.id === user.id}
                          className={`px-4 py-2 rounded ${
                            u.id === user.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 transition'
                          }`}
                        >
                          Toggle Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManager
