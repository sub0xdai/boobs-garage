// src/pages/Blog.jsx
function Blog() {
  const blogPosts = [
    {
      title: "Basic Car Maintenance Tips",
      date: "March 15, 2024",
      author: "Bob Smith",
      excerpt: "Learn the essential maintenance tips to keep your car running smoothly...",
      image: "/api/placeholder/800/400",
      category: "Maintenance"
    },
    {
      title: "Signs You Need New Brakes",
      date: "March 10, 2024",
      author: "Mike Johnson",
      excerpt: "Understanding the warning signs that indicate your brakes need attention...",
      image: "/api/placeholder/800/400",
      category: "Safety"
    },
    // Add more blog posts as needed
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Auto Repair Blog</h1>
      
      {/* Featured Post */}
      <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src="/api/placeholder/1200/400" 
          alt="Featured post" 
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="text-sm text-blue-600 mb-2">Featured Post</div>
          <h2 className="text-2xl font-bold mb-2">Understanding Your Car's Service Schedule</h2>
          <p className="text-gray-600 mb-4">
            Regular maintenance is key to keeping your vehicle running smoothly and avoiding costly repairs...
          </p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">March 20, 2024 • By Bob Smith</div>
            <button className="text-blue-600 hover:text-blue-800">Read More →</button>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-blue-600 mb-2">{post.category}</div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{post.date} • By {post.author}</div>
                <button className="text-blue-600 hover:text-blue-800">Read More →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blog
