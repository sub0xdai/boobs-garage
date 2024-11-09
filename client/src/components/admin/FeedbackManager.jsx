import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function FeedbackManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let mounted = true;

    const loadFeedback = async () => {
      if (!user?.isAdmin) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/feedback');
        const data = await response.json();
        
        if (!mounted) return;
        
        if (response.ok) {
          setFeedback(data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch feedback');
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Fetch error:', err);
        if (err.message.includes('session') || err.message.includes('token')) {
          logout();
          navigate('/login');
        }
        setError('Error loading feedback: ' + err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeedback();

    return () => {
      mounted = false;
    };
  }, [user, navigate, logout]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/api/feedback/${id}/status`, { status });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error(data.message || 'Failed to update feedback status');
      }

      setFeedback(prev => prev.map(item => 
        item.id === id ? { ...item, status } : item
      ));
      setError(null);
      setSuccessMessage('Feedback status updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating feedback status: ' + err.message);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await api.delete(`/api/feedback/${id}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete feedback');
      }

      setFeedback(prev => prev.filter(item => item.id !== id));
      setError(null);
      setSuccessMessage('Feedback deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting feedback: ' + err.message);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading feedback...</div>
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

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Feedback</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Feedback</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 dark:text-gray-400">No feedback found</p>
          </div>
        ) : (
          filteredFeedback.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.user?.username || 'Anonymous'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'reviewed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'reviewed')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteFeedback(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt="Feedback attachment" 
                    className="mt-4 max-h-48 w-full object-cover rounded"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackManager
