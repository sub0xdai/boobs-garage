// src/pages/AdminDashboard.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ServicesManager from '../components/admin/ServicesManager'
import UserManager from '../components/admin/UserManager'
import BlogManager from '../components/admin/BlogManager'
import FeedbackManager from '../components/admin/FeedbackManager'


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
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your garage services, users, and content
          </p>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
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
