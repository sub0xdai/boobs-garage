// Import dependencies
import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function FeedbackManager() {
  // Initialize hooks and state
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0);

  // Load all feedback on component mount
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
    return () => { mounted = false };
  }, [user, navigate, logout]);

  // Check for unread feedback periodically
  useEffect(() => {
    if (!user?.isAdmin) return;

    const checkUnread = async () => {
      try {
        const response = await api.get('/api/feedback/unread');
        const data = await response.json();
        if (response.ok) setUnreadCount(data.length);
      } catch (error) {
        console.error('Error checking unread feedback:', error);
      }
    };

    const interval = setInterval(checkUnread, 30000);
    checkUnread();
    return () => clearInterval(interval);
  }, [user]);

  // Update feedback status
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/api/feedback/${id}/status`, { status });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error('Failed to update feedback status');
      }

      setFeedback(prev => prev.map(item => 
        item.id === id ? { ...item, status } : item
      ));
      setSuccessMessage('Feedback status updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error updating feedback status: ' + err.message);
    }
  };

  // Delete feedback
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await api.delete(`/api/feedback/${id}`);
       
      if (!response.ok) throw new Error('Failed to delete feedback');

      setFeedback(prev => prev.filter(item => item.id !== id));
      setSuccessMessage('Feedback deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error deleting feedback: ' + err.message);
    }
  };

  // Filter feedback based on status
  const filteredFeedback = feedback.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#2e3440] dark:text-[#d8dee9]">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {error && (
        <div className="bg-[#bf616a]/20 dark:bg-[#bf616a]/10 border border-[#bf616a] text-[#bf616a] px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-[#a3be8c]/20 dark:bg-[#a3be8c]/10 border border-[#a3be8c] text-[#a3be8c] px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Unread Notifications */}
      {unreadCount > 0 && (
        <div className="bg-[#5e81ac]/20 dark:bg-[#5e81ac]/10 border border-[#5e81ac] text-[#5e81ac] px-4 py-3 rounded">
          <strong className="font-bold">New Feedback!</strong>
          <span className="block sm:inline"> You have {unreadCount} pending feedback items.</span>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md transition-colors duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2e3440] dark:text-[#d8dee9]">Customer Feedback</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md transition-all duration-200
                       bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a] 
                       text-[#2e3440] dark:text-[#d8dee9] 
                       focus:outline-none focus:ring-1 focus:ring-[#88c0d0]"
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
          <div className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md text-center transition-colors duration-200">
            <p className="text-[#4c566a] dark:text-[#81a1c1]">No feedback found</p>
          </div>
        ) : (
          filteredFeedback.map(item => (
            <div key={item.id} className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-colors duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-[#2e3440] dark:text-[#d8dee9]">
                      {item.user?.username || 'Anonymous'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'reviewed' 
                        ? 'bg-[#a3be8c]/20 text-[#a3be8c]' 
                        : 'bg-[#ebcb8b]/20 text-[#ebcb8b]'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#4c566a] dark:text-[#81a1c1] mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'reviewed')}
                      className="px-4 py-2 bg-[#88c0d0] hover:bg-[#8fbcbb] text-white rounded 
                              transition-all duration-200 shadow-md hover:shadow-lg active:scale-98"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteFeedback(item.id)}
                    className="px-4 py-2 bg-[#bf616a] hover:bg-[#d08770] text-white rounded 
                              transition-all duration-200 shadow-md hover:shadow-lg active:scale-98"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-[#4c566a] dark:text-[#81a1c1]">{item.content}</p>
                {item.image_url && (
                   <div className="mt-4">
                     <img 
                      src={`http://localhost:5000${item.image_url}`}
                      alt="Feedback attachment" 
                      className="mt-4 max-h-48 w-auto object-cover rounded-lg shadow-md 
                              hover:opacity-90 transition-all duration-200 cursor-pointer"
                      onClick={() => window.open(`http://localhost:5000${item.image_url}`, '_blank')}
                   />
                   </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackManager;
