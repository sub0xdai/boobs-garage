// src/pages/AdminDashboard.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ServicesManager from '../components/admin/ServicesManager'
import UserManager from '../components/admin/UserManager'
import BlogManager from '../components/admin/BlogManager'
import FeedbackManager from '../components/admin/FeedbackManager'
import HomeImageManager from '../components/admin/HomeImageManager'

function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('services')

  const tabs = [
    { 
      id: 'services', 
      label: 'Services & Prices',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'users', 
      label: 'User Management',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 'blog', 
      label: 'Blog Posts',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      id: 'feedback', 
      label: 'Feedback',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    },
    {
      id: 'homeimage', 
      label: 'Home Image',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#d8dee9] dark:bg-[#2e3440] flex items-center justify-center transition-colors duration-200">
        <div className="text-center p-8 bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md transition-colors duration-200">
          <svg className="w-16 h-16 text-[#bf616a] dark:text-[#bf616a] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-2">Access Denied</h2>
          <p className="text-[#4c566a] dark:text-[#81a1c1]">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d8dee9] dark:bg-[#2e3440] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2e3440] dark:text-[#d8dee9]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#4c566a] dark:text-[#81a1c1]">
            Manage your garage services, users, and content
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md mb-6 transition-colors duration-200">
          <nav className="flex overflow-x-auto flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-4 py-2 whitespace-nowrap transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'bg-[#88c0d0]/20 dark:bg-[#88c0d0]/10 text-[#5e81ac] dark:text-[#88c0d0]'
                    : 'text-[#4c566a] dark:text-[#81a1c1] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e]'}
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-200">
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'feedback' && <FeedbackManager />}
          {activeTab === 'homeimage' && <HomeImageManager />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
