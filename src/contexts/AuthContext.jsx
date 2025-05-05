import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('airbnbUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // For demo purposes, we'll use localStorage to simulate authentication
  // In a real app, you would use a proper authentication system
  const login = (email, password) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: '123',
          name: 'John Doe',
          email,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isHost: false
        }
        localStorage.setItem('airbnbUser', JSON.stringify(user))
        setCurrentUser(user)
        resolve(user)
      }, 1000)
    })
  }

  const signup = (name, email, password) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: '123',
          name,
          email,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isHost: false
        }
        localStorage.setItem('airbnbUser', JSON.stringify(user))
        setCurrentUser(user)
        resolve(user)
      }, 1000)
    })
  }

  const logout = () => {
    localStorage.removeItem('airbnbUser')
    setCurrentUser(null)
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem('airbnbUser', JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}