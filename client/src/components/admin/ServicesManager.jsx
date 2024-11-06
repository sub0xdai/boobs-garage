// src/components/admin/ServicesManager.jsx
import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'

function ServicesManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',           // Changed from title to name
    description: '',
    price: ''
  })

  // Fetch services
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services')
      const data = await response.json()
      console.log('Fetched services:', data)
      
      if (response.ok) {
        setServices(data)
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch services')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Error loading services: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  
const handleCreateService = async (e) => {
  e.preventDefault()
  try {
    // Log the form data being sent
    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price)
    }
    console.log('Creating service with data:', serviceData)

    const response = await api.post('/api/services', serviceData)
    
    // Check if response is ok before trying to parse
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server error:', errorText)
      throw new Error(errorText || 'Failed to create service')
    }

    const data = await response.json()
    console.log('Create service response:', data)

    setServices(prev => [...prev, data])
    setFormData({ name: '', description: '', price: '' })
    setError(null)
  } catch (err) {
    console.error('Create service error:', err)
    setError(`Error creating service: ${err.message}`)
  }
}

  const handleUpdateService = async (e) => {
    e.preventDefault()
    try {
      console.log('Updating service:', editingService.id, 'with data:', formData)
      const response = await api.put(`/api/services/${editingService.id}`, {
        ...formData,
        price: parseFloat(formData.price) // Ensure price is a number
      })
      const data = await response.json()
      console.log('Update service response:', data)

      if (response.ok) {
        setServices(prev => prev.map(service => 
          service.id === editingService.id ? data : service
        ))
        setEditingService(null)
        setFormData({ name: '', description: '', price: '' })
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to update service')
      }
    } catch (err) {
      console.error('Update error:', err)
      setError('Error updating service: ' + err.message)
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return

    try {
      console.log('Deleting service:', serviceId)
      const response = await api.delete(`/api/services/${serviceId}`)
      
      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== serviceId))
        setError(null)
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete service')
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError('Error deleting service: ' + err.message)
    }
  }

  const startEditing = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,         // Changed from title to name
      description: service.description,
      price: service.price.toString()
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Service Form */}
      <form 
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name
            </label>
            <input
              type="text"
              name="name"           // Changed from title to name
              value={formData.name} // Changed from title to name
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                       dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingService && (
              <button
                type="button"
                onClick={() => {
                  setEditingService(null)
                  setFormData({ name: '', description: '', price: '' })
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
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </div>
      </form>

      {/* Services List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Services</h2>
          <div className="space-y-4">
            {services.map(service => (
              <div 
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg
                         dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(service)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 
                             dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 
                             dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesManager
