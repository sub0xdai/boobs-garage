// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
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
      console.log('Login response:', data) // Debug log
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        const userData = {
          token: data.token,
          isAdmin: data.user.isAdmin,
          email: data.user.email,
          id: data.user.id
        }
        console.log('Setting user data:', userData) // Debug log
        setUser(userData)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Login error:', error) // Debug log
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Token from storage:', token) // Debug log

    if (token) {
      fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log('Profile data:', data) // Debug log
        if (data.id) {
          const userData = {
            token,
            isAdmin: data.isAdmin,
            email: data.email,
            id: data.id
          }
          console.log('Setting user data from profile:', userData) // Debug log
          setUser(userData)
        } else {
          console.log('No user ID in profile response') // Debug log
          localStorage.removeItem('token')
        }
      })
      .catch((error) => {
        console.error('Profile fetch error:', error) // Debug log
        localStorage.removeItem('token')
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
