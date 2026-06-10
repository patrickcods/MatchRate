import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const GRUPOS_DADOS = {
  A: [{ nome: 'México', flag: 'https://flagcdn.com/w40/mx.png' }, { nome: 'África do Sul', flag: 'https://flagcdn.com/w40/za.png' }, { nome: 'Coreia do Sul', flag: 'https://flagcdn.com/w40/kr.png' }, { nome: 'República Checa', flag: 'https://flagcdn.com/w40/cz.png' }],
  B: [{ nome: 'Canadá', flag: 'https://flagcdn.com/w40/ca.png' }, { nome: 'Bósnia e Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' }, { nome: 'Catar', flag: 'https://flagcdn.com/w40/qa.png' }, { nome: 'Suíça', flag: 'https://flagcdn.com/w40/ch.png' }],
  C: [{ nome: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' }, { nome: 'Marrocos', flag: 'https://flagcdn.com/w40/ma.png' }, { nome: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' }, { nome: 'Escócia', flag: 'https://flagcdn.com/w40/gb-sct.png' }],
  D: [{ nome: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' }, { nome: 'Paraguai', flag: 'https://flagcdn.com/w40/py.png' }, { nome: 'Austrália', flag: 'https://flagcdn.com/w40/au.png' }, { nome: 'Turquia', flag: 'https://flagcdn.com/w40/tr.png' }],
  E: [{ nome: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png' }, { nome: 'Curaçao', flag: 'https://flagcdn.com/w40/cw.png' }, { nome: 'Costa do Marfim', flag: 'https://flagcdn.com/w40/ci.png' }, { nome: 'Equador', flag: 'https://flagcdn.com/w40/ec.png' }],
  F: [{ nome: 'Holanda', flag: 'https://flagcdn.com/w40/nl.png' }, { nome: 'Japão', flag: 'https://flagcdn.com/w40/jp.png' }, { nome: 'Suécia', flag: 'https://flagcdn.com/w40/se.png' }, { nome: 'Tunísia', flag: 'https://flagcdn.com/w40/tn.png' }],
  G: [{ nome: 'Bélgica', flag: 'https://flagcdn.com/w40/be.png' }, { nome: 'Egito', flag: 'https://flagcdn.com/w40/eg.png' }, { nome: 'Irã', flag: 'https://flagcdn.com/w40/ir.png' }, { nome: 'Nova Zelândia', flag: 'https://flagcdn.com/w40/nz.png' }],
  H: [{ nome: 'Espanha', flag: 'https://flagcdn.com/w40/es.png' }, { nome: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' }, { nome: 'Arábia Saudita', flag: 'https://flagcdn.com/w40/sa.png' }, { nome: 'Uruguai', flag: 'https://flagcdn.com/w40/uy.png' }],
  I: [{ nome: 'França', flag: 'https://flagcdn.com/w40/fr.png' }, { nome: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' }, { nome: 'Iraque', flag: 'https://flagcdn.com/w40/iq.png' }, { nome: 'Noruega', flag: 'https://flagcdn.com/w40/no.png' }],
  J: [{ nome: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' }, { nome: 'Argélia', flag: 'https://flagcdn.com/w40/dz.png' }, { nome: 'Áustria', flag: 'https://flagcdn.com/w40/at.png' }, { nome: 'Jordânia', flag: 'https://flagcdn.com/w40/jo.png' }],
  K: [{ nome: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' }, { nome: 'RD Congo', flag: 'https://flagcdn.com/w40/cd.png' }, { nome: 'Uzbequistão', flag: 'https://flagcdn.com/w40/uz.png' }, { nome: 'Colômbia', flag: 'https://flagcdn.com/w40/co.png' }],
  L: [{ nome: 'Inglaterra', flag: 'https://flagcdn.com/w40/gb-eng.png' }, { nome: 'Croácia', flag: 'https://flagcdn.com/w40/hr.png' }, { nome: 'Gana', flag: 'https://flagcdn.com/w40/gh.png' }, { nome: 'Panamá', flag: 'https://flagcdn.com/w40/pa.png' }],
}

const TODOS_TIMES = Object.values(GRUPOS_DADOS).flat()

function AuthModal({ onClose, onLogin }) {
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [verSenha, setVerSenha] = useState(false)
  const [etapa, setEtapa] = useState('auth') // 'auth' | 'boasvindas'
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [campeaoEscolhido, setCampeaoEscolhido] = useState(null)
  const [salvandoCampeao, setSalvandoCampeao] = useState(false)
  const [busca, setBusca] = useState('')

  const inputStyle = {
    width: '100%', padding: '12px', backgroundColor: '#222',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '1rem', boxSizing: 'border-box', marginBottom: '0.75rem'
  }

  const handleSubmit = async () => {
    setErro('')
    setCarregando(true)
    try {
      const API = import.meta.env.VITE_API_URL

      if (modo === 'login') {
        const form = new URLSearchParams()
        form.append('username', email)
        form.append('password', senha)
        const res = await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: form })
        if (!res.ok) throw new Error('Email ou senha incorretos')
        const data = await res.json()
        localStorage.setItem('token', data.access_token)
        const me = await fetch(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
        const userData = await me.json()
        onLogin(userData)
      } else {
        // Cadastro — depois mostra boas-vindas
        const res = await fetch(`${API}/api/v1/auth/cadastro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha })
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail || 'Erro ao cadastrar')
        }
        const form = new URLSearchParams()
        form.append('username', email)
        form.append('password', senha)
        const loginRes = await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: form })
        const loginData = await loginRes.json()
        localStorage.setItem('token', loginData.access_token)
        const me = await fetch(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${loginData.access_token}` } })
        const userData = await me.json()
        setUsuarioLogado(userData)
        setEtapa('boasvindas')
      }
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  const salvarCampeaoEContinuar = async () => {
    if (!campeaoEscolhido) { onLogin(usuarioLogado); return }
    setSalvandoCampeao(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/simulacoes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          campeao_nome: campeaoEscolhido.nome,
          campeao_flag: campeaoEscolhido.flag,
          semi: [], quartas: [], oitavas: []
        })
      })
    } catch (e) {
      console.error(e)
    } finally {
      setSalvandoCampeao(false)
      onLogin(usuarioLogado)
    }
  }

  const timesFiltrados = busca
    ? TODOS_TIMES.filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
    : TODOS_TIMES

  // TELA DE BOAS-VINDAS
  if (etapa === 'boasvindas') {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
        <div style={{ backgroundColor: '#141414', padding: '2rem', borderRadius: '16px', width: '420px', maxHeight: '90vh', overflowY: 'auto', color: '#fff', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', fontSize: '1.6rem' }}>
            Bem-vindo, {usuarioLogado?.nome?.split(' ')[0]}! 🎉
          </h2>
          <p style={{ color: '#888', textAlign: 'center', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>
            Quem você acha que vai ser campeão da Copa 2026?
          </p>

          {campeaoEscolhido && (
            <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #6c189c', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <img src={campeaoEscolhido.flag} style={{ width: '40px', height: '27px', objectFit: 'cover', borderRadius: '3px' }} />
              <span style={{ fontWeight: 'bold', color: '#a78bfa', fontSize: '1.1rem' }}>{campeaoEscolhido.nome}</span>
              <button onClick={() => setCampeaoEscolhido(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          )}

          <input
            placeholder="Buscar país..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ ...inputStyle, marginBottom: '1rem' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
            {timesFiltrados.map(time => (
              <button
                key={time.nome}
                onClick={() => setCampeaoEscolhido(time)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '10px 6px', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: campeaoEscolhido?.nome === time.nome ? '#2d1b4e' : '#1a1a1a',
                  border: campeaoEscolhido?.nome === time.nome ? '1px solid #a855f7' : '1px solid #2a2a2a',
                  color: '#fff', fontSize: '0.75rem', textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <img src={time.flag} alt={time.nome} style={{ width: '32px', height: '21px', objectFit: 'cover', borderRadius: '2px' }} />
                <span style={{ lineHeight: 1.2 }}>{time.nome}</span>
              </button>
            ))}
          </div>

          <button
            onClick={salvarCampeaoEContinuar}
            disabled={salvandoCampeao}
            style={{
              width: '100%', padding: '12px', backgroundColor: campeaoEscolhido ? '#6c189c' : '#333',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.75rem'
            }}
          >
            {salvandoCampeao ? 'Salvando...' : campeaoEscolhido ? `Torcer por ${campeaoEscolhido.nome}! 🏆` : 'Salvar e entrar'}
          </button>

          <button onClick={() => onLogin(usuarioLogado)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem' }}>
            Pular por agora
          </button>
        </div>
      </div>
    )
  }

  // TELA DE LOGIN/CADASTRO
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
          <button
            onClick={() => setVerSenha(!verSenha)}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {verSenha ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
          </button>
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