// src/components/admin/BlogManager.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

function BlogManager() {
 const { user } = useAuth()
 const [posts, setPosts] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 const [editingPost, setEditingPost] = useState(null)
 const [newPost, setNewPost] = useState({
   title: '',
   content: '',
   image_url: ''
 })

 useEffect(() => {
   fetchPosts()
 }, [])

 const fetchPosts = async () => {
   try {
     const response = await fetch('http://localhost:5000/api/blog', {
       headers: {
         'Authorization': `Bearer ${user.token}`
       }
     })
     const data = await response.json()
     if (response.ok) {
       setPosts(data)
     } else {
       setError(data.message)
     }
   } catch (err) {
     setError('Failed to fetch blog posts')
   } finally {
     setLoading(false)
   }
 }

 const handleAddPost = async (e) => {
   e.preventDefault()
   try {
     const response = await fetch('http://localhost:5000/api/blog', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${user.token}`
       },
       body: JSON.stringify(newPost)
     })
     if (response.ok) {
       setNewPost({ title: '', content: '', image_url: '' })
       fetchPosts()
     }
   } catch (err) {
     setError('Failed to add blog post')
   }
 }

 const handleUpdatePost = async (id) => {
   try {
     const response = await fetch(`http://localhost:5000/api/blog/${id}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${user.token}`
       },
       body: JSON.stringify(editingPost)
     })
     if (response.ok) {
       setEditingPost(null)
       fetchPosts()
     }
   } catch (err) {
     setError('Failed to update blog post')
   }
 }

 const handleDeletePost = async (id) => {
   if (window.confirm('Are you sure you want to delete this post?')) {
     try {
       const response = await fetch(`http://localhost:5000/api/blog/${id}`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${user.token}`
         }
       })
       if (response.ok) {
         fetchPosts()
       }
     } catch (err) {
       setError('Failed to delete blog post')
     }
   }
 }

 if (loading) return <div className="text-center">Loading...</div>
 if (error) return <div className="text-red-500 text-center">{error}</div>

 return (
   <div className="space-y-6">
     {/* Add New Blog Post Form */}
     <div className="bg-white p-6 rounded-lg shadow">
       <h2 className="text-lg font-medium mb-4">Add New Blog Post</h2>
       <form onSubmit={handleAddPost} className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Title
           </label>
           <input
             type="text"
             value={newPost.title}
             onChange={(e) => setNewPost({...newPost, title: e.target.value})}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Content
           </label>
           <textarea
             value={newPost.content}
             onChange={(e) => setNewPost({...newPost, content: e.target.value})}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
             rows="6"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Image URL
           </label>
           <input
             type="url"
             value={newPost.image_url}
             onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
             placeholder="https://example.com/image.jpg"
           />
         </div>
         <button
           type="submit"
           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           Add Post
         </button>
       </form>
     </div>

     {/* Blog Posts List */}
     <div className="bg-white p-6 rounded-lg shadow">
       <h2 className="text-lg font-medium mb-4">Current Blog Posts</h2>
       <div className="space-y-4">
         {posts.map(post => (
           <div key={post.id} className="border-b pb-4">
             {editingPost?.id === post.id ? (
               <div className="space-y-4">
                 <input
                   type="text"
                   value={editingPost.title}
                   onChange={(e) => setEditingPost({
                     ...editingPost,
                     title: e.target.value
                   })}
                   className="block w-full rounded-md border border-gray-300 p-2"
                 />
                 <textarea
                   value={editingPost.content}
                   onChange={(e) => setEditingPost({
                     ...editingPost,
                     content: e.target.value
                   })}
                   className="block w-full rounded-md border border-gray-300 p-2"
                   rows="4"
                 />
                 <input
                   type="url"
                   value={editingPost.image_url}
                   onChange={(e) => setEditingPost({
                     ...editingPost,
                     image_url: e.target.value
                   })}
                   className="block w-full rounded-md border border-gray-300 p-2"
                 />
                 <div className="space-x-2">
                   <button
                     onClick={() => handleUpdatePost(post.id)}
                     className="text-green-600 hover:text-green-900"
                   >
                     Save
                   </button>
                   <button
                     onClick={() => setEditingPost(null)}
                     className="text-red-600 hover:text-red-900"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             ) : (
               <div>
                 <h3 className="text-xl font-medium mb-2">{post.title}</h3>
                 {post.image_url && (
                   <img 
                     src={post.image_url} 
                     alt={post.title}
                     className="w-full max-h-48 object-cover rounded mb-2"
                   />
                 )}
                 <p className="text-gray-600 mb-2">{post.content}</p>
                 <div className="flex justify-between items-center text-sm text-gray-500">
                   <span>
                     Posted on {new Date(post.created_at).toLocaleDateString()}
                   </span>
                   <div className="space-x-2">
                     <button
                       onClick={() => setEditingPost(post)}
                       className="text-blue-600 hover:text-blue-900"
                     >
                       Edit
                     </button>
                     <button
                       onClick={() => handleDeletePost(post.id)}
                       className="text-red-600 hover:text-red-900"
                     >
                       Delete
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
   </div>
 )
}

export default BlogManager
