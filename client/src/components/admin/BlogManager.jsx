// Import dependencies
import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function BlogManager() {
  // Initialize hooks and state
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Load blog posts on component mount
  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      // Check admin access
      if (!user?.isAdmin) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/blog/posts');
        if (!mounted) return;

        const text = await response.text();
        let data = text ? JSON.parse(text) : null;

        if (response.ok) {
          setPosts(data || []);
          setError(null);
        } else {
          throw new Error(data?.message || 'Failed to fetch blog posts');
        }
      } catch (err) {
        if (!mounted) return;
        handleError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPosts();
    return () => { mounted = false };
  }, [user, navigate, logout]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Error handling utility
  const handleError = (err) => {
    console.error('Operation error:', err);
    if (err.message.includes('session') || err.message.includes('token')) {
      logout();
      navigate('/login');
    }
    setError(err.message);
  };

  // Create new blog post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);

      const response = await fetch('http://localhost:5000/api/blog/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
    
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create post');

      setPosts(prev => [...prev, data]);
      setFormData({ title: '', content: '' });
      setSuccessMessage('Blog post created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      handleError(err);
    }
  };

  // Update existing blog post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', editingPost.title);
      formDataToSend.append('content', editingPost.content);

      const response = await fetch(`http://localhost:5000/api/blog/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setPosts(prev => prev.map(post => post.id === editingPost.id ? data : post));
      setEditingPost(null);
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      handleError(err);
    }
  };

  // Delete blog post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setPosts(prev => prev.filter(post => post.id !== postId));
      setSuccessMessage('Post deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      handleError(err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#2e3440] dark:text-[#d8dee9]">Loading posts...</div>
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

      {/* Blog Post Form */}
      <form 
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-colors duration-200"
      >
        <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
          {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>
        
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editingPost ? editingPost.title : formData.title}
              onChange={editingPost ? 
                (e) => setEditingPost({...editingPost, title: e.target.value}) : 
                handleInputChange
              }
              className="w-full px-3 py-2 border rounded-md transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                       bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                       text-[#2e3440] dark:text-[#d8dee9]"
              required
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={editingPost ? editingPost.content : formData.content}
              onChange={editingPost ? 
                (e) => setEditingPost({...editingPost, content: e.target.value}) : 
                handleInputChange
              }
              className="w-full px-3 py-2 border rounded-md transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                       bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                       text-[#2e3440] dark:text-[#d8dee9]"
              rows="6"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null)
                  setFormData({ title: '', content: '' })
                }}
                className="px-4 py-2 bg-[#4c566a] hover:bg-[#434c5e] text-white rounded 
                        transition-all duration-200 shadow-md hover:shadow-lg active:scale-98"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#8fbcbb] hover:bg-[#88c0d0] text-white rounded 
                      transition-all duration-200 shadow-md hover:shadow-lg active:scale-98"
            >
              {editingPost ? 'Update Post' : 'Add Post'}
            </button>
          </div>
        </div>
      </form>

      {/* Posts List */}
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-colors duration-200">
        <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Blog Posts</h2>
        {posts.length === 0 ? (
          <p className="text-[#4c566a] dark:text-[#81a1c1]">No blog posts found.</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div 
                key={post.id}
                className="border-b border-[#d8dee9] dark:border-[#4c566a] pb-6 last:border-0 last:pb-0"
              >
                <h3 className="text-lg font-medium text-[#2e3440] dark:text-[#d8dee9] mb-2">
                  {post.title}
                </h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#4c566a] dark:text-[#81a1c1]">
                    Posted on {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="text-[#8fbcbb] hover:text-[#88c0d0] transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-[#bf616a] hover:text-[#d08770] transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogManager;
