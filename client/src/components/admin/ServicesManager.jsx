// Import required dependencies
import { useState, useEffect } from 'react'
import { api } from '../../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ServicesManager() {
  // Initialize hooks and state
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

  // Fetch services on component mount
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
    return () => { mounted = false };
  }, [user, navigate, logout]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      if (value === '' || !isNaN(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  // Feature management functions
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

  // Service CRUD operations
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

      const response = await api.post('/api/services', serviceData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create service');
      }

      setServices(prev => [...prev, data]);
      setFormData({ name: '', description: '', price: '', features: [] });
      setSuccessMessage('Service created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(`Error creating service: ${error.message}`);
      if (error.message.includes('session')) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/services/${editingService.id}`, {
        ...formData,
        price: parseFloat(formData.price),
        features: JSON.stringify(formData.features)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setServices(prev => prev.map(service => 
        service.id === editingService.id ? data : service
      ));
      setEditingService(null);
      setFormData({ name: '', description: '', price: '', features: [] });
      setSuccessMessage('Service updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error updating service: ' + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await api.delete(`/api/services/${serviceId}`);
      if (!response.ok) throw new Error('Failed to delete service');

      setServices(prev => prev.filter(service => service.id !== serviceId));
      setSuccessMessage('Service deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error deleting service: ' + err.message);
    }
  };

  // Helper function to start editing a service
  const startEditing = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      features: service.features ? JSON.parse(service.features) : []
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#2e3440] dark:text-[#d8dee9]">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="bg-[#bf616a]/20 dark:bg-[#bf616a]/10 border border-[#bf616a] text-[#bf616a] px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-[#a3be8c]/20 dark:bg-[#a3be8c]/10 border border-[#a3be8c] text-[#a3be8c] px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Service Form */}
      <form
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        className="bg-[#e5e9f0] dark:bg-[#3b4252] p-4 sm:p-6 rounded-lg shadow-md transition-all duration-200"
      >
        <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>

        <div className="space-y-4">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md transition-colors duration-200
                     focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                     bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                     text-[#2e3440] dark:text-[#d8dee9]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md transition-colors duration-200
                     focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                     bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                     text-[#2e3440] dark:text-[#d8dee9]"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md transition-colors duration-200
                     focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                     bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                     text-[#2e3440] dark:text-[#d8dee9]"
              required
            />
          </div>

          {/* Features Section */}
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Service Features
            </label>
            <div className="space-y-2 mb-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-2 bg-[#eceff4] dark:bg-[#434c5e] p-2 rounded transition-colors duration-200"
                >
                  <span className="flex-1 text-[#2e3440] dark:text-[#d8dee9]">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-[#bf616a] hover:text-[#d08770] transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md transition-colors duration-200
                       focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                       bg-white dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a]
                       text-[#2e3440] dark:text-[#d8dee9]"
                placeholder="Enter a new feature"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-[#a3be8c] hover:bg-[#97b67c] text-white rounded transition-all duration-200"
              >
                Add Feature
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            {editingService && (
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setFormData({ name: '', description: '', price: '', features: [] });
                }}
                className="px-4 py-2 bg-[#4c566a] hover:bg-[#434c5e] text-white rounded transition-all duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#88c0d0] hover:bg-[#7eb4c4] text-white rounded transition-all duration-200"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </div>
      </form>

      {/* Services List */}
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md transition-colors duration-200">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Services</h2>
          {services.length === 0 ? (
            <p className="text-[#4c566a] dark:text-[#81a1c1]">No services found.</p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg border-[#d8dee9] dark:border-[#434c5e] 
                           hover:bg-[#eceff4] dark:hover:bg-[#434c5e] transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2e3440] dark:text-[#d8dee9]">{service.name}</h3>
                      <p className="text-[#4c566a] dark:text-[#81a1c1]">{service.description}</p>
                      <p className="text-[#8fbcbb] dark:text-[#88c0d0] font-medium">
                        ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                      </p>

                      {/* Display features */}
                      {service.features && JSON.parse(service.features).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-[#4c566a] dark:text-[#81a1c1]">Features:</p>
                          <ul className="list-disc list-inside text-sm text-[#4c566a] dark:text-[#81a1c1] pl-2">
                            {JSON.parse(service.features).map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
                      <button
                        onClick={() => startEditing(service)}
                        className="px-3 py-1 bg-[#8fbcbb] text-white rounded 
                                 hover:bg-[#88c0d0] transition-all duration-200
                                 shadow-md hover:shadow-lg active:scale-98"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-3 py-1 bg-[#bf616a] text-white rounded 
                                 hover:bg-[#d08770] transition-all duration-200
                                 shadow-md hover:shadow-lg active:scale-98"
                      >
                        Delete
                      </button>
                    </div>
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
