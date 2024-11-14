import { useState, useEffect } from 'react';
import { api } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = 'http://localhost:5000'

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
        console.log('Blog posts data (detailed):', JSON.stringify(data, null, 2));         
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
    return <div className="text-center py-8 text-[#2e3440] dark:text-[#d8dee9]">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-[#bf616a] dark:text-[#bf616a]">{error}</div>;
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-[#2e3440] dark:text-[#d8dee9]">Auto Repair Blog</h1>
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12 bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md overflow-hidden transition-colors duration-200">
          {featuredPost.image_url && (
            <img 
              src={`${SERVER_URL}${featuredPost.image_url}`} 
              alt={featuredPost.title} 
              className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
              onClick={() => window.open(`${SERVER_URL}${featuredPost.image_url}`, '_blank')}            
            />
          )}
          <div className="p-6">
            <div className="text-sm text-[#8fbcbb] dark:text-[#88c0d0] mb-2">Featured Post</div>
            <h2 className="text-2xl font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">
              {featuredPost.title}
            </h2>
            <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">
              {featuredPost.content.substring(0, 200)}...
            </p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-[#4c566a] dark:text-[#81a1c1]">
                {new Date(featuredPost.created_at).toLocaleDateString()} • By {featuredPost.author_name || 'Admin'}
              </div>
              <button 
                onClick={() => handleReadMore(featuredPost.id)}
                className="text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] transition-colors duration-200"
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
          <div key={post.id} className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md overflow-hidden transition-colors duration-200">
            {post.image_url && (
              <img 
                src={`${SERVER_URL}${post.image_url}`} 
                alt={post.title} 
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => window.open(`${SERVER_URL}${post.image_url}`, '_blank')}              
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">{post.title}</h2>
              <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">
                {post.content.substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-[#4c566a] dark:text-[#81a1c1]">
                  {new Date(post.created_at).toLocaleDateString()} • By {post.author_name || 'Admin'}
                </div>
                <button 
                  onClick={() => handleReadMore(post.id)}
                  className="text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] transition-colors duration-200"
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
