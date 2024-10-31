import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' 
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
