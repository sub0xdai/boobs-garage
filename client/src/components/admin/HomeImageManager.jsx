// client/src/components/admin/HomeImageManager.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/fetchWithAuth.js';

export default function HomeImageManager() {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCurrentImage();
  }, []);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

      {currentImage?.imageUrl && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Current Image
          </h3>
          <img 
            src={`http://localhost:5000${currentImage.imageUrl}`}
            alt="Current home page"
            className="w-full max-h-48 object-cover rounded mb-4 hover:opacity-90 
                      transition-opacity cursor-pointer"
            onClick={() => window.open(`http://localhost:5000${currentImage.imageUrl}`, '_blank')}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Update Home Page Image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image
            </label>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !imageFile}
              className={`px-4 py-2 text-white rounded 
                ${(loading || !imageFile) 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transition'}`}
            >
              {loading ? 'Uploading...' : 'Update Image'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
