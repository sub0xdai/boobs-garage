// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Complete the checkSession function
  const checkSession = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser({
          token,
          ...data,
          isAdmin: Boolean(data.is_admin)
        });
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkSession(token); // Use checkSession instead of just setting the token
    }
    setLoading(false)
  }, [])

  // Rest of your code stays the same
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
      if (response.ok) {
        localStorage.setItem('token', data.token)
        await checkSession(data.token) // Add checkSession here too
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    checkSession // Add to the context value
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
