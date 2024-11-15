// Import dependencies
import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function UserManager() {
  // Initialize hooks and state management
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Load users on component mount
  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      // Check admin access
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
        // Handle authentication errors
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
    return () => { mounted = false; };
  }, [user, navigate, logout]);

  // Toggle admin privileges for users
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

      // Update local state with new admin status
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, is_admin: !u.is_admin };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error updating user: ' + err.message);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#2e3440] dark:text-[#d8dee9]">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-[#bf616a]/20 dark:bg-[#bf616a]/10 border border-[#bf616a] text-[#bf616a] px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-[#a3be8c]/20 dark:bg-[#a3be8c]/10 border border-[#a3be8c] text-[#a3be8c] px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md transition-colors duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Users</h2>
          {users.length === 0 ? (
            <p className="text-[#4c566a] dark:text-[#81a1c1]">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#d8dee9] dark:divide-[#4c566a]">
                {/* Table Header */}
                <thead className="bg-[#eceff4] dark:bg-[#434c5e]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4c566a] dark:text-[#81a1c1] uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4c566a] dark:text-[#81a1c1] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4c566a] dark:text-[#81a1c1] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4c566a] dark:text-[#81a1c1] uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4c566a] dark:text-[#81a1c1] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-[#e5e9f0] dark:bg-[#3b4252] divide-y divide-[#d8dee9] dark:divide-[#4c566a]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[#eceff4] dark:hover:bg-[#434c5e] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-[#2e3440] dark:text-[#d8dee9]">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#2e3440] dark:text-[#d8dee9]">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.is_admin 
                            ? 'bg-[#a3be8c]/20 text-[#a3be8c]' 
                            : 'bg-[#81a1c1]/20 text-[#81a1c1]'
                        }`}>
                          {u.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#2e3440] dark:text-[#d8dee9]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdminStatus(u.id)}
                          disabled={u.id === user.id}
                          className={`px-4 py-2 rounded transition-all duration-200 ${
                            u.id === user.id
                              ? 'bg-[#4c566a] text-[#d8dee9] cursor-not-allowed opacity-50'
                              : 'bg-[#8fbcbb] text-white hover:bg-[#88c0d0] hover:shadow-md active:scale-98'
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
