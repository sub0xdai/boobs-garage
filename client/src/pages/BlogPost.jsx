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
    return <div className="text-center py-8 text-[#2e3440] dark:text-[#d8dee9]">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-[#bf616a] dark:text-[#bf616a]">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-8 text-[#2e3440] dark:text-[#d8dee9]">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/blog')}
        className="mb-6 text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] 
                  transition-colors duration-200"
      >
        ← Back to Blog
      </button>
      
      <article className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md overflow-hidden transition-colors duration-200">
        {post.image_url && (
          <div className="w-full h-96 relative">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              onClick={() => window.open(post.image_url, '_blank')}
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
            {post.title}
          </h1>
          
          <div className="mb-6 text-sm text-[#4c566a] dark:text-[#81a1c1]">
            Posted by {post.author_name || 'Admin'} on {new Date(post.created_at).toLocaleDateString()}
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-[#4c566a] dark:text-[#81a1c1]">
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
