import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, register as registerApi } from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('nirvik_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const register = async (data) => {
    const res = await registerApi(data)
    localStorage.setItem('nirvik_token', res.token)
    localStorage.setItem('nirvik_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  const login = async (data) => {
    const res = await loginApi(data)
    localStorage.setItem('nirvik_token', res.token)
    localStorage.setItem('nirvik_user', JSON.stringify(res.user))
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('nirvik_token')
    localStorage.removeItem('nirvik_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)