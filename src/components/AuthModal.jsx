import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose, onLogin }) {
  const { login, cadastro } = useAuth()
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [verSenha, setVerSenha] = useState(false)

  const inputStyle = {
    width: '100%', padding: '12px', backgroundColor: '#222',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '1rem', boxSizing: 'border-box', marginBottom: '0.75rem'
  }

  const handleSubmit = async () => {
    setErro('')
    setCarregando(true)
    try {
      if (modo === 'login') {
        await login(email, senha)
      } else {
        await cadastro(nome, email, senha)
      }
      const token = localStorage.getItem('token')
      const me = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userData = await me.json()
      onLogin(userData)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div style={{ backgroundColor: '#141414', padding: '2rem', borderRadius: '16px', width: '360px', color: '#fff', border: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{modo === 'login' ? 'Entrar' : 'Criar conta'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        {modo === 'cadastro' && (
          <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
        )}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
  <input
    placeholder="Senha"
    type={verSenha ? 'text' : 'password'}
    value={senha}
    onChange={e => setSenha(e.target.value)}
    style={{ ...inputStyle, marginBottom: 0, paddingRight: '3rem' }}
  />
  <span
    onClick={() => setVerSenha(!verSenha)}
    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: '1.1rem' }}
  >
    <button onClick={() => setVerSenha(!verSenha)}>
      {verSenha ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
    </button>
  </span>
</div>

        {erro && <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>{erro}</p>}

        <button onClick={handleSubmit} disabled={carregando} style={{
          width: '100%', padding: '12px', backgroundColor: '#6c189c',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem'
        }}>
          {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', margin: 0 }}>
          {modo === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          <span onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro('') }}
            style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 'bold' }}>
            {modo === 'login' ? 'Criar conta' : 'Entrar'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default AuthModal