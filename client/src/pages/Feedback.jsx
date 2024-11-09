// src/pages/Feedback.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/fetchWithAuth'

function Feedback() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        e.target.value = null
        return
      }
      setImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!feedback.trim()) {
      setError('Please enter your feedback')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const formData = new FormData()
      formData.append('content', feedback)
      if (image) {
        formData.append('image', image)
      }

      const response = await api.post('/api/feedback', formData)
      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setSuccessMessage('Thank you for your feedback!')
      setFeedback('')
      setImage(null)
      setImagePreview(null)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      console.error('Feedback submission error:', err)
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Share Your Feedback
      </h1>

      {!user && (
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-400 
                     dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 
                     px-4 py-3 rounded mb-6">
          Please <button 
            onClick={() => navigate('/login')}
            className="underline hover:text-yellow-800 dark:hover:text-yellow-100"
          >
            login
          </button> to submit feedback with your account, or continue as a guest.
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 
                     dark:border-red-700 text-red-700 dark:text-red-200 
                     px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/50 border border-green-400 
                     dark:border-green-700 text-green-700 dark:text-green-200 
                     px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
              focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 
              dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Tell us about your experience..."
            required
            minLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attach Image (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900/50 dark:file:text-blue-200
                hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
            />
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                }}
                className="mt-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 
                        dark:hover:text-red-300"
              >
                Remove image
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md 
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}

export default Feedback
