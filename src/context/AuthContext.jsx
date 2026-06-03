import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const API = 'https://matchrate.onrender.com'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUsuario(data) })
        .finally(() => setCarregando(false))
    } else {
      setCarregando(false)
    }
  }, [])

  const login = async (email, senha) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', senha)
    const res = await fetch(`${API}/api/v1/auth/login`, {
      method: 'POST',
      body: form
    })
    if (!res.ok) throw new Error('Email ou senha incorretos')
    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    const me = await fetch(`${API}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` }
    })
    setUsuario(await me.json())
  }

  const cadastro = async (nome, email, senha) => {
    const res = await fetch(`${API}/api/v1/auth/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Erro ao cadastrar')
    }
    await login(email, senha)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastro, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)