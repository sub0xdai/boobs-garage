// src/components/admin/FeedbackManager.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

function FeedbackManager() {
 const { user } = useAuth()
 const [feedback, setFeedback] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 const [statusFilter, setStatusFilter] = useState('all') // all, pending, reviewed

 useEffect(() => {
   fetchFeedback()
 }, [])

 const fetchFeedback = async () => {
   try {
     const response = await fetch('http://localhost:5000/api/feedback', {
       headers: {
         'Authorization': `Bearer ${user.token}`
       }
     })
     const data = await response.json()
     if (response.ok) {
       setFeedback(data)
     } else {
       setError(data.message)
     }
   } catch (err) {
     setError('Failed to fetch feedback')
   } finally {
     setLoading(false)
   }
 }

 const handleUpdateStatus = async (id, status) => {
   try {
     const response = await fetch(`http://localhost:5000/api/feedback/${id}/status`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${user.token}`
       },
       body: JSON.stringify({ status })
     })
     if (response.ok) {
       fetchFeedback()
     }
   } catch (err) {
     setError('Failed to update feedback status')
   }
 }

 const handleDeleteFeedback = async (id) => {
   if (window.confirm('Are you sure you want to delete this feedback?')) {
     try {
       const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${user.token}`
         }
       })
       if (response.ok) {
         fetchFeedback()
       }
     } catch (err) {
       setError('Failed to delete feedback')
     }
   }
 }

 const filteredFeedback = feedback.filter(item => {
   if (statusFilter === 'all') return true
   return item.status === statusFilter
 })

 if (loading) return <div className="text-center">Loading...</div>
 if (error) return <div className="text-red-500 text-center">{error}</div>

 return (
   <div className="space-y-6">
     {/* Feedback Filter */}
     <div className="bg-white p-6 rounded-lg shadow">
       <div className="flex justify-between items-center">
         <h2 className="text-lg font-medium">Customer Feedback</h2>
         <div className="flex space-x-2">
           <select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="border rounded-md px-2 py-1"
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
       {filteredFeedback.map(item => (
         <div key={item.id} className="bg-white p-6 rounded-lg shadow">
           <div className="flex justify-between">
             <div className="flex space-x-4">
               <div>
                 <h3 className="font-medium">{item.user.username}</h3>
                 <p className="text-sm text-gray-500">
                   {new Date(item.created_at).toLocaleDateString()}
                 </p>
               </div>
               <span className={`px-2 py-1 text-xs rounded-full ${
                 item.status === 'reviewed' 
                   ? 'bg-green-100 text-green-800' 
                   : 'bg-yellow-100 text-yellow-800'
               }`}>
                 {item.status}
               </span>
             </div>
             <div className="space-x-2">
               {item.status === 'pending' && (
                 <button
                   onClick={() => handleUpdateStatus(item.id, 'reviewed')}
                   className="text-blue-600 hover:text-blue-900"
                 >
                   Mark as Reviewed
                 </button>
               )}
               <button
                 onClick={() => handleDeleteFeedback(item.id)}
                 className="text-red-600 hover:text-red-900"
               >
                 Delete
               </button>
             </div>
           </div>
           
           <div className="mt-4">
             <p className="text-gray-700">{item.content}</p>
             {item.image_url && (
               <img 
                 src={item.image_url} 
                 alt="Feedback attachment" 
                 className="mt-2 max-h-48 rounded object-cover"
               />
             )}
           </div>

           {/* Reply section could be added here */}
         </div>
       ))}

       {filteredFeedback.length === 0 && (
         <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
           No feedback found
         </div>
       )}
     </div>
   </div>
 )
}

export default FeedbackManager
