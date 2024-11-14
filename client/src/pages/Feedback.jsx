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
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        e.target.value = null
        return
      }
      setImage(file)
      
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
      <h1 className="text-3xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-8">
        Share Your Feedback
      </h1>

      {!user && (
        <div className="bg-[#ebcb8b]/20 dark:bg-[#ebcb8b]/10 border border-[#ebcb8b] 
                     text-[#2e3440] dark:text-[#ebcb8b] px-4 py-3 rounded mb-6 transition-colors duration-200">
          Please <button 
            onClick={() => navigate('/login')}
            className="text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] transition-colors duration-200"
          >
            login
          </button> to submit feedback with your account, or continue as a guest.
        </div>
      )}

      {error && (
        <div className="bg-[#bf616a]/20 dark:bg-[#bf616a]/10 border border-[#bf616a] 
                     text-[#bf616a] dark:text-[#bf616a] px-4 py-3 rounded mb-6 transition-colors duration-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-[#a3be8c]/20 dark:bg-[#a3be8c]/10 border border-[#a3be8c] 
                     text-[#a3be8c] dark:text-[#a3be8c] px-4 py-3 rounded mb-6 transition-colors duration-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
            Your Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
            className="w-full px-3 py-2 border rounded-md transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0] 
              bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a] 
              text-[#2e3440] dark:text-[#d8dee9] placeholder-[#4c566a] dark:placeholder-[#81a1c1]"
            placeholder="Tell us about your experience..."
            required
            minLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
            Attach Image (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-[#4c566a] dark:text-[#81a1c1]
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#8fbcbb]/10 file:text-[#8fbcbb]
                dark:file:bg-[#88c0d0]/10 dark:file:text-[#88c0d0]
                hover:file:bg-[#8fbcbb]/20 dark:hover:file:bg-[#88c0d0]/20
                transition-all duration-200"
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
                className="mt-1 text-sm text-[#bf616a] dark:text-[#bf616a] 
                        hover:text-[#d08770] dark:hover:text-[#d08770] transition-colors duration-200"
              >
                Remove image
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-[#4c566a] dark:text-[#81a1c1]">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#d08770] dark:bg-[#bf616a] text-white py-2 px-4 rounded-md 
                   hover:bg-[#c97a65] dark:hover:bg-[#a9545d] transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-md hover:shadow-lg active:scale-98"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}

export default Feedback
