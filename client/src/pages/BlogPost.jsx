import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/fetchWithAuth';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/blog/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/blog')}
        className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        ← Back to Blog
      </button>
      
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {post.image_url && (
          <div className="w-full h-96 relative">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onClick={() => window.open(post.image_url, '_blank')}
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Posted by {post.author_name || 'Admin'} on {new Date(post.created_at).toLocaleDateString()}
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-600 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export default BlogPost;
