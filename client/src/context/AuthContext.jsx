// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { api } from '../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

// Utility function to decode JWT payload
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    console.log('Decoded token payload:', payload)
    return payload
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

// Utility to get admin status from token
const getAdminFromToken = (token) => {
  const payload = decodeToken(token)
  const isAdmin = payload?.user?.isAdmin === true
  console.log('Admin status from token:', isAdmin)
  return isAdmin
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('userData')

      if (token && refreshToken && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const isAdmin = getAdminFromToken(token)
        
        const userData = {
          ...parsedUser,
          token,
          refreshToken,
          isAdmin
        }
        
        console.log('Initial user state:', userData)
        return userData
      }
      return null
    } catch (error) {
      console.error('User state initialization error:', error)
      localStorage.clear()
      return null
    }
  })

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Update user data and storage
  const updateUserState = (userData, token, refreshToken) => {
    const isAdmin = getAdminFromToken(token)
    
    const fullUserData = {
      ...userData,
      token,
      refreshToken,
      isAdmin
    }
    
    console.log('Updating user state:', fullUserData)
    
    // Update storage
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('userData', JSON.stringify({
      ...userData,
      isAdmin
    }))
    
    setUser(fullUserData)
    return fullUserData
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })
      
      const data = await response.json()
      console.log('Login response:', data)
      
      if (response.ok) {
        return updateUserState(data.user, data.token, data.refreshToken)
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken')
    if (!currentRefreshToken) {
      throw new Error('No refresh token')
    }

    const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: currentRefreshToken })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    console.log('Token refresh response:', data)
    
    if (user) {
      updateUserState(user, data.token, currentRefreshToken)
    }
    
    return data.token
  }

  // Effect for initial auth check
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const profileData = await response.json()
          console.log('Profile verification:', profileData)
          
          if (user) {
            updateUserState(profileData, token, user.refreshToken)
          }
        } else {
          // Try refresh token
          try {
            const newToken = await refreshToken()
            const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${newToken}`
              }
            })

            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              if (user) {
                updateUserState(profileData, newToken, user.refreshToken)
              }
            }
          } catch (error) {
            console.error('Profile refresh error:', error)
            await logout()
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error)
        await logout()
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      setUser(null)
      localStorage.clear()

      if (refreshToken) {
        try {
          await api.post('/api/auth/logout', { refreshToken })
        } catch (err) {
          console.warn('Server logout notification failed:', err)
        }
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      navigate('/')
    }
  }

  // Consistent object reference for value
  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAdmin: user?.isAdmin === true
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
