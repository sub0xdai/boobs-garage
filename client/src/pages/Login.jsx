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
      <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-8 transition-colors duration-200">
        <h1 className="text-3xl font-bold mb-6 text-[#2e3440] dark:text-[#d8dee9]">Login</h1>
        
        {loginError && (
          <div className="bg-[#bf616a]/20 dark:bg-[#bf616a]/10 border border-[#bf616a] 
                       text-[#bf616a] dark:text-[#bf616a] px-4 py-3 rounded mb-4 transition-colors duration-200">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
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
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                       bg-[#eceff4] dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a] 
                       text-[#2e3440] dark:text-[#d8dee9] placeholder-[#4c566a] dark:placeholder-[#81a1c1]
                       ${errors.email ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#bf616a]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">
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
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0]
                       bg-[#eceff4] dark:bg-[#2e3440] border-[#d8dee9] dark:border-[#4c566a] 
                       text-[#2e3440] dark:text-[#d8dee9] placeholder-[#4c566a] dark:placeholder-[#81a1c1]
                       ${errors.password ? 'border-[#bf616a] dark:border-[#bf616a]' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-[#bf616a] dark:text-[#bf616a]">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-[#8fbcbb] dark:text-[#88c0d0] border-[#d8dee9] dark:border-[#4c566a] rounded
                         focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0] bg-[#eceff4] dark:bg-[#2e3440] transition-colors duration-200"
              />
              <label className="ml-2 text-sm text-[#4c566a] dark:text-[#81a1c1]">Remember me</label>
            </div>
            <a href="#" className="text-sm text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] transition-colors duration-200">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d08770] dark:bg-[#bf616a] text-[#eceff4] py-2 px-4 rounded-md 
                     hover:bg-[#c97a65] dark:hover:bg-[#a9545d] transition-all duration-200
                     shadow-md hover:shadow-lg active:scale-98"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4c566a] dark:text-[#81a1c1]">
            Don't have an account?{' '}
            <a href="/register" className="text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#5e81ac] dark:hover:text-[#5e81ac] transition-colors duration-200">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
