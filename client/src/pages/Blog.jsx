import { useState, useEffect } from 'react';
import { api } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/blog/posts');
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Get the most recent post for the featured section
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Auto Repair Blog</h1>
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {featuredPost.image_url && (
            <img 
              src={featuredPost.image_url} 
              alt={featuredPost.title} 
              className="w-full h-64 object-cover cursor-pointer"
              onClick={() => window.open(featuredPost.image_url, '_blank')}
            />
          )}
          <div className="p-6">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Featured Post</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {featuredPost.content.substring(0, 200)}...
            </p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(featuredPost.created_at).toLocaleDateString()} • By {featuredPost.author_name || 'Admin'}
              </div>
              <button 
                onClick={() => handleReadMore(featuredPost.id)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {remainingPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => window.open(post.image_url, '_blank')}
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.content.substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()} • By {post.author_name || 'Admin'}
                </div>
                <button 
                  onClick={() => handleReadMore(post.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
