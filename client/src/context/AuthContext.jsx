// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { api } from '../utils/fetchWithAuth.js'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  
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
    console.log('Raw login response:', data) // Debug log
    
    if (response.ok) {
      // Store both tokens
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      // Set user with all data
      const userData = {
        ...data.user,
        token: data.token,
        refreshToken: data.refreshToken
      }
      
      console.log('Setting user data:', userData) // Debug log
      setUser(userData)
      
      // Return the full user data
      return userData
    } else {
      throw new Error(data.message || 'Login failed')
    }
  } catch (error) {
    console.error('Login error details:', error)
    throw error
  } finally {
    setLoading(false)
  }
}

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw new Error('No refresh token')

      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) throw new Error('Failed to refresh token')

      const data = await response.json()
      localStorage.setItem('token', data.token)
      return data.token
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      throw error
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  // Add initial auth check
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        
        if (!token || !storedRefreshToken) {
          setLoading(false)
          return
        }

        // Try to get user profile
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser({
            token,
            refreshToken: storedRefreshToken,
            ...userData
          })
        } else {
          // Try to refresh token
          try {
            const newToken = await refreshToken()
            const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${newToken}`
              }
            })

            if (profileResponse.ok) {
              const userData = await profileResponse.json()
              setUser({
                token: newToken,
                refreshToken: storedRefreshToken,
                ...userData
              })
            } else {
              throw new Error('Profile fetch failed after token refresh')
            }
          } catch (error) {
            console.error('Auth refresh error:', error)
            logout()
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, []) // Empty dependency array means this runs once on mount

  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
