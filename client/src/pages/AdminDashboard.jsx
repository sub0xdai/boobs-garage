// src/pages/AdminDashboard.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('services')

  // Tabs for different admin functions
  const tabs = [
    { id: 'services', label: 'Services & Prices' },
    { id: 'users', label: 'User Management' },
    { id: 'blog', label: 'Blog Posts' },
    { id: 'feedback', label: 'Feedback' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your garage services, users, and content
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'feedback' && <FeedbackManager />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
