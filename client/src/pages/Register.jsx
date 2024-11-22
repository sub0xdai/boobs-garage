// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [registerError, setRegisterError] = useState('')
  const navigate = useNavigate()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setRegisterError('Passwords do not match')
        return
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.fullName,
          email: data.email,
          password: data.password
        })
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('token', result.token)
        navigate('/')
      } else {
        setRegisterError(result.message)
      }
    } catch (error) {
      setRegisterError('An error occurred during registration')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-8 transition-colors duration-200">
        <h1 className="text-3xl font-bold mb-6 text-[#2e3440] dark:text-[#eceff4]">Create Account</h1>
        
        {registerError && (
          <div className="bg-[#bf616a] bg-opacity-20 dark:bg-opacity-30 border border-[#bf616a] 
                         text-[#bf616a] dark:text-[#d08770] px-4 py-3 rounded mb-4">
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#e5e9f0] mb-1">
              Full Name
            </label>
            <input 
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              type="text" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                bg-[#eceff4] dark:bg-[#4c566a] border-[#d8dee9] dark:border-[#4c566a] 
                text-[#2e3440] dark:text-[#eceff4] focus:ring-[#88c0d0] dark:focus:ring-[#88c0d0] 
                placeholder-[#9097a3] dark:placeholder-[#d8dee9]
                ${errors.fullName ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#d08770]">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#e5e9f0] mb-1">
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                bg-[#eceff4] dark:bg-[#4c566a] border-[#d8dee9] dark:border-[#4c566a] 
                text-[#2e3440] dark:text-[#eceff4] focus:ring-[#88c0d0] dark:focus:ring-[#88c0d0] 
                placeholder-[#9097a3] dark:placeholder-[#d8dee9]
                ${errors.email ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#d08770]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#e5e9f0] mb-1">
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                bg-[#eceff4] dark:bg-[#4c566a] border-[#d8dee9] dark:border-[#4c566a] 
                text-[#2e3440] dark:text-[#eceff4] focus:ring-[#88c0d0] dark:focus:ring-[#88c0d0] 
                placeholder-[#9097a3] dark:placeholder-[#d8dee9]
                ${errors.password ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#d08770]">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#e5e9f0] mb-1">
              Confirm Password
            </label>
            <input 
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              type="password" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                bg-[#eceff4] dark:bg-[#4c566a] border-[#d8dee9] dark:border-[#4c566a] 
                text-[#2e3440] dark:text-[#eceff4] focus:ring-[#88c0d0] dark:focus:ring-[#88c0d0] 
                placeholder-[#9097a3] dark:placeholder-[#d8dee9]
                ${errors.confirmPassword ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#d08770]">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input 
              {...register('terms', { required: 'You must accept the terms' })}
              type="checkbox" 
              className="h-4 w-4 text-[#88c0d0] dark:text-[#88c0d0] border-[#d8dee9] dark:border-[#4c566a] rounded
                         focus:ring-[#88c0d0] dark:focus:ring-[#88c0d0] bg-[#eceff4] dark:bg-[#4c566a]"
            />
            <label className="ml-2 text-sm text-[#4c566a] dark:text-[#e5e9f0]">
              I agree to the{' '}
              <a href="#" className="text-[#5e81ac] dark:text-[#88c0d0] hover:text-[#81a1c1] dark:hover:text-[#8fbcbb] transition-colors duration-200">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-[#5e81ac] dark:text-[#88c0d0] hover:text-[#81a1c1] dark:hover:text-[#8fbcbb] transition-colors duration-200">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-[#bf616a] dark:text-[#d08770]">{errors.terms.message}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-[#d08770] dark:bg-[#bf616a] text-white py-2 px-4 rounded-md 
                     hover:bg-[#bf616a] dark:hover:bg-[#d08770] transition-all duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4c566a] dark:text-[#e5e9f0]">
            Already have an account?{' '}
            <a href="/login" className="text-[#5e81ac] dark:text-[#88c0d0] hover:text-[#81a1c1] dark:hover:text-[#8fbcbb] transition-colors duration-200">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
