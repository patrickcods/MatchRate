import { useState, useEffect } from 'react';
import MatchList from './components/MatchList';
import RatingModal from './components/RatingModal';
import StandingsTable from './components/StandingsTable';
import BracketSimulator from './components/BracketSimulator';
import AuthModal from './components/AuthModal';
import { Eye, EyeOff } from 'lucide-react';
import RankingCampeoes from './components/RankingCampeoes'


function App() {
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [pagina, setPagina] = useState('home');
  const [usuario, setUsuario] = useState(null); 
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token'); 
  };

 useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) return
  fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : null)
    .then(data => { if (data) setUsuario(data) })
    .catch(() => localStorage.removeItem('token'))
}, [])

 useEffect(() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("Variável de ambiente carregada:", apiUrl)
  if (!apiUrl) {
    console.error("A URL da API não foi definida!");
    return;
  }

  fetch(`${apiUrl}/api/v1/jogos`)
    .then(res => res.json())
    .then(data => {
      setJogos(data.matches || data);
    })
    .catch(err => console.error("Erro ao buscar jogos no endpoint:", err));
}, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER E TÍTULO */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
    <h1 style={{ color: '#ffffff', fontSize: '5rem', fontWeight: '900', margin: 15 }}>
      Match<span style={{ color: '#6c189c' }}>Rate</span>
    </h1>
    <p style={{ color: '#888', marginTop: '1.8rem', fontSize: '1.1rem' }}>
      Avalie os jogos da Copa do Mundo 2026
    </p>
    <div style={{ marginTop: '1rem' }}>
      {usuario ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Olá, {usuario.nome.split(' ')[0]}!</span>
          <button onClick={logout} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}>
            Sair
          </button>
        </div>
      ) : (
        <button onClick={() => setMostrarAuth(true)} style={{ padding: '12px 27px', fontSize:'18px', borderRadius: '20px', border: '1px solid #a78bfa', backgroundColor: '#261857b2', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }}>
          Entrar / Cadastrar
        </button>
      )}
    </div>
  </header>

  {mostrarAuth && (
    <AuthModal
      onClose={() => setMostrarAuth(false)}
      onLogin={(user) => { setUsuario(user); setMostrarAuth(false); }}
    />
  )}

      {/* MENU DE NAVEGAÇÃO */}
      <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setPagina('home')} style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}>Jogos</button>
        <button onClick={() => setPagina('simulador')} style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}>Simulador</button>
      </nav>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      {pagina === 'home' ? (
        <>
          <StandingsTable />
          <RankingCampeoes />
          <MatchList jogos={jogos} onSelecionar={setJogoSelecionado} />
        </>
      ) : (
        <BracketSimulator usuario={usuario} />
      )}
      
      {/* MODAL DE AVALIAÇÃO */}
      {jogoSelecionado && (
        <RatingModal 
          jogo={jogoSelecionado} 
          onClose={() => setJogoSelecionado(null)} 
        />
      )}
      
    </div>
  );
}

export default App;