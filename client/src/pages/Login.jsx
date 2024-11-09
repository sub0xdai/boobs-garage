
// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      console.log('Full login response:', response)

      // Check user.isAdmin instead of just isAdmin
      if (response?.user?.isAdmin) {
        console.log('Admin user detected, navigating to admin dashboard')
        navigate('/admin')
      } else {
        console.log('Regular user detected, navigating to home')
        navigate('/')
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoginError(err.message || 'Failed to login')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Login</h1>
        
        {loginError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 
                         text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white 
                          ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white 
                          ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded
                           focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md 
                       hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

