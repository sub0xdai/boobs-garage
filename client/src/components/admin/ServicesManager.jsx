import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ServicesManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: []
  })
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      if (!user?.isAdmin) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/services');
        const data = await response.json();
        
        if (!mounted) return;
        
        if (response.ok) {
          setServices(data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch services');
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Fetch error:', err);
        if (err.message.includes('session') || err.message.includes('token')) {
          logout();
          navigate('/login');
        }
        setError('Error loading services: ' + err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, [user, navigate, logout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price field
    if (name === 'price') {
      // Only accept valid numbers and empty string
      if (value === '' || !isNaN(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price);
    if (isNaN(price)) {
      setError('Please enter a valid number for price');
      return;
    }

    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: price,
        features: JSON.stringify(formData.features)
      };
      console.log('Creating service with data:', serviceData);

      const response = await api.post('/api/services', serviceData);
      console.log('Service creation response:', response);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to create service: Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create service');
      }

      setServices(prev => [...prev, data]);
      setFormData({ name: '', description: '', price: '', features: [] });
      setError(null);
      setSuccessMessage('Service created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Create service error:', error);
      setError(`Error creating service: ${error.message}`);
      
      if (error.message.includes('session') || error.message.includes('token')) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(`/api/services/${editingService.id}`, {
        ...formData,
        price: parseFloat(formData.price),
        features: JSON.stringify(formData.features)
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error(data.message || 'Failed to update service');
      }

      const data = await response.json();
      setServices(prev => prev.map(service => 
        service.id === editingService.id ? data : service
      ));
      setEditingService(null);
      setFormData({ name: '', description: '', price: '', features: [] });
      setError(null);
      setSuccessMessage('Service updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating service: ' + err.message);
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await api.delete(`/api/services/${serviceId}`);
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error(data.message || 'Failed to delete service');
      }

      setServices(prev => prev.filter(service => service.id !== serviceId));
      setError(null);
      setSuccessMessage('Service deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting service: ' + err.message);
    }
  }

  const startEditing = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      features: service.features ? JSON.parse(service.features) : []
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
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
              name="name"
              value={formData.name}
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
              min="0"
              required
            />
          </div>

          {/* Features Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Features
            </label>
            <div className="space-y-2 mb-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <span className="flex-1 text-gray-700 dark:text-gray-300">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 p-1"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a new feature"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Add Feature
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {editingService && (
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setFormData({ name: '', description: '', price: '', features: [] });
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
          {services.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No services found.</p>
          ) : (
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
                    {/* Display features */}
                    {service.features && JSON.parse(service.features).length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Features:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 pl-2">
                          {JSON.parse(service.features).map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ServicesManager;
