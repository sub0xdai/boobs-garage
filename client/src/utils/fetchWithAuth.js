// src/utils/fetchWithAuth.js
const API_URL = 'http://localhost:5000'

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  console.log('Using token:', token ? 'Present' : 'None')

  if (!token && !endpoint.includes('/login')) {
    throw new Error('No authentication token')
  }
  
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
    console.log('Making request to:', endpoint, 'with config:', {
      method: config.method,
      hasToken: !!token
    })

    const response = await fetch(`${API_URL}${endpoint}`, config)
    console.log('Fetch response status:', response.status)

    // Check if response is ok before trying to parse JSON
    if (response.status === 401) {
      // Clear token on auth error
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Session expired - please login again')
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
