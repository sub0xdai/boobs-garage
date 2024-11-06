// src/utils/fetchWithAuth.js
const API_URL = 'http://localhost:5000'

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    console.log('Fetch request:', {
      url: `${API_URL}${endpoint}`,
      config
    })

    const response = await fetch(`${API_URL}${endpoint}`, config)
    console.log('Fetch response status:', response.status)

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Error response:', errorData)
      throw new Error(errorData || response.statusText)
    }

    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE'
  })
}

export default fetchWithAuth
