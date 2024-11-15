// Import dependencies
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/fetchWithAuth.js';

export default function HomeImageManager() {
  // Initialize state
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch current image on component mount
  useEffect(() => {
    fetchCurrentImage();
  }, []);

  // Get current homepage image
  const fetchCurrentImage = async () => {
    try {
      const response = await api.get('/api/home-image');
      if (response.ok) {
        const data = await response.json();
        setCurrentImage(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch current image');
    } finally {
      setLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        e.target.value = null;
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
      setError(null);
    }
  };

  // Handle image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/api/home-image', formData);

      if (response.ok) {
        setSuccessMessage('Home page image updated successfully!');
        setImageFile(null);
        setImagePreview(null);
        await fetchCurrentImage();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
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

      {/* Current Image Display */}
      {currentImage?.imageUrl && (
        <div className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-colors duration-200">
          <h3 className="text-lg font-medium text-[#2e3440] dark:text-[#d8dee9] mb-2">
            Current Image
          </h3>
          <img 
            src={`http://localhost:5000${currentImage.imageUrl}`}
            alt="Current home page"
            className="w-full max-h-48 object-cover rounded mb-4 hover:opacity-90 
                      transition-all duration-200 cursor-pointer"
            onClick={() => window.open(`http://localhost:5000${currentImage.imageUrl}`, '_blank')}
          />
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-colors duration-200">
        <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
          Update Home Page Image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-[#4c566a] dark:text-[#81a1c1]
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#88c0d0]/10 file:text-[#88c0d0]
                dark:file:bg-[#88c0d0]/10 dark:file:text-[#88c0d0]
                hover:file:bg-[#88c0d0]/20 dark:hover:file:bg-[#88c0d0]/20
                transition-all duration-200"
            />
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
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="mt-1 text-sm text-[#bf616a] hover:text-[#d08770] transition-colors duration-200"
                >
                  Remove image
                </button>
              </div>
            )}
            <p className="mt-1 text-sm text-[#4c566a] dark:text-[#81a1c1]">
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !imageFile}
              className={`px-4 py-2 text-white rounded transition-all duration-200
                ${(loading || !imageFile) 
                  ? 'bg-[#4c566a] cursor-not-allowed opacity-50' 
                  : 'bg-[#88c0d0] hover:bg-[#8fbcbb] shadow-md hover:shadow-lg active:scale-98'}`}
            >
              {loading ? 'Uploading...' : 'Update Image'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
