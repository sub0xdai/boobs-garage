import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function BlogManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  })

  // useEffect:

useEffect(() => {
  let mounted = true;

  
const loadPosts = async () => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }

    try {
      console.log('Attempting to fetch posts...');
      const response = await api.get('/api/blog/posts');

      if (!mounted) return;

      const text = await response.text();
      console.log('Raw response text:', text);

      let data;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('JSON parse error:', e);
          throw new Error('Invalid JSON response');
        }
      }

      if (response.ok) {
        setPosts(data || []);
        setError(null);
      } else {
        throw new Error(data?.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (!mounted) return;
      
      if (err.message.includes('session') || err.message.includes('token')) {
        logout();
        navigate('/login');
      }
      setError('Error loading posts: ' + err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  };


  loadPosts();

  return () => {
    mounted = false;
  };
}, [user, navigate, logout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/blog/posts', formData);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create post');
      }

      const data = await response.json();
      setPosts(prev => [...prev, data]);
      setFormData({ title: '', content: '', image_url: '' });
      setError(null);
      setSuccessMessage('Blog post created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Create post error:', err);
      setError(`Error creating post: ${err.message}`);
      
      if (err.message.includes('session') || err.message.includes('token')) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/blog/posts/${editingPost.id}`, editingPost);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update post');
      }

      const data = await response.json();
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? data : post
      ));
      setEditingPost(null);
      setError(null);
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating post: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await api.delete(`/api/blog/posts/${postId}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete post');
      }

      setPosts(prev => prev.filter(post => post.id !== postId));
      setError(null);
      setSuccessMessage('Post deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting post: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading posts...</div>
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

      {/* Blog Post Form */}
      <form 
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={editingPost ? editingPost.content : formData.content}
              onChange={editingPost ? 
                (e) => setEditingPost({...editingPost, content: e.target.value}) : 
                handleInputChange
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={editingPost ? editingPost.image_url : formData.image_url}
              onChange={editingPost ? 
                (e) => setEditingPost({...editingPost, image_url: e.target.value}) : 
                handleInputChange
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null)
                  setFormData({ title: '', content: '', image_url: '' })
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editingPost ? 'Update Post' : 'Add Post'}
            </button>
          </div>
        </div>
      </form>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Blog Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No blog posts found.</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div 
                key={post.id}
                className="border-b dark:border-gray-700 pb-6 last:border-0 last:pb-0"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full max-h-48 object-cover rounded mb-4"
                  />
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Posted on {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 
                               dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 
                               dark:hover:text-red-300"
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

export default BlogManager
