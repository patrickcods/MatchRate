import { useState, useEffect } from 'react';
import MatchList from './components/MatchList';
import RatingModal from './components/RatingModal';
import StandingsTable from './components/StandingsTable';
import BracketSimulator from './components/BracketSimulator';
import AuthModal from './components/AuthModal';
import RankingCampeoes from './components/RankingCampeoes';
import ProfilePage from './components/ProfilePage';
import RankingJogos from './components/RankingJogos';

function App() {
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [pagina, setPagina] = useState('home');
  const [usuario, setUsuario] = useState(null);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [meuCampeao, setMeuCampeao] = useState(null);

  const styles = {
    navButton: {
      marginTop: '15px',
      padding: '8px 20px',
      borderRadius: '20px',
      border: '1px solid #6c189c',
      backgroundColor: 'transparent',
      color: '#a78bfa',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  };

  const logout = () => {
    setUsuario(null);
    setMeuCampeao(null);
    localStorage.removeItem('token');
  };

  const buscarMeuCampeao = (token) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/simulacoes/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setMeuCampeao(data) })
      .catch(() => {});
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUsuario(data)
          buscarMeuCampeao(token)
        }
      })
      .catch(() => localStorage.removeItem('token'))
  }, [])

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("A URL da API não foi definida!");
      return;
    }
    fetch(`${apiUrl}/api/v1/jogos`)
      .then(res => res.json())
      .then(data => { setJogos(data.matches || data); })
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

              {usuario.avatar_url && (
                <img
                  src={usuario.avatar_url}
                  alt="avatar"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #6c189c', objectFit: 'cover' }}
                />
              )}

              <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Olá, {usuario.nome.split(' ')[0]}!</span>

              {meuCampeao?.campeao_nome && (
                <div
                  onClick={() => setPagina('perfil')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#1a1a2e', border: '1px solid #6c189c',
                    borderRadius: '20px', padding: '4px 12px', cursor: 'pointer'
                  }}
                  title="Clique para trocar seu campeão"
                >
                  {meuCampeao.campeao_flag && (
                    <img src={meuCampeao.campeao_flag} style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }} />
                  )}
                  <span style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 'bold' }}>{meuCampeao.campeao_nome}</span>
                </div>
              )}

              <button onClick={logout} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}>
                Sair
              </button>
            </div>
          ) : (
            <button onClick={() => setMostrarAuth(true)} style={{ padding: '12px 27px', fontSize: '18px', borderRadius: '20px', border: '1px solid #a78bfa', backgroundColor: '#261857b2', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }}>
              Entrar / Cadastrar
            </button>
          )}
        </div>

        {usuario && (
          <button onClick={() => setPagina('perfil')} style={styles.navButton}>
            Meu Perfil
          </button>
        )}
      </header>

      {mostrarAuth && (
        <AuthModal
          onClose={() => setMostrarAuth(false)}
          onLogin={(user) => {
            setUsuario(user);
            setMostrarAuth(false);
            const token = localStorage.getItem('token');
            if (token) buscarMeuCampeao(token);
          }}
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

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto 2rem auto' }}>
            <div style={{ flex: '1 1 400px' }}>
              <RankingCampeoes />
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <RankingJogos jogos={jogos} />
            </div>
          </div>

          <MatchList jogos={jogos} onSelecionar={setJogoSelecionado} />
        </>
      ) : pagina === 'simulador' ? (
        <BracketSimulator />
      ) : (
        <ProfilePage
          usuario={usuario}
          onAtualizarUsuario={(novoUsuario) => {
            setUsuario(novoUsuario);
            const token = localStorage.getItem('token');
            if (token) buscarMeuCampeao(token);
          }}
          onAtualizarCampeao={(novaSimulacao) => setMeuCampeao(novaSimulacao)}
        />
      )}
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