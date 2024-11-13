// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { api } from '../utils/fetchWithAuth.js'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }) {
  // Initialize user state from localStorage
  
const [user, setUser] = useState(() => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('userData');
    
    if (token && refreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return {
          ...parsedUser,
          token,
          refreshToken
        };
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return null;
      }
    }
    return null;
  } catch (e) {
    console.error('Error initializing user state:', e);
    return null;
  }
});

  
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  
const login = async (credentials) => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Create and store user data
      const userData = {
        id: data.user.id,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        // Add any other relevant user data
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Set user state with all necessary data
      setUser({
        ...userData,
        token: data.token,
        refreshToken: data.refreshToken
      });
      
      return {
        ...userData,
        token: data.token,
        refreshToken: data.refreshToken
      };
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};


  const refreshToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken')
      if (!currentRefreshToken) throw new Error('No refresh token')

      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: currentRefreshToken })
      })

      if (!response.ok) throw new Error('Failed to refresh token')

      const data = await response.json()
      localStorage.setItem('token', data.token)
      
      // Update user state with new token
      setUser(prev => prev ? { ...prev, token: data.token } : null)
      
      return data.token
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      throw error
    }
  }

  
const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Clear state and storage first
    setUser(null);
    localStorage.clear(); // Clear all storage

    if (refreshToken) {
      try {
        await api.post('/api/auth/logout', { refreshToken });
      } catch (err) {
        // Just log the error, don't prevent logout
        console.log('Server logout notification failed:', err);
      }
    }

    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    // Ensure user is logged out locally even if server logout fails
    setUser(null);
    localStorage.clear();
    navigate('/');
  }
};


  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('userData')
        
        if (!token || !storedRefreshToken || !storedUser) {
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser({
            ...userData,
            token,
            refreshToken: storedRefreshToken
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
                ...userData,
                token: newToken,
                refreshToken: storedRefreshToken
              })
            } else {
              throw new Error('Profile fetch failed after token refresh')
            }
          } catch (error) {
            console.error('Auth refresh error:', error)
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
