// src/components/TestAuth.jsx
import { useState } from 'react'

function TestAuth() {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const testRegister = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
          password: "password123"
        })
      })
      const data = await res.json()
      setResponse(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const testLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123"
        })
      })
      const data = await res.json()
      setResponse(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Authentication</h2>
      <div className="space-x-4">
        <button 
          onClick={testRegister}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Register
        </button>
        <button 
          onClick={testLogin}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default TestAuth
