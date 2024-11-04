// src/components/admin/ServicesManager.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

function ServicesManager() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setServices(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newService)
      })
      if (response.ok) {
        setNewService({ name: '', description: '', price: '' })
        fetchServices()
      }
    } catch (err) {
      setError('Failed to add service')
    }
  }

  const handleUpdateService = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(editingService)
      })
      if (response.ok) {
        setEditingService(null)
        fetchServices()
      }
    } catch (err) {
      setError('Failed to update service')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      {/* Add New Service Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Add New Service</h2>
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({...newService, price: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Service
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Current Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map(service => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingService?.id === service.id ? (
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          name: e.target.value
                        })}
                        className="border rounded p-1"
                      />
                    ) : (
                      service.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingService?.id === service.id ? (
                      <textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          description: e.target.value
                        })}
                        className="border rounded p-1"
                      />
                    ) : (
                      service.description
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingService?.id === service.id ? (
                      <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          price: e.target.value
                        })}
                        className="border rounded p-1"
                      />
                    ) : (
                      `$${service.price}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingService?.id === service.id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdateService(service.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingService(service)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ServicesManager
