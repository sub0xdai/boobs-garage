// src/components/ThemeToggle.jsx
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
